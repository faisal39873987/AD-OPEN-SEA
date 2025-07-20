// Interactive Migration Executor
// This script will help you execute the SQL migration file against your Supabase database

import readline from 'readline';
import { exec } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase credentials from .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cceuyhebxxqafmrmnqhq.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXV5aGVieHhxYWZtcm1ucWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzM5NTUsImV4cCI6MjA2NzQ0OTk1NX0.Z3DoMvHUwa7QU0HeMglW49t-qUmkb_Tm2iW3ljN8_Io';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sqlFilePath = path.join(process.cwd(), 'database', 'supabase_migration.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
} catch (err) {
  console.error(`Error reading SQL file: ${err.message}`);
  process.exit(1);
}

// Split SQL into individual statements
function splitSqlStatements(sql) {
  // Basic splitting by semicolons - this is a simplification
  return sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0)
    .map(stmt => stmt + ';');
}

const statements = splitSqlStatements(sqlContent);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main function
async function main() {
  console.log('AD PLUS Assistant - Interactive Database Migration');
  console.log('================================================');
  console.log('This script will help you run SQL migration against your Supabase database.');
  console.log(`\nSQL file: ${sqlFilePath}`);
  console.log(`Total SQL statements to execute: ${statements.length}`);
  console.log('\nThis migration will:');
  console.log('1. Delete old tables (messages, subscription, schema_migrations)');
  console.log('2. Create new tables (services, user_requests, user_feedback)');
  console.log('3. Add sample data to the services table');
  
  rl.question('\nDo you want to execute this migration? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      console.log('\nExecuting migration...');
      
      try {
        // Check current tables
        console.log('\nChecking current tables in the database...');
        const { data: currentTables, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
        
        if (tablesError) {
          console.error('Error fetching current tables:', tablesError);
        } else {
          console.log('Current tables in database:');
          currentTables.forEach(t => console.log(`- ${t.table_name}`));
        }
        
        // Using Supabase Storage API as a workaround to execute SQL
        // Note: This is not a proper way to execute SQL, but we're using it as a demonstration
        console.log('\nExecuting SQL using Supabase SQL Editor...');
        console.log('Please run the following SQL in the Supabase SQL Editor:');
        console.log('\n----------------------------------------');
        console.log(sqlContent);
        console.log('----------------------------------------\n');
        
        rl.question('Did you run the SQL in the Supabase SQL Editor? (yes/no): ', async (sqlAnswer) => {
          if (sqlAnswer.toLowerCase() === 'yes' || sqlAnswer.toLowerCase() === 'y') {
            // Check current tables again after migration
            console.log('\nVerifying tables after migration...');
            const { data: newTables, error: newTablesError } = await supabase
              .from('information_schema.tables')
              .select('table_name')
              .eq('table_schema', 'public');
            
            if (newTablesError) {
              console.error('Error fetching tables after migration:', newTablesError);
            } else {
              const tableNames = newTables.map(t => t.table_name);
              console.log('\nCurrent tables in database:');
              tableNames.forEach(name => console.log(`- ${name}`));
              
              // Check for the required tables
              const requiredTables = ['services', 'user_requests', 'user_feedback'];
              const missingTables = requiredTables.filter(table => !tableNames.includes(table));
              
              // Check for deleted tables
              const oldTables = ['messages', 'subscription', 'schema_migrations'];
              const remainingOldTables = oldTables.filter(table => tableNames.includes(table));
              
              if (missingTables.length === 0 && remainingOldTables.length === 0) {
                console.log('\n✅ Migration completed successfully!');
                console.log('All new tables are created and old tables are removed.');
              } else {
                console.log('\n⚠️ Migration completed with issues:');
                
                if (missingTables.length > 0) {
                  console.log(`Missing tables: ${missingTables.join(', ')}`);
                }
                
                if (remainingOldTables.length > 0) {
                  console.log(`Old tables still present: ${remainingOldTables.join(', ')}`);
                }
              }
            }
            
            rl.close();
          } else {
            console.log('Migration cancelled. Please run the SQL manually in the Supabase SQL Editor.');
            rl.close();
          }
        });
      } catch (error) {
        console.error('Error during migration:', error);
        rl.close();
      }
    } else {
      console.log('Migration cancelled.');
      rl.close();
    }
  });
}

// Run the main function
main();
