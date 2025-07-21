// Direct Supabase Database Migration Script
// This script connects directly to the Supabase Postgres database and runs our migration SQL

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase database connection details
// NOTE: This requires your Supabase direct connection string which contains the password
// It should be in the format: postgresql://postgres:[YOUR-PASSWORD]@db.cceuyhebxxqafmrmnqhq.supabase.co:5432/postgres
const supabaseConnectionString = process.env.SUPABASE_DIRECT_URL || 
  'postgresql://postgres:your_password_here@db.cceuyhebxxqafmrmnqhq.supabase.co:5432/postgres';

// Database client
const client = new Client({
  connectionString: supabaseConnectionString,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('AD PLUS Assistant - Database Migration');
  console.log('--------------------------------------');
  
  try {
    // 1. Connect to the database
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('Connected successfully');
    
    // 2. Read the SQL migration file
    const sqlFilePath = path.join(process.cwd(), 'database', 'supabase_migration.sql');
    console.log(`Reading SQL file: ${sqlFilePath}`);
    
    let sqlContent;
    try {
      sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    } catch (err) {
      console.error(`Error reading SQL file: ${err.message}`);
      process.exit(1);
    }
    
    // 3. Execute the migration SQL
    console.log('Executing migration SQL...');
    await client.query(sqlContent);
    
    // 4. Verify the tables were created
    console.log('Verifying tables...');
    
    const tablesToCheck = ['services', 'user_requests', 'user_feedback'];
    const tableVerifications = [];
    
    for (const table of tablesToCheck) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        );
      `);
      
      const exists = result.rows[0].exists;
      tableVerifications.push({ table, exists });
    }
    
    // 5. Verify old tables are gone
    const oldTablesToCheck = ['messages', 'subscription', 'schema_migrations'];
    const oldTableVerifications = [];
    
    for (const table of oldTablesToCheck) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        );
      `);
      
      const exists = result.rows[0].exists;
      oldTableVerifications.push({ table, exists });
    }
    
    // 6. Print results
    console.log('\nMigration Results:');
    console.log('------------------');
    
    console.log('\nNew Tables:');
    for (const { table, exists } of tableVerifications) {
      console.log(`- ${table}: ${exists ? '✅ Created' : '❌ Not Created'}`);
    }
    
    console.log('\nOld Tables:');
    for (const { table, exists } of oldTableVerifications) {
      console.log(`- ${table}: ${exists ? '❌ Still Exists' : '✅ Deleted'}`);
    }
    
    // 7. Check if all tables were created correctly
    const allNewTablesExist = tableVerifications.every(t => t.exists);
    const allOldTablesDeleted = oldTableVerifications.every(t => !t.exists);
    
    if (allNewTablesExist && allOldTablesDeleted) {
      console.log('\n✅ Migration completed successfully!');
      console.log('Your Supabase database now contains only the new tables for AD PLUS Assistant.');
    } else {
      console.log('\n⚠️ Migration completed with issues:');
      if (!allNewTablesExist) {
        console.log('- Some new tables were not created properly.');
      }
      if (!allOldTablesDeleted) {
        console.log('- Some old tables still exist in the database.');
      }
    }
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the database connection
    await client.end();
  }
}

// Run the migration
runMigration().catch(console.error);
