import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cceuyhebxxqafmrmnqhq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXV5aGVieHhxYWZtcm1ucWhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg3Mzk1NSwiZXhwIjoyMDY3NDQ5OTU1fQ.VkYZyw68NhZMoGw8ufEaKg_94ZnXFfB';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up database tables...');

  // Create services table
  const { error: servicesError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS services (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
        contact VARCHAR(100),
        website VARCHAR(255),
        whatsapp VARCHAR(20),
        instagram VARCHAR(100),
        image_url VARCHAR(500),
        location VARCHAR(200) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  if (servicesError) {
    console.error('Error creating services table:', servicesError);
  } else {
    console.log('✅ Services table created successfully');
  }

  // Create user_requests table
  const { error: requestsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_requests (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        user_input TEXT NOT NULL,
        response TEXT NOT NULL,
        source VARCHAR(20) NOT NULL CHECK (source IN ('supabase', 'gpt')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  if (requestsError) {
    console.error('Error creating user_requests table:', requestsError);
  } else {
    console.log('✅ User requests table created successfully');
  }

  // Create user_feedback table
  const { error: feedbackError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_feedback (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        service_id UUID REFERENCES services(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  if (feedbackError) {
    console.error('Error creating user_feedback table:', feedbackError);
  } else {
    console.log('✅ User feedback table created successfully');
  }

  // Create bookings table
  const { error: bookingsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        service_id UUID REFERENCES services(id) ON DELETE CASCADE,
        payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('paid', 'failed', 'pending')),
        status VARCHAR(30) NOT NULL CHECK (status IN ('confirmed', 'payment_failed', 'pending')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  if (bookingsError) {
    console.error('Error creating bookings table:', bookingsError);
  } else {
    console.log('✅ Bookings table created successfully');
  }

  // Insert sample data
  const { error: insertError } = await supabase.from('services').insert([
    {
      category: 'Personal trainers',
      name: 'Elite Fitness Coach',
      description: 'Professional personal trainer with 10+ years experience',
      price: 150.00,
      rating: 4.8,
      contact: '+971501234567',
      website: 'https://elitefitness.ae',
      whatsapp: '+971501234567',
      instagram: '@elitefitness',
      location: 'Abu Dhabi Marina'
    },
    {
      category: 'Yacht rentals',
      name: 'Luxury Yacht Charter',
      description: 'Premium yacht rental service for special occasions',
      price: 2500.00,
      rating: 4.9,
      contact: '+971501111111',
      website: 'https://luxuryyacht.ae',
      whatsapp: '+971501111111',
      instagram: '@luxuryyacht',
      location: 'Abu Dhabi Marina'
    },
    {
      category: 'Apartment rentals',
      name: 'Premium Serviced Apartments',
      description: 'Luxury furnished apartments for short-term stays',
      price: 800.00,
      rating: 4.7,
      contact: '+971503333333',
      website: 'https://premiumapts.ae',
      whatsapp: '+971503333333',
      instagram: '@premiumapts',
      location: 'Al Reem Island'
    },
    {
      category: 'Beauty clinics',
      name: 'Glow Beauty Clinic',
      description: 'Advanced skincare and aesthetic treatments',
      price: 300.00,
      rating: 4.8,
      contact: '+971505555555',
      website: 'https://glowbeauty.ae',
      whatsapp: '+971505555555',
      instagram: '@glowbeauty',
      location: 'Al Bateen'
    },
    {
      category: 'Kids services',
      name: 'Little Angels Daycare',
      description: 'Professional childcare services for working parents',
      price: 200.00,
      rating: 4.6,
      contact: '+971507777777',
      website: 'https://littleangels.ae',
      whatsapp: '+971507777777',
      instagram: '@littleangels',
      location: 'Al Mushrif'
    },
    {
      category: 'Housekeeping',
      name: 'SparkleClean Services',
      description: 'Professional residential and commercial cleaning',
      price: 100.00,
      rating: 4.5,
      contact: '+971509999999',
      website: 'https://sparkle.ae',
      whatsapp: '+971509999999',
      instagram: '@sparkle',
      location: 'Citywide'
    }
  ]);

  if (insertError) {
    console.error('Error inserting sample data:', insertError);
  } else {
    console.log('✅ Sample data inserted successfully');
  }

  console.log('Database setup completed!');
}

setupDatabase().catch(console.error);
