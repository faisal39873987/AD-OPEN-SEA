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

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  try {
    // Create service_providers table if it doesn't exist
    const { error: createError } = await supabase.rpc('create_service_providers_if_not_exists');
    if (createError) {
      console.log('Table might already exist or RPC function not available:', createError);
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
      console.error('Error inserting data:', insertError);
    } else {
      console.log('Inserted data:', insertData);
    }

    // Query service providers
    const { data: queryData, error: queryError } = await supabase
      .from('service_providers')
      .select('*')
      .limit(5);

    if (queryError) {
      console.error('Error querying data:', queryError);
    } else {
      console.log('Service providers in database:', queryData);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testSupabase().catch(console.error);
