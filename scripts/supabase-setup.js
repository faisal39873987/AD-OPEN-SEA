// Supabase Database Management Script
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Connection details
const supabaseUrl = 'https://cceuyhebxxqafmrmnqhq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXV5aGVieHhxYWZtcm1ucWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzM5NTUsImV4cCI6MjA2NzQ0OTk1NX0.Z3DoMvHUwa7QU0HeMglW49t-qUmkb_Tm2iW3ljN8_Io';
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL for creating tables
const createTablesSQL = `
-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Services Table - Structured service data
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN (
        'personal_trainers', 
        'yacht_rentals', 
        'apartments', 
        'beauty_clinics', 
        'kids_services', 
        'housekeeping'
    )),
    provider_name TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.5,
    contact TEXT,
    website TEXT,
    whatsapp TEXT,
    instagram TEXT,
    image_url TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster category-based lookups
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- User Requests Table - Storing chat history with source
CREATE TABLE IF NOT EXISTS user_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_input TEXT NOT NULL,
    response TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('supabase', 'gpt')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for user_id to improve query performance for user history
CREATE INDEX IF NOT EXISTS idx_user_requests_user_id ON user_requests(user_id);

-- User Feedback Table - For ratings and reviews
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for service_id to improve lookups of feedback for specific services
CREATE INDEX IF NOT EXISTS idx_user_feedback_service_id ON user_feedback(service_id);

-- Sample data for services table (for testing purposes)
INSERT INTO services (category, provider_name, name, description, price, rating, contact, website, whatsapp, instagram, image_url, location)
VALUES
    ('personal_trainers', 'أحمد الفيتنس', 'مدرب أحمد الشخصي', 'مدرب شخصي متخصص في اللياقة البدنية واللياقة العامة', 250, 4.7, '+971501234567', 'https://ahmed-fitness.ae', '+971501234567', '@ahmed_fitness', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', 'أبوظبي - الخالدية'),
    ('personal_trainers', 'سارة الرياضية', 'مدربة سارة للسيدات', 'مدربة معتمدة متخصصة في تدريب النساء', 300, 4.9, '+971502345678', 'https://sara-fitness.ae', '+971502345678', '@sara_fitness', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2', 'أبوظبي - جزيرة الريم'),
    ('yacht_rentals', 'بحر أبوظبي', 'يخت الأميرة 50 قدم', 'تأجير يخوت فاخرة لرحلات خاصة', 1500, 4.5, '+971503456789', 'https://abudhabi-sea.ae', '+971503456789', '@abudhabi_sea', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a', 'مرسى ياس - أبوظبي'),
    ('yacht_rentals', 'الخليج الأزرق', 'يخت الحفلات الكبير', 'يخوت للحفلات والمناسبات الخاصة', 2000, 4.2, '+971504567890', 'https://blue-gulf.ae', '+971504567890', '@blue_gulf', 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13', 'مرينا مول - أبوظبي'),
    ('apartments', 'شقق الاتحاد الفاخرة', 'شقة بغرفتين مع إطلالة', 'شقق مفروشة فاخرة للإيجار', 5000, 4.6, '+971505678901', 'https://etihad-apartments.ae', '+971505678901', '@etihad_apartments', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'شارع الكورنيش - أبوظبي'),
    ('beauty_clinics', 'عيادة الجمال', 'باقة الجمال الشاملة', 'خدمات تجميل متكاملة للنساء', 800, 4.8, '+971506789012', 'https://beauty-clinic.ae', '+971506789012', '@beauty_clinic', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8', 'شارع المرور - أبوظبي'),
    ('kids_services', 'حضانة الطفل السعيد', 'رعاية أطفال بالساعة', 'رعاية أطفال متكاملة بأيدي مختصين', 1200, 4.4, '+971507890123', 'https://happy-kid.ae', '+971507890123', '@happy_kid', 'https://images.unsplash.com/photo-1526634332515-d56c5fd16991', 'مدينة خليفة - أبوظبي'),
    ('housekeeping', 'خدمات المنزل الشاملة', 'تنظيف شامل للمنزل', 'تنظيف منازل وخدمات منزلية متكاملة', 150, 4.3, '+971508901234', 'https://home-services.ae', '+971508901234', '@home_services', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952', 'أبوظبي - المشرف');
`;

// SQL for cleaning up old tables
const deleteOldTablesSQL = `
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS subscription;
DROP TABLE IF EXISTS schema_migrations;
`;

// Function to execute SQL using the Supabase REST API
async function executeDatabaseChanges() {
  console.log('Starting database operations...');
  
  try {
    // Step 1: Delete old tables
    console.log('Step 1: Deleting old tables...');
    const { data: deleteData, error: deleteError } = await supabase.rpc('exec_sql', { query: deleteOldTablesSQL });
    
    if (deleteError) {
      console.error('Error deleting old tables:', deleteError);
    } else {
      console.log('Successfully deleted old tables');
    }
    
    // Step 2: Create new tables
    console.log('Step 2: Creating new tables...');
    const { data: createData, error: createError } = await supabase.rpc('exec_sql', { query: createTablesSQL });
    
    if (createError) {
      console.error('Error creating new tables:', createError);
    } else {
      console.log('Successfully created new tables and inserted sample data');
    }
    
    // Step 3: Verify tables
    console.log('Step 3: Verifying database tables...');
    const { data: tables, error: listError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (listError) {
      console.error('Error listing tables:', listError);
    } else {
      console.log('Current tables in database:');
      tables.forEach(table => console.log(`- ${table.table_name}`));
      
      // Check if our new tables exist
      const requiredTables = ['services', 'user_requests', 'user_feedback'];
      const existingTables = tables.map(t => t.table_name);
      
      const allTablesExist = requiredTables.every(table => existingTables.includes(table));
      if (allTablesExist) {
        console.log('\nSUCCESS: All required tables have been created!');
      } else {
        console.log('\nWARNING: Some required tables are missing!');
        requiredTables.forEach(table => {
          console.log(`- ${table}: ${existingTables.includes(table) ? 'EXISTS' : 'MISSING'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Execute the database operations
executeDatabaseChanges();
