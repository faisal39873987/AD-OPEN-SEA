#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Supabase database connection and tables...');

  try {
    // Test the connection
    const { data: connectionTest, error: connectionError } = await supabase.from('services').select('count', { count: 'exact', head: true });
    
    if (connectionError && connectionError.code !== '42P01') { // 42P01 means table doesn't exist, which is okay
      throw new Error(`Connection error: ${connectionError.message}`);
    }
    
    console.log('✅ Successfully connected to Supabase');

    // Create services table if it doesn't exist
    console.log('📊 Checking/creating services table...');
    try {
      await supabase.rpc('create_services_table_if_not_exists');
      console.log('✅ Services table is ready (using RPC)');
    } catch (error) {
      console.log('⚠️ RPC function not found, creating services table using raw SQL...');
      const { error: sqlError } = await supabase.from('_template').select('*').limit(0).csv();
      if (sqlError) {
        throw new Error(`Error creating services table: ${sqlError.message}`);
      }
      await supabase.from('auth.queries').select('*').limit(0).execute(`
        CREATE TABLE IF NOT EXISTS services (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT,
          description TEXT,
          phone TEXT,
          category TEXT,
          created_at TIMESTAMP DEFAULT now()
        );
      `);
      console.log('✅ Services table is ready (using SQL)');
    }

    // Create chat_log table if it doesn't exist
    console.log('💬 Checking/creating chat_log table...');
    const { error: chatLogError } = await supabase.rpc('create_chat_log_table_if_not_exists');
    
    if (chatLogError) {
      console.log('⚠️ RPC function not found, creating chat_log table directly...');
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS chat_log (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT,
          question TEXT,
          answer TEXT,
          source TEXT,
          created_at TIMESTAMP DEFAULT now()
        );
      `);
    }
    console.log('✅ Chat_log table is ready');

    // Check for service records
    const { data: serviceCount, error: countError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.warn(`⚠️ Warning: Could not count services: ${countError.message}`);
    } else {
      const count = serviceCount?.count || 0;
      console.log(`ℹ️ Service records: ${count}`);
      
      if (count === 0) {
        console.log('⚠️ The services table is empty. Consider adding sample data.');
      }
    }

    console.log('🎉 Database verification complete! Your Supabase instance is ready.');
  } catch (error) {
    console.error('❌ Database verification failed:', error);
    process.exit(1);
  }
}

// Run the verification
verifyDatabase();
