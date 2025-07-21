import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Create service_providers table
    const { error: createProvidersError } = await supabase.rpc(
      'run_sql', 
      { 
        sql: `
          CREATE TABLE IF NOT EXISTS service_providers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            name TEXT NOT NULL,
            job TEXT NOT NULL,
            phone TEXT,
            nationality TEXT,
            experience TEXT,
            details TEXT
          );
        `
      }
    );

    if (createProvidersError) {
      console.error('Error creating service_providers table:', createProvidersError);
    } else {
      console.log('service_providers table created or already exists');
    }

    // Create chat_requests table
    const { error: createRequestsError } = await supabase.rpc(
      'run_sql', 
      { 
        sql: `
          CREATE TABLE IF NOT EXISTS chat_requests (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_question TEXT NOT NULL,
            ai_response TEXT,
            extracted_data JSONB
          );
        `
      }
    );

    if (createRequestsError) {
      console.error('Error creating chat_requests table:', createRequestsError);
    } else {
      console.log('chat_requests table created or already exists');
    }

    // Insert a test service provider
    const { data: insertData, error: insertError } = await supabase
      .from('service_providers')
      .insert([
        {
          name: 'Ahmed Test',
          job: 'Personal Trainer',
          phone: '0521234567',
          nationality: 'Egypt',
          experience: '5 years',
          details: 'Test provider created during verification'
        }
      ])
      .select();

    if (insertError) {
      console.error('Error inserting test data:', insertError);
    } else {
      console.log('Test data inserted:', insertData);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

initializeDatabase().catch(console.error);
