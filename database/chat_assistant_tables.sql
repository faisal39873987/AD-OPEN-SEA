-- AD PLUS Assistant - Database Tables Setup
-- Created: July 18, 2025

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
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for service_id to improve lookups of feedback for specific services
CREATE INDEX IF NOT EXISTS idx_user_feedback_service_id ON user_feedback(service_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for services table
CREATE POLICY "Services are viewable by everyone" ON services
    FOR SELECT USING (true);
    
CREATE POLICY "Services can be inserted by authenticated users" ON services
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Services can be updated by authenticated users" ON services
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for user_requests table
CREATE POLICY "User requests are viewable by the user who created them" ON user_requests
    FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
    
CREATE POLICY "User requests can be inserted by authenticated users" ON user_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Create RLS policies for user_feedback table
CREATE POLICY "User feedback is viewable by everyone" ON user_feedback
    FOR SELECT USING (true);
    
CREATE POLICY "User feedback can be inserted by authenticated users" ON user_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
    
CREATE POLICY "User feedback can be updated by the user who created it" ON user_feedback
    FOR UPDATE USING (auth.uid() = user_id);

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
