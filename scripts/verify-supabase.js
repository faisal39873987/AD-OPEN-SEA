#!/usr/bin/env node

/**
 * Supabase Migration Verification Script
 * 
 * This script verifies that the Supabase database is properly set up with
 * the necessary tables and indexes for the AD Pulse application.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_SERVICE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Required tables for the application
const requiredTables = [
  'services',
  'chat_sessions',
  'chat_messages',
  'users',
  'profiles'
];

// Expected service columns
const serviceColumns = [
  'id',
  'name',
  'description',
  'price',
  'category',
  'location',
  'rating',
  'image_url',
  'created_at',
  'updated_at'
];

// Check if a table exists
async function tableExists(tableName) {
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', tableName);
  
  if (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
  
  return data && data.length > 0;
}

// Check if a column exists in a table
async function columnExists(tableName, columnName) {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_schema', 'public')
    .eq('table_name', tableName)
    .eq('column_name', columnName);
  
  if (error) {
    console.error(`Error checking if column ${columnName} exists in ${tableName}:`, error);
    return false;
  }
  
  return data && data.length > 0;
}

// Verify full-text search is set up for services
async function verifyFullTextSearch() {
  try {
    const { data, error } = await supabase
      .rpc('check_tsvector_index', { table_name: 'services' });
    
    if (error) throw error;
    
    return data && data.has_index === true;
  } catch (error) {
    console.error('Error checking full-text search:', error);
    return false;
  }
}

// Main verification function
async function verifyDatabase() {
  console.log('🔍 Verifying Supabase database setup...');
  
  // Check if all required tables exist
  console.log('\n📋 Checking tables:');
  for (const table of requiredTables) {
    const exists = await tableExists(table);
    console.log(`  ${exists ? '✅' : '❌'} Table ${table}`);
  }
  
  // Check if services table has all required columns
  const servicesExists = await tableExists('services');
  if (servicesExists) {
    console.log('\n📊 Checking services table columns:');
    for (const column of serviceColumns) {
      const exists = await columnExists('services', column);
      console.log(`  ${exists ? '✅' : '❌'} Column ${column}`);
    }
  }
  
  // Check if full-text search is set up
  console.log('\n🔎 Checking full-text search:');
  const hasFTS = await verifyFullTextSearch();
  console.log(`  ${hasFTS ? '✅' : '❌'} Full-text search index on services`);
  
  // Check if there are any services in the database
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('count', { count: 'exact' });
  
  if (!servicesError) {
    const count = services[0]?.count || 0;
    console.log(`\n📊 Service count: ${count}`);
    console.log(`  ${count > 0 ? '✅' : '⚠️'} Services data ${count > 0 ? 'found' : 'not found'}`);
  } else {
    console.log('\n❌ Error checking service count:', servicesError);
  }
  
  console.log('\n✨ Database verification complete!');
}

// Run the verification
verifyDatabase().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
