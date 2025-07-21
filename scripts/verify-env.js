#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * 
 * This script checks if all required environment variables are properly set
 * before running the application. It helps identify configuration issues early.
 */

console.log('\n🔍 Verifying environment variables...');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

const recommendedVars = [
  'OPENAI_API_KEY',
  'NEXT_PUBLIC_GPT_ASSISTANT_URL',
  'NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID',
];

// Check if running in Vercel environment
const isVercel = process.env.VERCEL === '1';

// Load environment variables from .env.local if available
try {
  require('dotenv').config({ path: '.env.local' });
  console.log('✅ Loaded environment from .env.local');
} catch (error) {
  console.log('⚠️ No .env.local file found, using process environment variables');
}

let missingRequired = false;
let missingRecommended = false;

console.log('\n📋 Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName} is missing`);
    // Only mark as missing if we're not in Vercel environment
    if (!isVercel) {
      missingRequired = true;
    }
  } else {
    // Mask sensitive values
    const isSensitive = varName.includes('KEY') || varName.includes('SECRET');
    const displayValue = isSensitive && value.length > 8
      ? `${value.substring(0, 5)}...${value.substring(value.length - 4)}` 
      : value;
    console.log(`✅ ${varName} = ${displayValue}`);
  }
});

console.log('\n📋 Recommended Variables:');
recommendedVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚠️ ${varName} is not set (recommended)`);
    missingRecommended = true;
  } else {
    // Mask sensitive values
    const isSensitive = varName.includes('KEY') || varName.includes('SECRET');
    const displayValue = isSensitive && value.length > 8
      ? `${value.substring(0, 5)}...${value.substring(value.length - 4)}` 
      : value;
    console.log(`✅ ${varName} = ${displayValue}`);
  }
});

// Final verification result
console.log('\n🔍 Verification Result:');
if (missingRequired && !isVercel) {
  console.error('❌ FAIL: Missing required environment variables. Please check your configuration.');
  process.exit(1);
} else if (isVercel) {
  console.log('✅ Running in Vercel environment - deployment will continue');
  console.log('  Environment variables should be configured in the Vercel dashboard');
} else if (missingRecommended) {
  console.warn('⚠️ WARNING: Some recommended variables are missing, but the application can run.');
  console.log('✅ All required variables are present.');
} else {
  console.log('✅ SUCCESS: All environment variables are properly configured.');
}

console.log('\nℹ️ Note: Make sure to set these variables in your deployment environment (Vercel).');
