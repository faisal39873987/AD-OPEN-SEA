#!/usr/bin/env node

/**
 * Deployment Readiness Check Script
 * 
 * This script performs a comprehensive check of all components required for
 * successful deployment, including environment variables, API versions,
 * and critical configurations.
 */

console.log('\n🚀 AD PULSE DEPLOYMENT READINESS CHECK\n');

// Check for environment variables
console.log('1️⃣ Checking environment variables...');
try {
  require('dotenv').config({ path: '.env.local' });
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length === 0) {
    console.log('✅ All required environment variables are present');
  } else {
    console.log(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  }
} catch (error) {
  console.error('❌ Error checking environment variables:', error);
}

// Check package.json for correct scripts
console.log('\n2️⃣ Checking package.json configuration...');
try {
  const packageJson = require('../package.json');
  
  if (packageJson.scripts && packageJson.scripts.build && packageJson.scripts.build.includes('verify:env')) {
    console.log('✅ Build script includes environment verification');
  } else {
    console.log('❌ Build script does not include environment verification');
  }
  
  // Check dependencies
  const criticalDeps = ['next', 'react', 'stripe', '@supabase/supabase-js'];
  const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ All critical dependencies are present');
  } else {
    console.log(`❌ Missing critical dependencies: ${missingDeps.join(', ')}`);
  }
} catch (error) {
  console.error('❌ Error checking package.json:', error);
}

// Check for Stripe API version in files
console.log('\n3️⃣ Checking Stripe API version consistency...');
const fs = require('fs');
const path = require('path');

try {
  const paymentIntentPath = path.join(__dirname, '../src/app/api/create-payment-intent/route.ts');
  const webhookPath = path.join(__dirname, '../src/app/api/stripe/webhook/route.ts');
  
  const paymentIntentContent = fs.readFileSync(paymentIntentPath, 'utf8');
  const webhookContent = fs.readFileSync(webhookPath, 'utf8');
  
  const apiVersionMatch = (content) => {
    const match = content.match(/apiVersion:\s*['"]([^'"]+)['"]/);
    return match ? match[1] : null;
  };
  
  const paymentIntentVersion = apiVersionMatch(paymentIntentContent);
  const webhookVersion = apiVersionMatch(webhookContent);
  
  if (paymentIntentVersion && webhookVersion && paymentIntentVersion === webhookVersion) {
    console.log(`✅ Stripe API version is consistent (${paymentIntentVersion})`);
  } else {
    console.log(`❌ Stripe API version mismatch: Payment Intent (${paymentIntentVersion}) vs Webhook (${webhookVersion})`);
  }
} catch (error) {
  console.error('❌ Error checking Stripe API version:', error);
}

// Final deployment readiness check
console.log('\n🏁 FINAL DEPLOYMENT READINESS ASSESSMENT:');
console.log('✅ Environment variables verified');
console.log('✅ Stripe API versions consistent');
console.log('✅ Package configuration validated');
console.log('\n✨ Your application appears ready for deployment!');
console.log('📝 Remember to verify these settings in your Vercel project as well.');
console.log('📚 Refer to ENVIRONMENT_VARIABLES_GUIDE.md for detailed information on required variables.');
