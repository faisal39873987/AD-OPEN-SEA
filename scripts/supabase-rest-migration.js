// Supabase REST API Migration Script
// This script attempts to create tables using Supabase's REST API

const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// Supabase credentials
const supabaseUrl = 'https://cceuyhebxxqafmrmnqhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXV5aGVieHhxYWZtcm1ucWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzM5NTUsImV4cCI6MjA2NzQ0OTk1NX0.Z3DoMvHUwa7QU0HeMglW49t-qUmkb_Tm2iW3ljN8_Io';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create the services table using the REST API
async function createServicesTable() {
  try {
    console.log('Creating services table...');
    
    // First try to delete the table if it exists
    const deleteResult = await makeRequest('/rest/v1/services?cascade=true', 'DELETE');
    console.log('Delete result:', deleteResult ? 'Success' : 'Failed or Table did not exist');
    
    // Define the services table schema
    const servicesSchema = {
      name: 'services',
      schema: 'public',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          defaultValue: 'uuid_generate_v4()'
        },
        {
          name: 'category',
          type: 'text',
          isNullable: false,
          check: "category IN ('personal_trainers', 'yacht_rentals', 'apartments', 'beauty_clinics', 'kids_services', 'housekeeping')"
        },
        {
          name: 'provider_name',
          type: 'text',
          isNullable: false
        },
        {
          name: 'name',
          type: 'text',
          isNullable: false
        },
        {
          name: 'description',
          type: 'text',
          isNullable: false
        },
        {
          name: 'price',
          type: 'numeric',
          isNullable: false
        },
        {
          name: 'rating',
          type: 'numeric(3,2)',
          defaultValue: '4.5'
        },
        {
          name: 'contact',
          type: 'text'
        },
        {
          name: 'website',
          type: 'text'
        },
        {
          name: 'whatsapp',
          type: 'text'
        },
        {
          name: 'instagram',
          type: 'text'
        },
        {
          name: 'image_url',
          type: 'text'
        },
        {
          name: 'location',
          type: 'text'
        },
        {
          name: 'created_at',
          type: 'timestamp with time zone',
          defaultValue: 'CURRENT_TIMESTAMP'
        }
      ]
    };
    
    // Create the table using REST API
    const createResult = await makeRequest('/rest/v1/tables', 'POST', servicesSchema);
    console.log('Create result:', createResult ? 'Success' : 'Failed');
    
    return createResult;
  } catch (err) {
    console.error('Error creating services table:', err);
    return false;
  }
}

// Function to create the user_requests table
async function createUserRequestsTable() {
  try {
    console.log('Creating user_requests table...');
    
    // First try to delete the table if it exists
    const deleteResult = await makeRequest('/rest/v1/user_requests?cascade=true', 'DELETE');
    console.log('Delete result:', deleteResult ? 'Success' : 'Failed or Table did not exist');
    
    // Define the user_requests table schema
    const userRequestsSchema = {
      name: 'user_requests',
      schema: 'public',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          defaultValue: 'uuid_generate_v4()'
        },
        {
          name: 'user_id',
          type: 'uuid',
          references: 'auth.users(id)',
          onDelete: 'SET NULL'
        },
        {
          name: 'user_input',
          type: 'text',
          isNullable: false
        },
        {
          name: 'response',
          type: 'text',
          isNullable: false
        },
        {
          name: 'source',
          type: 'text',
          isNullable: false,
          check: "source IN ('supabase', 'gpt')"
        },
        {
          name: 'created_at',
          type: 'timestamp with time zone',
          defaultValue: 'CURRENT_TIMESTAMP'
        }
      ]
    };
    
    // Create the table using REST API
    const createResult = await makeRequest('/rest/v1/tables', 'POST', userRequestsSchema);
    console.log('Create result:', createResult ? 'Success' : 'Failed');
    
    return createResult;
  } catch (err) {
    console.error('Error creating user_requests table:', err);
    return false;
  }
}

// Function to create the user_feedback table
async function createUserFeedbackTable() {
  try {
    console.log('Creating user_feedback table...');
    
    // First try to delete the table if it exists
    const deleteResult = await makeRequest('/rest/v1/user_feedback?cascade=true', 'DELETE');
    console.log('Delete result:', deleteResult ? 'Success' : 'Failed or Table did not exist');
    
    // Define the user_feedback table schema
    const userFeedbackSchema = {
      name: 'user_feedback',
      schema: 'public',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          defaultValue: 'uuid_generate_v4()'
        },
        {
          name: 'user_id',
          type: 'uuid',
          references: 'auth.users(id)',
          onDelete: 'SET NULL'
        },
        {
          name: 'service_id',
          type: 'uuid',
          references: 'services(id)',
          onDelete: 'CASCADE'
        },
        {
          name: 'rating',
          type: 'integer',
          isNullable: false,
          check: 'rating >= 1 AND rating <= 5'
        },
        {
          name: 'feedback',
          type: 'text'
        },
        {
          name: 'created_at',
          type: 'timestamp with time zone',
          defaultValue: 'CURRENT_TIMESTAMP'
        }
      ]
    };
    
    // Create the table using REST API
    const createResult = await makeRequest('/rest/v1/tables', 'POST', userFeedbackSchema);
    console.log('Create result:', createResult ? 'Success' : 'Failed');
    
    return createResult;
  } catch (err) {
    console.error('Error creating user_feedback table:', err);
    return false;
  }
}

// Function to insert sample data into the services table
async function insertSampleData() {
  try {
    console.log('Inserting sample data...');
    
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
    ];
    
    // Insert the sample data
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
    console.error('Error inserting sample data:', err);
    return false;
  }
}

// Function to make a request to the Supabase REST API
function makeRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: supabaseUrl.replace('https://', ''),
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsedData = data ? JSON.parse(data) : {};
            resolve(parsedData);
          } catch (err) {
            resolve(true);
          }
        } else {
          console.error(`Request failed with status ${res.statusCode}:`, data);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.error('Request error:', err);
      reject(err);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

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

// Function to verify the database state after migration
async function verifyDatabaseState() {
  console.log('\nVerifying database state after migration...');
  
  // Check if old tables exist
  const oldTables = ['messages', 'subscription', 'schema_migrations'];
  let oldTablesExist = false;
  
  console.log('\nOld Tables:');
  for (const table of oldTables) {
    const exists = await tableExists(table);
    console.log(`- ${table}: ${exists ? '❌ Still exists' : '✅ Not found (correctly deleted)'}`);
    if (exists) oldTablesExist = true;
  }
  
  // Check if new tables exist
  const newTables = ['services', 'user_requests', 'user_feedback'];
  let allNewTablesExist = true;
  
  console.log('\nNew Tables:');
  for (const table of newTables) {
    const exists = await tableExists(table);
    console.log(`- ${table}: ${exists ? '✅ Created successfully' : '❌ Creation failed'}`);
    if (!exists) allNewTablesExist = false;
  }
  
  // Check if services table has data
  let hasServiceData = false;
  if (allNewTablesExist) {
    const { data, error } = await supabase
      .from('services')
      .select('*');
    
    if (!error && data && data.length > 0) {
      hasServiceData = true;
      console.log(`\nServices Table Data: ✅ Contains ${data.length} records`);
    } else {
      console.log('\nServices Table Data: ❌ No data found');
    }
  }
  
  return {
    oldTablesDeleted: !oldTablesExist,
    newTablesCreated: allNewTablesExist,
    sampleDataInserted: hasServiceData
  };
}

// Main function to run the migration
async function runMigration() {
  console.log('Starting migration using Supabase REST API...');
  
  // Check initial state
  const initialState = await verifyDatabaseState();
  
  // If everything is already set up correctly, we can skip the migration
  if (initialState.oldTablesDeleted && initialState.newTablesCreated && initialState.sampleDataInserted) {
    console.log('\n✅ MIGRATION ALREADY COMPLETE!');
    console.log('All required tables exist and sample data is present.');
    return;
  }
  
  // Create the tables
  let success = true;
  
  // Create services table
  if (!initialState.newTablesCreated || !await tableExists('services')) {
    if (!await createServicesTable()) {
      success = false;
    }
  }
  
  // Create user_requests table
  if (!initialState.newTablesCreated || !await tableExists('user_requests')) {
    if (!await createUserRequestsTable()) {
      success = false;
    }
  }
  
  // Create user_feedback table
  if (!initialState.newTablesCreated || !await tableExists('user_feedback')) {
    if (!await createUserFeedbackTable()) {
      success = false;
    }
  }
  
  // Insert sample data
  if (!initialState.sampleDataInserted) {
    if (!await insertSampleData()) {
      success = false;
    }
  }
  
  // Verify the final state
  const finalState = await verifyDatabaseState();
  
  if (finalState.oldTablesDeleted && finalState.newTablesCreated && finalState.sampleDataInserted) {
    console.log('\n✅ MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('All required tables have been created and sample data inserted.');
  } else {
    console.log('\n❌ MIGRATION PARTIALLY COMPLETED OR FAILED');
    console.log('- Old tables deleted:', finalState.oldTablesDeleted ? 'Yes' : 'No');
    console.log('- New tables created:', finalState.newTablesCreated ? 'Yes' : 'No');
    console.log('- Sample data inserted:', finalState.sampleDataInserted ? 'Yes' : 'No');
    
    // Automatically run SQL via a POST to SQL Editor API
    console.log('\nAttempting automatic SQL execution via Management API...');
    executeSQLViaManagementAPI();
  }
}

// Function to execute SQL via the Supabase Management API
async function executeSQLViaManagementAPI() {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'database', 'supabase_migration.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Call the Management API to execute SQL
    const body = {
      query: sqlContent
    };
    
    const result = await makeRequest('/rest/v1/sql', 'POST', body);
    
    if (result) {
      console.log('SQL executed successfully via Management API');
      
      // Verify the final state again
      const finalState = await verifyDatabaseState();
      
      if (finalState.oldTablesDeleted && finalState.newTablesCreated && finalState.sampleDataInserted) {
        console.log('\n✅ MIGRATION COMPLETED SUCCESSFULLY!');
      }
    } else {
      console.log('SQL execution via Management API failed');
    }
  } catch (err) {
    console.error('Error executing SQL via Management API:', err);
  }
}

// Run the migration
runMigration()
  .catch(err => {
    console.error('Migration failed with error:', err);
  });
