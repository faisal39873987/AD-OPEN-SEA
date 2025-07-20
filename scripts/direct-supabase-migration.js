// Direct Supabase Table Migration Script
// This script will use the Supabase REST API to create tables directly

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://cceuyhebxxqafmrmnqhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXV5aGVieHhxYWZtcm1ucWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzM5NTUsImV4cCI6MjA2NzQ0OTk1NX0.Z3DoMvHUwa7QU0HeMglW49t-qUmkb_Tm2iW3ljN8_Io';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to drop a table if it exists
async function dropTableIfExists(tableName) {
  console.log(`Attempting to drop table: ${tableName}`);
  
  try {
    // Check if table exists by trying to get 0 rows
    const { error: checkError } = await supabase
      .from(tableName)
      .select('*')
      .limit(0);
      
    // If the table doesn't exist, we'll get a specific error
    if (checkError && checkError.code === '42P01') {
      console.log(`Table ${tableName} doesn't exist, skipping deletion.`);
      return true;
    }
    
    // If we got here, the table exists or there was a different error
    // Try to delete the table through REST API (this won't work directly, but we'll try)
    const { error: dropError } = await supabase.rpc('drop_table', { table_name: tableName });
    
    if (dropError) {
      console.error(`Error dropping ${tableName}:`, dropError);
      console.log(`Please drop ${tableName} manually using the SQL Editor.`);
      return false;
    }
    
    console.log(`Successfully dropped table: ${tableName}`);
    return true;
  } catch (err) {
    console.error(`Error in dropTableIfExists for ${tableName}:`, err);
    return false;
  }
}

// Function to create a table using the REST API
async function createServicesTable() {
  console.log('Creating services table...');
  
  try {
    const { error } = await supabase.rpc('create_services_table');
    
    if (error) {
      console.error('Error creating services table:', error);
      return false;
    }
    
    console.log('Services table created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating services table:', err);
    return false;
  }
}

async function createUserRequestsTable() {
  console.log('Creating user_requests table...');
  
  try {
    const { error } = await supabase.rpc('create_user_requests_table');
    
    if (error) {
      console.error('Error creating user_requests table:', error);
      return false;
    }
    
    console.log('User requests table created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating user_requests table:', err);
    return false;
  }
}

async function createUserFeedbackTable() {
  console.log('Creating user_feedback table...');
  
  try {
    const { error } = await supabase.rpc('create_user_feedback_table');
    
    if (error) {
      console.error('Error creating user_feedback table:', error);
      return false;
    }
    
    console.log('User feedback table created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating user_feedback table:', err);
    return false;
  }
}

async function insertSampleData() {
  console.log('Inserting sample data into services table...');
  
  const sampleData = [
    {
      category: 'personal_trainers',
      provider_name: 'أحمد الفيتنس',
      name: 'مدرب أحمد الشخصي',
      description: 'مدرب شخصي متخصص في اللياقة البدنية واللياقة العامة',
      price: 250,
      rating: 4.7,
      contact: '+971501234567',
      website: 'https://ahmed-fitness.ae',
      whatsapp: '+971501234567',
      instagram: '@ahmed_fitness',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      location: 'أبوظبي - الخالدية'
    },
    {
      category: 'personal_trainers',
      provider_name: 'سارة الرياضية',
      name: 'مدربة سارة للسيدات',
      description: 'مدربة معتمدة متخصصة في تدريب النساء',
      price: 300,
      rating: 4.9,
      contact: '+971502345678',
      website: 'https://sara-fitness.ae',
      whatsapp: '+971502345678',
      instagram: '@sara_fitness',
      image_url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2',
      location: 'أبوظبي - جزيرة الريم'
    }
    // More sample data can be added here
  ];
  
  try {
    const { error } = await supabase
      .from('services')
      .insert(sampleData);
      
    if (error) {
      console.error('Error inserting sample data:', error);
      return false;
    }
    
    console.log('Sample data inserted successfully');
    return true;
  } catch (err) {
    console.error('Exception inserting sample data:', err);
    return false;
  }
}

// Main function to run the migration
async function runMigration() {
  console.log('Starting direct Supabase table migration...');
  
  // 1. Drop old tables if they exist
  const oldTables = ['messages', 'subscription', 'schema_migrations'];
  for (const table of oldTables) {
    await dropTableIfExists(table);
  }
  
  // 2. Create new tables
  console.log('\nNOTE: The direct API approach may not work due to Supabase limitations.');
  console.log('If you encounter errors, please use the SQL script in the Supabase SQL Editor instead.');
  
  let success = true;
  
  // 3. Create new tables (might not work via REST API)
  if (!(await createServicesTable())) success = false;
  if (!(await createUserRequestsTable())) success = false;
  if (!(await createUserFeedbackTable())) success = false;
  
  // 4. Insert sample data
  if (success && !(await insertSampleData())) success = false;
  
  if (success) {
    console.log('\n✅ Migration completed successfully!');
  } else {
    console.error('\n❌ Migration failed or was incomplete.');
    console.log('\nPlease use the Supabase SQL Editor to run the complete migration script:');
    const sqlFilePath = path.join(process.cwd(), 'database', 'supabase_migration.sql');
    try {
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      console.log('\n=== SQL TO EXECUTE IN SUPABASE SQL EDITOR ===');
      console.log(sqlContent);
      console.log('=== END OF SQL ===\n');
    } catch (err) {
      console.error(`Error reading SQL file: ${err.message}`);
    }
  }
}

// Run the migration
runMigration()
  .catch(err => {
    console.error('Migration failed with error:', err);
  });
