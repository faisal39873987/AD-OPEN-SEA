// Supabase Database Status Check and Summary
// This script checks the current state of the Supabase database

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://cceuyhebxxqafmrmnqhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXV5aGVieHhxYWZtcm1ucWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzM5NTUsImV4cCI6MjA2NzQ0OTk1NX0.Z3DoMvHUwa7QU0HeMglW49t-qUmkb_Tm2iW3ljN8_Io';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if a table exists
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Error code 42P01 means the table doesn't exist
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
}

// Function to count rows in a table
async function countRows(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error(`Error counting rows in ${tableName}:`, error);
      return 0;
    }
    
    return data.length;
  } catch (err) {
    console.error(`Error counting rows in ${tableName}:`, err);
    return 0;
  }
}

// Function to check the database state
async function checkDatabaseState() {
  console.log('\n=== SUPABASE DATABASE STATUS CHECK ===');
  
  // Check if old tables exist
  const oldTables = ['messages', 'subscription', 'schema_migrations'];
  let oldTablesExist = false;
  
  console.log('\nOld Tables Status:');
  for (const table of oldTables) {
    const exists = await tableExists(table);
    console.log(`- ${table}: ${exists ? '❌ Still exists (needs deletion)' : '✅ Not found (correctly deleted or never existed)'}`);
    if (exists) oldTablesExist = true;
  }
  
  // Check if new tables exist
  const newTables = ['services', 'user_requests', 'user_feedback'];
  let allNewTablesExist = true;
  
  console.log('\nNew Tables Status:');
  for (const table of newTables) {
    const exists = await tableExists(table);
    console.log(`- ${table}: ${exists ? '✅ Exists' : '❌ Not found (needs creation)'}`);
    if (!exists) allNewTablesExist = false;
  }
  
  // Check if services table has data
  if (allNewTablesExist) {
    console.log('\nData Status:');
    for (const table of newTables) {
      const count = await countRows(table);
      console.log(`- ${table}: ${count > 0 ? `✅ Contains ${count} records` : '❌ No data found'}`);
    }
  }
  
  // Overall status
  console.log('\n=== MIGRATION STATUS SUMMARY ===');
  if (!oldTablesExist && allNewTablesExist) {
    console.log('✅ MIGRATION APPEARS SUCCESSFUL');
    console.log('- All old tables are properly deleted or were never present');
    console.log('- All new tables are properly created');
  } else {
    console.log('❌ MIGRATION INCOMPLETE');
    if (oldTablesExist) {
      console.log('- Some old tables still exist and need to be deleted');
    }
    if (!allNewTablesExist) {
      console.log('- Some new tables are missing and need to be created');
    }
  }
  
  return {
    oldTablesDeleted: !oldTablesExist,
    newTablesCreated: allNewTablesExist
  };
}

// Main function
async function main() {
  console.log('Checking Supabase database status...');
  
  const state = await checkDatabaseState();
  
  if (!state.oldTablesDeleted || !state.newTablesCreated) {
    console.log('\n=== MANUAL MIGRATION REQUIRED ===');
    console.log('Due to Supabase security restrictions, we cannot execute SQL directly via the API.');
    console.log('To complete the migration, please:');
    console.log('1. Log in to your Supabase dashboard at https://app.supabase.com');
    console.log('2. Navigate to your project (https://cceuyhebxxqafmrmnqhq.supabase.co)');
    console.log('3. Go to the SQL Editor in the left sidebar');
    console.log('4. Create a new query and paste the contents of database/supabase_migration.sql');
    console.log('5. Click "Run" to execute the script');
    console.log('\nAfter running the script, you can run this status check again to verify the migration.');
  }
}

// Run the main function
main()
  .catch(err => {
    console.error('Error:', err);
  });
