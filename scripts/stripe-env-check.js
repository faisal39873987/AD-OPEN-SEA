#!/usr/bin/env node

/**
 * This script verifies that all required Stripe environment variables are set.
 * Run before starting the application to ensure Stripe functionality works correctly.
 */

const chalk = require('chalk');

// Required Stripe environment variables
const requiredVars = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

// Optional but recommended variables
const recommendedVars = [
  'NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID'
];

console.log(chalk.blue('🔍 Checking Stripe environment variables...'));

// Check required variables
const missingRequired = requiredVars.filter(varName => !process.env[varName]);

if (missingRequired.length > 0) {
  console.log(chalk.red('❌ Missing required Stripe environment variables:'));
  missingRequired.forEach(varName => {
    console.log(chalk.red(`   - ${varName}`));
  });
  console.log(chalk.yellow('\n⚠️  Stripe functionality will not work without these variables.'));
  console.log(chalk.yellow('   Add them to your .env.local file or deployment environment.\n'));
} else {
  console.log(chalk.green('✅ All required Stripe environment variables are set.'));
}

// Check recommended variables
const missingRecommended = recommendedVars.filter(varName => !process.env[varName]);

if (missingRecommended.length > 0) {
  console.log(chalk.yellow('\n⚠️ Missing recommended Stripe environment variables:'));
  missingRecommended.forEach(varName => {
    console.log(chalk.yellow(`   - ${varName}`));
  });
  console.log(chalk.yellow('\n   These variables are not required but recommended for full functionality.'));
} else {
  console.log(chalk.green('✅ All recommended Stripe environment variables are set.'));
}

// Validation check for key format
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const secretKey = process.env.STRIPE_SECRET_KEY;

if (publishableKey && !publishableKey.startsWith('pk_')) {
  console.log(chalk.red('\n❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY should start with "pk_"'));
}

if (secretKey && !secretKey.startsWith('sk_')) {
  console.log(chalk.red('\n❌ STRIPE_SECRET_KEY should start with "sk_"'));
}

// Exit with error code if required variables are missing
if (missingRequired.length > 0) {
  process.exit(1);
}

console.log(chalk.blue('\n📝 For more information on setting up Stripe, refer to the STRIPE_SETUP_GUIDE.md file.'));
