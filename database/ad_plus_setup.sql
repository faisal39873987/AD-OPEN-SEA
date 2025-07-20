-- Database Tables for AD PLUS Assistant

-- Services table
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

-- User requests table
CREATE TABLE IF NOT EXISTS user_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_input TEXT NOT NULL,
    response TEXT NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('supabase', 'gpt')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('paid', 'failed')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('confirmed', 'payment_failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies

-- Services: Public read, authenticated insert/update
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view services" ON services
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert services" ON services
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services" ON services
    FOR UPDATE USING (auth.role() = 'authenticated');

-- User requests: Users can read own data, all users can insert
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON user_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "All users can insert requests" ON user_requests
    FOR INSERT WITH CHECK (true);

-- User feedback: Public read, all users can insert, users can update own
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view feedback" ON user_feedback
    FOR SELECT USING (true);

CREATE POLICY "All users can insert feedback" ON user_feedback
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own feedback" ON user_feedback
    FOR UPDATE USING (auth.uid() = user_id);

-- Bookings: Users can read/write own data only
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO services (category, name, description, price, rating, contact, website, whatsapp, instagram, location) VALUES
('Personal trainers', 'Elite Fitness Coach', 'Professional personal trainer with 10+ years experience', 150.00, 4.8, '+971501234567', 'https://elitefitness.ae', '+971501234567', '@elitefitness', 'Abu Dhabi Marina'),
('Personal trainers', 'FitLife Personal Training', 'Specialized in weight loss and muscle building', 120.00, 4.6, '+971507654321', 'https://fitlife.ae', '+971507654321', '@fitlife', 'Corniche Road'),
('Yacht rentals', 'Luxury Yacht Charter', 'Premium yacht rental service for special occasions', 2500.00, 4.9, '+971501111111', 'https://luxuryyacht.ae', '+971501111111', '@luxuryyacht', 'Abu Dhabi Marina'),
('Yacht rentals', 'Sea Adventure Rentals', 'Affordable yacht rentals for families and groups', 1800.00, 4.5, '+971502222222', 'https://seaadventure.ae', '+971502222222', '@seaadventure', 'Yas Island'),
('Apartment rentals', 'Premium Serviced Apartments', 'Luxury furnished apartments for short-term stays', 800.00, 4.7, '+971503333333', 'https://premiumapts.ae', '+971503333333', '@premiumapts', 'Al Reem Island'),
('Apartment rentals', 'Cozy Home Rentals', 'Comfortable furnished apartments at affordable prices', 450.00, 4.3, '+971504444444', 'https://cozyhome.ae', '+971504444444', '@cozyhome', 'Khalifa City'),
('Beauty clinics', 'Glow Beauty Clinic', 'Advanced skincare and aesthetic treatments', 300.00, 4.8, '+971505555555', 'https://glowbeauty.ae', '+971505555555', '@glowbeauty', 'Al Bateen'),
('Beauty clinics', 'Radiance Medical Spa', 'Comprehensive beauty and wellness treatments', 400.00, 4.9, '+971506666666', 'https://radiance.ae', '+971506666666', '@radiance', 'Saadiyat Island'),
('Kids services', 'Little Angels Daycare', 'Professional childcare services for working parents', 200.00, 4.6, '+971507777777', 'https://littleangels.ae', '+971507777777', '@littleangels', 'Al Mushrif'),
('Kids services', 'Smart Kids Learning Center', 'Educational activities and tutoring for children', 180.00, 4.7, '+971508888888', 'https://smartkids.ae', '+971508888888', '@smartkids', 'Al Khalidiyah'),
('Housekeeping', 'SparkleClean Services', 'Professional residential and commercial cleaning', 100.00, 4.5, '+971509999999', 'https://sparkle.ae', '+971509999999', '@sparkle', 'Citywide'),
('Housekeeping', 'Perfect Home Care', 'Comprehensive home maintenance and cleaning services', 120.00, 4.8, '+971501010101', 'https://perfecthome.ae', '+971501010101', '@perfecthome', 'Citywide');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_rating ON services(rating);
CREATE INDEX IF NOT EXISTS idx_user_requests_user_id ON user_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_requests_created_at ON user_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for bookings table
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
