#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * This script checks if all required environment variables are set
 * and validates connections to external services.
 */

const chalk = require('chalk');
const { createClient } = require('@supabase/supabase-js');

// Define required environment variables
const requiredVariables = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_GPT_ASSISTANT_URL'
];

// Check if all required environment variables are set
console.log(chalk.blue('🔍 Checking environment variables...'));

const missingVariables = requiredVariables.filter(varName => !process.env[varName]);

if (missingVariables.length > 0) {
  console.log(chalk.red('❌ Missing required environment variables:'));
  missingVariables.forEach(varName => {
    console.log(chalk.red(`   - ${varName}`));
  });
  console.log(chalk.yellow('\n⚠️  Please set these variables in your environment or .env file'));
  process.exit(1);
} else {
  console.log(chalk.green('✅ All required environment variables are set'));
}

// Check Supabase connection
async function checkSupabaseConnection() {
  try {
    console.log(chalk.blue('\n🔌 Testing Supabase connection...'));
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or Anon Key is missing');
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Try a simple query
    const { data, error } = await supabase.from('services').select('count').limit(1);
    
    if (error) throw error;
    
    console.log(chalk.green('✅ Supabase connection successful'));
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Supabase connection failed: ${error.message}`));
    return false;
  }
}

// Check OpenAI API key validity
async function checkOpenAIKey() {
  try {
    console.log(chalk.blue('\n🔑 Testing OpenAI API key...'));
    
    const openAIKey = process.env.OPENAI_API_KEY;
    
    if (!openAIKey) {
      throw new Error('OpenAI API key is missing');
    }
    
    // Make a simple request to check if the key is valid
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${openAIKey}`
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error?.message || 'Invalid OpenAI API key');
    }
    
    console.log(chalk.green('✅ OpenAI API key is valid'));
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ OpenAI API key validation failed: ${error.message}`));
    return false;
  }
}

// Check Stripe keys
async function checkStripeKeys() {
  try {
    console.log(chalk.blue('\n💳 Testing Stripe publishable key format...'));
    
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!stripeKey) {
      throw new Error('Stripe publishable key is missing');
    }
    
    // Simple format check (not a full validation)
    if (!stripeKey.startsWith('pk_')) {
      throw new Error('Invalid Stripe publishable key format (should start with pk_)');
    }
    
    console.log(chalk.green('✅ Stripe publishable key format is valid'));
    
    // We don't test the secret key directly for security reasons
    console.log(chalk.yellow('⚠️  Note: Stripe secret key and webhook secret are not tested for security reasons'));
    
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Stripe key validation failed: ${error.message}`));
    return false;
  }
}

// Run all checks
async function runAllChecks() {
  let success = true;
  
  // Check Supabase connection
  const supabaseResult = await checkSupabaseConnection();
  if (!supabaseResult) success = false;
  
  // Check OpenAI key
  const openaiResult = await checkOpenAIKey();
  if (!openaiResult) success = false;
  
  // Check Stripe keys
  const stripeResult = await checkStripeKeys();
  if (!stripeResult) success = false;
  
  console.log('\n' + (success 
    ? chalk.green('✅ All checks passed! Your environment is configured correctly.')
    : chalk.yellow('⚠️  Some checks failed. Please review the issues above.'))
  );
  
  if (!success) {
    console.log(chalk.blue('\n💡 Troubleshooting tips:'));
    console.log(chalk.white('1. Check that all API keys are current and haven\'t expired'));
    console.log(chalk.white('2. Verify that the Supabase project is active and not paused'));
    console.log(chalk.white('3. Ensure your IP is not being blocked by any of the services'));
    console.log(chalk.white('4. Check for typos in environment variable values'));
    console.log(chalk.white('5. See ENV_VARIABLES_CHECKLIST.md for more details'));
  }
  
  return success;
}

// Run the script
runAllChecks();
