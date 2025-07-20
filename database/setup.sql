-- ==================================================
-- Abu Dhabi OpenSea - Supabase Database Setup
-- ==================================================

-- Enable Row Level Security (RLS) extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    parameters JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Providers Table
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0.0,
    availability BOOLEAN DEFAULT TRUE,
    location POINT,
    contact_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_price DECIMAL(10,2),
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    stripe_payment_intent_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles Table (جدول ملفات المستخدمين)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    subscription_type VARCHAR(50) DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table (جدول التقييمات)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- Row Level Security (RLS) Policies
-- سياسات أمان مستوى الصف
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Analytics Events Policies
CREATE POLICY "Users can insert their own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics events" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Service Providers Policies (Public read, authenticated insert/update)
CREATE POLICY "Anyone can view service providers" ON service_providers
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert service providers" ON service_providers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Bookings Policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- User Profiles Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Reviews Policies
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==================================================
-- Functions and Triggers
-- الدوال والمحفزات
-- ==================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate average rating for service providers
CREATE OR REPLACE FUNCTION update_service_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE service_providers 
    SET rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE service_provider_id = NEW.service_provider_id
    )
    WHERE id = NEW.service_provider_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update rating when new review is added
CREATE TRIGGER update_rating_on_review_insert AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_service_provider_rating();

-- ==================================================
-- Sample Data (بيانات تجريبية)
-- ==================================================

-- Insert sample service providers
INSERT INTO service_providers (name, service_type, description, price, availability) VALUES
('Marina Boat Rental', 'boat_rental', 'Professional boat rental services with experienced crew', 500.00, true),
('Ocean Fishing Tours', 'fishing', 'Deep sea fishing experiences with all equipment provided', 300.00, true),
('Sunset Cruise Company', 'cruise', 'Romantic sunset cruises around Abu Dhabi coastline', 200.00, true),
('Water Sports Center', 'water_sports', 'Jet skiing, parasailing, and other water activities', 150.00, true),
('Maritime Training Institute', 'training', 'Professional maritime training and certification courses', 1000.00, true)
ON CONFLICT (id) DO NOTHING;

-- ==================================================
-- Indexes for Performance
-- فهارس للأداء
-- ==================================================

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_service_providers_type ON service_providers(service_type);
CREATE INDEX IF NOT EXISTS idx_service_providers_availability ON service_providers(availability);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(service_provider_id);

-- ==================================================
-- Views for Common Queries
-- طرق عرض للاستعلامات الشائعة
-- ==================================================

-- View for service providers with their average ratings
CREATE OR REPLACE VIEW service_providers_with_ratings AS
SELECT 
    sp.*,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM service_providers sp
LEFT JOIN reviews r ON sp.id = r.service_provider_id
GROUP BY sp.id;

-- View for user booking history
CREATE OR REPLACE VIEW user_booking_history AS
SELECT 
    b.*,
    sp.name as service_provider_name,
    sp.service_type,
    up.full_name as user_name
FROM bookings b
JOIN service_providers sp ON b.service_provider_id = sp.id
JOIN user_profiles up ON b.user_id = up.id;

-- ==================================================
-- Completion Message
-- ==================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Abu Dhabi OpenSea database setup completed successfully!';
    RAISE NOTICE '🌊 Tables created: analytics_events, notifications, service_providers, bookings, user_profiles, reviews';
    RAISE NOTICE '🔐 Row Level Security enabled with appropriate policies';
    RAISE NOTICE '📊 Performance indexes and triggers configured';
    RAISE NOTICE '🚀 Ready for Abu Dhabi OpenSea application!';
END
$$;
