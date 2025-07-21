#!/usr/bin/env node

/**
 * Production Validation Script
 * 
 * This script performs automated validation checks on a deployed environment
 * to ensure that all critical features are working as expected.
 * 
 * Usage: 
 *   NODE_ENV=production node scripts/validation/validate-production.js https://your-deployed-url.com
 */

const axios = require('axios');
const chalk = require('chalk');
const { performance } = require('perf_hooks');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Get the URL from command line arguments
const baseUrl = process.argv[2];
if (!baseUrl) {
  console.error(chalk.red('Please provide the base URL to validate'));
  console.log('Example: NODE_ENV=production node scripts/validation/validate-production.js https://example.com');
  process.exit(1);
}

// Initialize Supabase client (from environment variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test result tracking
const results = {
  passed: 0,
  failed: 0,
  total: 0,
  tests: []
};

// Helper function to run a test
async function runTest(name, testFn) {
  results.total++;
  try {
    console.log(chalk.blue(`Running test: ${name}...`));
    const startTime = performance.now();
    await testFn();
    const endTime = performance.now();
    
    results.passed++;
    results.tests.push({
      name,
      status: 'passed',
      duration: endTime - startTime
    });
    
    console.log(chalk.green(`✓ Test passed: ${name} (${(endTime - startTime).toFixed(2)}ms)`));
  } catch (error) {
    results.failed++;
    results.tests.push({
      name,
      status: 'failed',
      error: error.message
    });
    
    console.log(chalk.red(`✗ Test failed: ${name}`));
    console.log(chalk.red(`  Error: ${error.message}`));
  }
}

// Main validation function
async function validateProduction() {
  console.log(chalk.yellow('=== Starting Production Validation ==='));
  console.log(chalk.yellow(`Target URL: ${baseUrl}`));
  
  // 1. Basic Connectivity Tests
  await runTest('Homepage is accessible', async () => {
    const response = await axios.get(baseUrl);
    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  });
  
  await runTest('API endpoints are accessible', async () => {
    const response = await axios.get(`${baseUrl}/api/health`);
    if (response.status !== 200) {
      throw new Error(`API health check failed with status: ${response.status}`);
    }
  });
  
  // 2. Supabase Integration Tests
  await runTest('Supabase connection', async () => {
    const { data, error } = await supabase.from('services').select('count');
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
  });
  
  // 3. Stripe Integration Tests
  await runTest('Stripe API connection', async () => {
    const products = await stripe.products.list({ limit: 1 });
    if (!products || !products.data) {
      throw new Error('Failed to fetch products from Stripe');
    }
  });
  
  // 4. Performance Tests
  await runTest('Page load performance', async () => {
    const startTime = performance.now();
    await axios.get(baseUrl);
    const endTime = performance.now();
    
    const loadTime = endTime - startTime;
    if (loadTime > 3000) {
      throw new Error(`Page load time (${loadTime.toFixed(2)}ms) exceeds threshold of 3000ms`);
    }
  });
  
  // 5. Lazy Loading Verification (basic check)
  await runTest('Service listing page loads', async () => {
    const response = await axios.get(`${baseUrl}/services`);
    if (response.status !== 200) {
      throw new Error(`Service listing page failed with status: ${response.status}`);
    }
  });
  
  // Print summary
  console.log(chalk.yellow('\n=== Validation Summary ==='));
  console.log(`Total Tests: ${results.total}`);
  console.log(chalk.green(`Passed: ${results.passed}`));
  console.log(chalk.red(`Failed: ${results.failed}`));
  
  if (results.failed > 0) {
    console.log(chalk.yellow('\nFailed Tests:'));
    results.tests
      .filter(test => test.status === 'failed')
      .forEach(test => {
        console.log(chalk.red(`- ${test.name}: ${test.error}`));
      });
      
    process.exit(1);
  } else {
    console.log(chalk.green('\nAll validation tests passed!'));
  }
}

// Run the validation
validateProduction().catch(error => {
  console.error(chalk.red('Validation script error:'), error);
  process.exit(1);
});
