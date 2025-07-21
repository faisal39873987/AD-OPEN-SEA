#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'database', 'ad_plus_setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute SQL
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }
    
    console.log('Database setup completed successfully!');
    
    // Verify tables exist
    const { data: services } = await supabase
      .from('services')
      .select('count(*)')
      .single();
    
    if (services) {
      console.log('Services table verified!');
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();
