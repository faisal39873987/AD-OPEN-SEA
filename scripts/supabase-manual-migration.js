#!/usr/bin/env node
// Script to guide manual migration in Supabase
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== AD PLUS Assistant Database Migration ===');
console.log('\nSince Supabase API does not support direct SQL execution via RPC,');
console.log('you need to execute the migration manually in the Supabase SQL Editor.');
console.log('\nFollow these steps:');
console.log('\n1. Log in to your Supabase dashboard at https://app.supabase.com');
console.log('2. Navigate to your project (https://cceuyhebxxqafmrmnqhq.supabase.co)');
console.log('3. Go to the SQL Editor in the left sidebar');
console.log('4. Create a new query');
console.log('5. Copy the SQL script below');
console.log('6. Paste it into the SQL Editor');
console.log('7. Click "Run" to execute the script');

// Read the SQL migration file
const sqlFilePath = path.join(process.cwd(), 'database', 'supabase_migration.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log('\n=== SQL SCRIPT TO COPY ===');
  console.log(sqlContent);
  console.log('=== END OF SQL SCRIPT ===');
} catch (err) {
  console.error(`Error reading SQL file: ${err.message}`);
  process.exit(1);
}

// Copy the SQL content to clipboard if possible
try {
  if (process.platform === 'darwin') {
    // macOS
    execSync(`echo "${sqlContent.replace(/"/g, '\\"')}" | pbcopy`);
    console.log('\n✅ SQL script has been copied to your clipboard!');
  } else if (process.platform === 'win32') {
    // Windows
    execSync(`echo ${sqlContent.replace(/"/g, '\\"')} | clip`);
    console.log('\n✅ SQL script has been copied to your clipboard!');
  } else {
    console.log('\nPlease manually copy the SQL script above.');
  }
} catch (err) {
  console.log('\nPlease manually copy the SQL script above.');
}

console.log('\nAfter executing the script, verify that:');
console.log('1. The old tables (messages, subscription, schema_migrations) are deleted');
console.log('2. The new tables (services, user_requests, user_feedback) are created');
console.log('3. Sample data is inserted into the services table');
console.log('\nTo verify, go to the "Table Editor" in the left sidebar and check if the tables exist.');
console.log('\nMigration is complete when all the above steps are successfully executed.');
