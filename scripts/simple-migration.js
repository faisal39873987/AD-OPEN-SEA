// Simplified migration script using REST API
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://cceuyhebxxqafmrmnqhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXV5aGVieHhxYWZtcm1ucWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzM5NTUsImV4cCI6MjA2NzQ0OTk1NX0.Z3DoMvHUwa7QU0HeMglW49t-qUmkb_Tm2iW3ljN8_Io';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Main migration function
async function runMigration() {
  console.log('Starting simplified migration process...');
  
  try {
    // 1. First, verify what tables currently exist
    console.log('Checking current tables...');
    
    // 2. Try to create the services table
    console.log('Creating services table...');
    
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .insert([
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
        }
      ])
      .select();
    
    if (servicesError) {
      if (servicesError.code === '42P01') {
        console.log('Services table does not exist, we need to create it');
        // Handle the case when the table doesn't exist
      } else {
        console.error('Error with services table:', servicesError);
      }
    } else {
      console.log('Successfully inserted into services table:', servicesData);
    }
    
    // 3. Try to create the user_requests table
    console.log('Creating user_requests table...');
    
    const { data: requestsData, error: requestsError } = await supabase
      .from('user_requests')
      .insert([
        {
          user_input: 'أبحث عن مدرب شخصي',
          response: 'وجدت مدربين شخصيين في أبوظبي',
          source: 'supabase'
        }
      ])
      .select();
    
    if (requestsError) {
      if (requestsError.code === '42P01') {
        console.log('user_requests table does not exist, we need to create it');
      } else {
        console.error('Error with user_requests table:', requestsError);
      }
    } else {
      console.log('Successfully inserted into user_requests table:', requestsData);
    }
    
    // 4. Try to create the user_feedback table
    console.log('Creating user_feedback table...');
    
    // First get a service ID if possible
    let serviceId = null;
    const { data: serviceData } = await supabase
      .from('services')
      .select('id')
      .limit(1);
    
    if (serviceData && serviceData.length > 0) {
      serviceId = serviceData[0].id;
    }
    
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('user_feedback')
      .insert([
        {
          service_id: serviceId,
          rating: 5,
          feedback: 'خدمة ممتازة'
        }
      ])
      .select();
    
    if (feedbackError) {
      if (feedbackError.code === '42P01') {
        console.log('user_feedback table does not exist, we need to create it');
      } else {
        console.error('Error with user_feedback table:', feedbackError);
      }
    } else {
      console.log('Successfully inserted into user_feedback table:', feedbackData);
    }
    
    console.log('\nIMPORTANT: You need to run the SQL in Supabase SQL Editor');
    console.log('Please go to your Supabase dashboard, SQL Editor, and run the SQL from:');
    console.log('/database/supabase_migration.sql');
    
  } catch (error) {
    console.error('Unexpected error during migration:', error);
  }
}

// Run the migration
runMigration()
  .catch(err => {
    console.error('Migration failed with error:', err);
  });
