// Direct PostgreSQL Migration Script for Supabase
// This script uses the native pg library to connect directly to Supabase PostgreSQL

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Supabase connection details
// Note: The connection string format for Supabase PostgreSQL is:
// postgresql://postgres:[password]@[host]:[port]/postgres
const connectionString = 'postgresql://postgres:z4dMeqUYVBGu7UVp@db.cceuyhebxxqafmrmnqhq.supabase.co:5432/postgres';

// Initialize PostgreSQL connection pool
const pool = new Pool({ connectionString });

// Function to execute a SQL query
async function executeQuery(sql) {
  const client = await pool.connect();
  try {
    console.log(`Executing SQL: ${sql.substring(0, 50)}...`);
    await client.query(sql);
    return true;
  } catch (err) {
    console.error('SQL execution error:', err.message);
    return false;
  } finally {
    client.release();
  }
}

// Function to check if a table exists
async function tableExists(tableName) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [tableName]);
    
    return result.rows[0].exists;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err.message);
    return false;
  } finally {
    client.release();
  }
}

// Function to count rows in a table
async function countRows(tableName) {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
    return parseInt(result.rows[0].count);
  } catch (err) {
    console.error(`Error counting rows in ${tableName}:`, err.message);
    return 0;
  } finally {
    client.release();
  }
}

// Main function to run the migration
async function runMigration() {
  console.log('Starting direct PostgreSQL migration for Supabase...');
  
  try {
    // Read the SQL migration file
    const sqlFilePath = path.join(process.cwd(), 'database', 'supabase_migration.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .replace(/--.*$/gm, '') // Remove comments
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (const statement of statements) {
      const success = await executeQuery(statement);
      if (!success) {
        console.warn('Statement execution failed, continuing with next statement');
      }
    }
    
    // Verify the old tables are gone
    console.log('\nVerifying old tables are deleted:');
    const oldTables = ['messages', 'subscription', 'schema_migrations'];
    for (const table of oldTables) {
      const exists = await tableExists(table);
      console.log(`Table '${table}' exists: ${exists ? '❌ Still exists' : '✅ Successfully deleted'}`);
    }
    
    // Verify the new tables are created
    console.log('\nVerifying new tables are created:');
    const newTables = ['services', 'user_requests', 'user_feedback'];
    let allTablesCreated = true;
    
    for (const table of newTables) {
      const exists = await tableExists(table);
      console.log(`Table '${table}' exists: ${exists ? '✅ Successfully created' : '❌ Creation failed'}`);
      if (!exists) allTablesCreated = false;
    }
    
    // Verify sample data is inserted
    if (allTablesCreated) {
      console.log('\nVerifying sample data:');
      const serviceCount = await countRows('services');
      console.log(`Services table row count: ${serviceCount} ${serviceCount > 0 ? '✅ Sample data inserted' : '❌ No data found'}`);
    }
    
    console.log('\nMigration process completed!');
    
  } catch (err) {
    console.error('Migration failed with error:', err);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the migration
runMigration();
