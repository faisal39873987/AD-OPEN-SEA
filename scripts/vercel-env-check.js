#!/usr/bin/env node

/**
 * Vercel Environment Variables Check Script
 * 
 * This script validates the presence of required environment variables in Vercel.
 * It uses the Vercel CLI to check if variables are set correctly.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Vercel environment variables...');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Vercel CLI is not installed. Please install it with: npm i -g vercel');
  process.exit(1);
}

// Required environment variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

// Function to check if a variable exists in Vercel
const checkVercelEnv = (varName) => {
  try {
    // Pull environment variables from Vercel without revealing values
    const result = execSync('vercel env ls', { encoding: 'utf-8' });
    return result.includes(varName);
  } catch (error) {
    console.error(`❌ Error checking Vercel environment: ${error.message}`);
    return false;
  }
};

// Create a Vercel env setup script
const createEnvSetupScript = (missingVars) => {
  const scriptPath = path.join(__dirname, 'setup-vercel-env.sh');
  
  let scriptContent = `#!/bin/bash
# Vercel Environment Setup Script
# Run this script to set up missing environment variables in Vercel

echo "Setting up environment variables in Vercel..."
`;

  // Add commands to set each missing variable
  missingVars.forEach(varName => {
    scriptContent += `
echo "Setting up ${varName}..."
read -p "Enter value for ${varName}: " ${varName}_VALUE
vercel env add ${varName} production <<< $${varName}_VALUE
`;
  });

  scriptContent += `
echo "✅ Environment variables have been set up in Vercel."
echo "Run 'vercel --prod' to redeploy your application with the new environment variables."
`;

  fs.writeFileSync(scriptPath, scriptContent);
  fs.chmodSync(scriptPath, '755');
  
  console.log(`\n📝 Created setup script at: ${scriptPath}`);
  console.log('Run this script to add missing variables to Vercel.');
};

// Check local .env.local file
console.log('\n📋 Checking local environment variables...');
let localEnvVars = [];

try {
  const localEnvPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(localEnvPath)) {
    const content = fs.readFileSync(localEnvPath, 'utf-8');
    localEnvVars = content
      .split('\n')
      .filter(line => !line.startsWith('#') && line.includes('='))
      .map(line => line.split('=')[0].trim());
    
    console.log('✅ Found local environment variables in .env.local');
  } else {
    console.warn('⚠️ No .env.local file found.');
  }
} catch (error) {
  console.error('❌ Error reading local environment file:', error.message);
}

// Check Vercel environment variables
console.log('\n📋 Checking Vercel environment variables...');

console.log('🔄 Authenticating with Vercel (if needed)...');
try {
  execSync('vercel whoami', { stdio: 'ignore' });
} catch (error) {
  console.log('🔄 Please authenticate with Vercel:');
  try {
    execSync('vercel login', { stdio: 'inherit' });
  } catch (loginError) {
    console.error('❌ Failed to authenticate with Vercel.');
    process.exit(1);
  }
}

console.log('🔄 Checking Vercel project...');
try {
  execSync('vercel', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Failed to link Vercel project.');
  process.exit(1);
}

let missingInVercel = [];
let existingInVercel = [];

// Optional: Actually check each variable in Vercel
console.log('🔄 Checking environment variables in Vercel...');
for (const varName of requiredVars) {
  const exists = checkVercelEnv(varName);
  
  if (exists) {
    existingInVercel.push(varName);
    console.log(`✅ ${varName}: Found in Vercel`);
  } else {
    missingInVercel.push(varName);
    console.log(`❌ ${varName}: Missing in Vercel`);
  }
}

// Summary
console.log('\n📊 Environment Variables Summary:');
console.log(`✅ ${existingInVercel.length} variables found in Vercel.`);
console.log(`❌ ${missingInVercel.length} variables missing in Vercel.`);

// Create setup script if there are missing variables
if (missingInVercel.length > 0) {
  console.log('\n⚠️ Missing environment variables in Vercel:');
  missingInVercel.forEach(varName => console.log(`  - ${varName}`));
  
  // Only create the setup script if there are missing variables
  createEnvSetupScript(missingInVercel);
  
  // Instructions for manual setup
  console.log('\n📝 Manual setup instructions:');
  console.log('1. Go to your Vercel project settings');
  console.log('2. Navigate to the "Environment Variables" tab');
  console.log('3. Add each missing variable from the list above');
  console.log('4. Redeploy your application\n');
  
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set in Vercel.');
  process.exit(0);
}
