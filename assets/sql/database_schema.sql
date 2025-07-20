-- قاعدة بيانات أبوظبي أوبن سي - Abu Dhabi OpenSea Database Schema
-- مخطط قاعدة البيانات الرئيسي للخدمات البحرية والتجارية في أبوظبي

-- عيادات تجميلية أبوظبي
CREATE TABLE clinics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    services TEXT[],
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- محلات مستلزمات الأطفال أبوظبي
CREATE TABLE child_shops (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    products TEXT[],
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- تأجير الشقق في أبوظبي
CREATE TABLE apartments_rent (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- خدمات اليخوت في أبوظبي
CREATE TABLE yacht_services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    yacht_types TEXT[],
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- خدمات تنظيف المنازل في أبوظبي
CREATE TABLE home_cleaning_services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    services TEXT[],
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- بيانات المستخدم الإضافية
CREATE TABLE user_generated_content (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    data_type TEXT,
    content JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===== فهارس لتحسين الأداء =====
CREATE INDEX idx_clinics_location ON clinics(location);
CREATE INDEX idx_clinics_services ON clinics USING GIN(services);

CREATE INDEX idx_child_shops_location ON child_shops(location);
CREATE INDEX idx_child_shops_products ON child_shops USING GIN(products);

CREATE INDEX idx_apartments_rent_price ON apartments_rent(price);
CREATE INDEX idx_apartments_rent_bedrooms ON apartments_rent(bedrooms);
CREATE INDEX idx_apartments_rent_location ON apartments_rent(location);

CREATE INDEX idx_yacht_services_location ON yacht_services(location);
CREATE INDEX idx_yacht_services_types ON yacht_services USING GIN(yacht_types);

CREATE INDEX idx_home_cleaning_location ON home_cleaning_services(location);
CREATE INDEX idx_home_cleaning_services ON home_cleaning_services USING GIN(services);

CREATE INDEX idx_user_content_user_id ON user_generated_content(user_id);
CREATE INDEX idx_user_content_data_type ON user_generated_content(data_type);

-- ===== بيانات تجريبية =====

-- إدراج عيادات تجميلية
INSERT INTO clinics (name, description, services, phone, location) VALUES
('مركز أبوظبي للتجميل', 'مركز تجميل متكامل يقدم أحدث تقنيات التجميل', ARRAY['تجميل الوجه', 'نحت الجسم', 'الليزر', 'البوتوكس'], '+971-2-1234567', 'شارع الكورنيش، أبوظبي'),
('عيادة النخبة التجميلية', 'عيادة راقية مع أطباء خبراء في التجميل', ARRAY['حقن الفيلر', 'شد الوجه', 'تجميل الأنف', 'زراعة الشعر'], '+971-2-2345678', 'جزيرة الريم، أبوظبي'),
('مركز الجمال الذهبي', 'خدمات تجميلية شاملة للرجال والنساء', ARRAY['العناية بالبشرة', 'إزالة الشعر بالليزر', 'تبييض الأسنان'], '+971-2-3456789', 'مدينة خليفة، أبوظبي');

-- إدراج محلات الأطفال
INSERT INTO child_shops (name, description, products, phone, location) VALUES
('عالم الأطفال السعيد', 'متجر شامل لجميع احتياجات الأطفال والرضع', ARRAY['ملابس أطفال', 'ألعاب تعليمية', 'مستلزمات المدرسة', 'عربات الأطفال'], '+971-2-4567890', 'مول مارينا، أبوظبي'),
('متجر الطفولة', 'متخصص في الألعاب التعليمية ومستلزمات الرضع', ARRAY['ألعاب ذكية', 'كتب أطفال', 'مستلزمات الرضاعة', 'كراسي السيارة'], '+971-2-5678901', 'مول الوحدة، أبوظبي'),
('بيت الطفل', 'ملابس وألعاب وأثاث الأطفال عالي الجودة', ARRAY['أثاث أطفال', 'ألعاب خشبية', 'ملابس عضوية'], '+971-2-6789012', 'شارع النصر، أبوظبي');

-- إدراج شقق للإيجار
INSERT INTO apartments_rent (title, description, price, bedrooms, bathrooms, phone, location) VALUES
('شقة فاخرة بإطلالة على البحر', 'شقة حديثة ومفروشة بالكامل مع إطلالة بانورامية على الخليج العربي', 8500.00, 2, 2, '+971-50-1234567', 'الكورنيش، أبوظبي'),
('شقة عائلية واسعة في منطقة هادئة', 'شقة مناسبة للعائلات الكبيرة مع جميع المرافق والخدمات', 12000.00, 3, 3, '+971-50-2345678', 'خليفة سيتي، أبوظبي'),
('شقة عصرية في قلب المدينة', 'شقة حديثة قريبة من المولات والمدارس والمستشفيات', 7000.00, 1, 1, '+971-50-3456789', 'وسط أبوظبي'),
('فيلا فاخرة مع حديقة خاصة', 'فيلا من 4 غرف نوم مع حديقة ومسبح خاص', 25000.00, 4, 4, '+971-50-4567890', 'جزيرة ياس، أبوظبي');

-- إدراج خدمات اليخوت
INSERT INTO yacht_services (name, description, yacht_types, phone, location) VALUES
('مارينا أبوظبي للخدمات البحرية', 'خدمات شاملة لليخوت والقوارب مع صيانة متخصصة', ARRAY['يخوت سياحية', 'قوارب صيد', 'يخوت فاخرة', 'قوارب سريعة'], '+971-2-7890123', 'مارينا أبوظبي'),
('تأجير اليخوت الفاخرة', 'تأجير يخوت VIP مع طاقم محترف ورحلات منظمة', ARRAY['يخوت VIP', 'رحلات بحرية', 'احتفالات', 'جولات سياحية'], '+971-2-8901234', 'جزيرة ياس'),
('خدمات القوارب الذهبية', 'صيانة وإصلاح وتأجير جميع أنواع القوارب', ARRAY['قوارب رياضية', 'قوارب صيد', 'يخوت متوسطة'], '+971-2-9012345', 'ميناء زايد');

-- إدراج خدمات تنظيف المنازل
INSERT INTO home_cleaning_services (name, description, services, phone, location) VALUES
('شركة التنظيف المثالي', 'خدمات تنظيف منازل احترافية مع ضمان الجودة', ARRAY['تنظيف شامل', 'تنظيف السجاد', 'تنظيف النوافذ', 'تنظيف المطابخ'], '+971-2-0123456', 'جميع مناطق أبوظبي'),
('النظافة الراقية', 'خدمات تنظيف راقية ومضمونة للمنازل والمكاتب', ARRAY['تنظيف يومي', 'تنظيف عميق', 'خدمات الكي', 'تنظيف الأثاث'], '+971-2-1234560', 'أبوظبي والضواحي'),
('البيت النظيف', 'فريق محترف لتنظيف المنازل والفلل', ARRAY['تنظيف الفلل', 'تنظيف الشقق', 'تنظيف ما بعد الدهان', 'تنظيف المسابح'], '+971-2-2345601', 'جزيرة الريم وأبوظبي');

-- ===== تعليقات ومعلومات إضافية =====
COMMENT ON TABLE clinics IS 'جدول العيادات التجميلية في أبوظبي';
COMMENT ON TABLE child_shops IS 'جدول محلات مستلزمات الأطفال';
COMMENT ON TABLE apartments_rent IS 'جدول شقق الإيجار في أبوظبي';
COMMENT ON TABLE yacht_services IS 'جدول خدمات اليخوت والقوارب';
COMMENT ON TABLE home_cleaning_services IS 'جدول خدمات تنظيف المنازل';
COMMENT ON TABLE user_generated_content IS 'جدول المحتوى المُدخل من المستخدمين';

-- ===== ADVANCED FEATURES AND ADDITIONAL TABLES =====

-- User Authentication and Profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    language_preference TEXT DEFAULT 'ar',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Service Categories for Better Organization
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews and Ratings System
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL, -- 'clinic', 'child_shop', 'apartment', 'yacht', 'cleaning'
    service_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Favorites/Bookmarks System
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    service_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, service_type, service_id)
);

-- Search History and Analytics
CREATE TABLE search_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    search_query TEXT NOT NULL,
    search_type TEXT, -- 'general', 'clinic', 'apartment', etc.
    results_count INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications System
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    message_ar TEXT NOT NULL,
    message_en TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Service Inquiries and Contact Forms
CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    service_type TEXT NOT NULL,
    service_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'responded', 'closed'
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP
);

-- Service Images and Media
CREATE TABLE service_images (
    id SERIAL PRIMARY KEY,
    service_type TEXT NOT NULL,
    service_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    alt_text_ar TEXT,
    alt_text_en TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Business Hours for Services
CREATE TABLE business_hours (
    id SERIAL PRIMARY KEY,
    service_type TEXT NOT NULL,
    service_id INTEGER NOT NULL,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===== PERFORMANCE INDEXES =====
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_reviews_service ON reviews(service_type, service_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

CREATE INDEX idx_favorites_user_service ON favorites(user_id, service_type, service_id);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_query ON search_history(search_query);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

CREATE INDEX idx_inquiries_service ON inquiries(service_type, service_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_user_id ON inquiries(user_id);

CREATE INDEX idx_service_images_service ON service_images(service_type, service_id);
CREATE INDEX idx_service_images_primary ON service_images(is_primary);

CREATE INDEX idx_business_hours_service ON business_hours(service_type, service_id);
CREATE INDEX idx_business_hours_day ON business_hours(day_of_week);

-- ===== SAMPLE DATA FOR NEW TABLES =====

-- Insert Service Categories
INSERT INTO service_categories (name_ar, name_en, description_ar, description_en, icon, color, sort_order) VALUES
('العيادات التجميلية', 'Beauty Clinics', 'عيادات التجميل والعناية بالبشرة', 'Beauty and skincare clinics', '💄', '#E91E63', 1),
('محلات الأطفال', 'Kids Stores', 'مستلزمات وألعاب الأطفال', 'Children supplies and toys', '🧸', '#FF9800', 2),
('تأجير الشقق', 'Apartment Rentals', 'شقق وفلل للإيجار', 'Apartments and villas for rent', '🏠', '#2196F3', 3),
('خدمات اليخوت', 'Yacht Services', 'خدمات اليخوت والقوارب', 'Yacht and boat services', '⛵', '#00BCD4', 4),
('تنظيف المنازل', 'Home Cleaning', 'خدمات تنظيف المنازل', 'Home cleaning services', '🧹', '#4CAF50', 5);

-- Insert Sample Users (for testing)
INSERT INTO users (email, password_hash, first_name, last_name, phone, language_preference) VALUES
('user1@example.com', '$2a$10$dummy_hash_1', 'أحمد', 'محمد', '+971501234567', 'ar'),
('user2@example.com', '$2a$10$dummy_hash_2', 'Sarah', 'Ali', '+971502345678', 'en'),
('user3@example.com', '$2a$10$dummy_hash_3', 'فاطمة', 'أحمد', '+971503456789', 'ar');

-- Insert Sample Reviews
INSERT INTO reviews (user_id, service_type, service_id, rating, comment, is_approved) 
SELECT u.id, 'clinic', 1, 5, 'خدمة ممتازة وطاقم محترف جداً', TRUE
FROM users u WHERE u.email = 'user1@example.com'
UNION ALL
SELECT u.id, 'clinic', 1, 4, 'Great service and professional staff', TRUE
FROM users u WHERE u.email = 'user2@example.com'
UNION ALL
SELECT u.id, 'child_shop', 1, 5, 'أفضل محل لمستلزمات الأطفال في أبوظبي', TRUE
FROM users u WHERE u.email = 'user3@example.com';

-- Insert Business Hours (Monday to Friday 9 AM - 6 PM for clinics)
INSERT INTO business_hours (service_type, service_id, day_of_week, open_time, close_time)
SELECT 'clinic', clinic_id, dow, '09:00'::TIME, '18:00'::TIME
FROM (SELECT id as clinic_id FROM clinics LIMIT 3) clinics
CROSS JOIN (SELECT generate_series(1, 5) as dow) days;

-- Insert Business Hours for Weekend (Saturday 9 AM - 2 PM)
INSERT INTO business_hours (service_type, service_id, day_of_week, open_time, close_time)
SELECT 'clinic', clinic_id, 6, '09:00'::TIME, '14:00'::TIME
FROM (SELECT id as clinic_id FROM clinics LIMIT 3) clinics;

-- ===== VIEWS FOR EASY DATA ACCESS =====

-- View for services with average ratings
CREATE VIEW services_with_ratings AS
SELECT 
    'clinic' as service_type,
    c.id,
    c.name,
    c.description,
    c.phone,
    c.location,
    c.created_at,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM clinics c
LEFT JOIN reviews r ON r.service_type = 'clinic' AND r.service_id = c.id AND r.is_approved = TRUE
GROUP BY c.id, c.name, c.description, c.phone, c.location, c.created_at

UNION ALL

SELECT 
    'child_shop' as service_type,
    cs.id,
    cs.name,
    cs.description,
    cs.phone,
    cs.location,
    cs.created_at,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM child_shops cs
LEFT JOIN reviews r ON r.service_type = 'child_shop' AND r.service_id = cs.id AND r.is_approved = TRUE
GROUP BY cs.id, cs.name, cs.description, cs.phone, cs.location, cs.created_at

UNION ALL

SELECT 
    'apartment' as service_type,
    ar.id,
    ar.title as name,
    ar.description,
    ar.phone,
    ar.location,
    ar.created_at,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM apartments_rent ar
LEFT JOIN reviews r ON r.service_type = 'apartment' AND r.service_id = ar.id AND r.is_approved = TRUE
GROUP BY ar.id, ar.title, ar.description, ar.phone, ar.location, ar.created_at

UNION ALL

SELECT 
    'yacht' as service_type,
    ys.id,
    ys.name,
    ys.description,
    ys.phone,
    ys.location,
    ys.created_at,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM yacht_services ys
LEFT JOIN reviews r ON r.service_type = 'yacht' AND r.service_id = ys.id AND r.is_approved = TRUE
GROUP BY ys.id, ys.name, ys.description, ys.phone, ys.location, ys.created_at

UNION ALL

SELECT 
    'cleaning' as service_type,
    hcs.id,
    hcs.name,
    hcs.description,
    hcs.phone,
    hcs.location,
    hcs.created_at,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM home_cleaning_services hcs
LEFT JOIN reviews r ON r.service_type = 'cleaning' AND r.service_id = hcs.id AND r.is_approved = TRUE
GROUP BY hcs.id, hcs.name, hcs.description, hcs.phone, hcs.location, hcs.created_at;

-- ===== STORED PROCEDURES AND FUNCTIONS =====

-- Function to get services by location
CREATE OR REPLACE FUNCTION get_services_by_location(location_query TEXT)
RETURNS TABLE (
    service_type TEXT,
    service_id INTEGER,
    name TEXT,
    description TEXT,
    phone TEXT,
    location TEXT,
    avg_rating NUMERIC,
    review_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM services_with_ratings
    WHERE services_with_ratings.location ILIKE '%' || location_query || '%'
    ORDER BY avg_rating DESC, review_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to search services
CREATE OR REPLACE FUNCTION search_services(search_query TEXT)
RETURNS TABLE (
    service_type TEXT,
    service_id INTEGER,
    name TEXT,
    description TEXT,
    phone TEXT,
    location TEXT,
    avg_rating NUMERIC,
    review_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM services_with_ratings
    WHERE 
        services_with_ratings.name ILIKE '%' || search_query || '%' OR
        services_with_ratings.description ILIKE '%' || search_query || '%' OR
        services_with_ratings.location ILIKE '%' || search_query || '%'
    ORDER BY avg_rating DESC, review_count DESC;
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGERS FOR AUTOMATIC UPDATES =====

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply the trigger to reviews table
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== ADDITIONAL COMMENTS =====
COMMENT ON TABLE users IS 'User authentication and profile information - معلومات المستخدمين والمصادقة';
COMMENT ON TABLE service_categories IS 'Service categories for organization - فئات الخدمات للتنظيم';
COMMENT ON TABLE reviews IS 'User reviews and ratings system - نظام التقييمات والمراجعات';
COMMENT ON TABLE favorites IS 'User favorites/bookmarks - المفضلة والإشارات المرجعية';
COMMENT ON TABLE search_history IS 'Search analytics and history - تحليلات وتاريخ البحث';
COMMENT ON TABLE notifications IS 'User notifications system - نظام الإشعارات';
COMMENT ON TABLE inquiries IS 'Service inquiries and contact forms - استفسارات الخدمات ونماذج الاتصال';
COMMENT ON TABLE service_images IS 'Images and media for services - صور ووسائط الخدمات';
COMMENT ON TABLE business_hours IS 'Business operating hours - ساعات العمل';

COMMENT ON VIEW services_with_ratings IS 'Unified view of all services with ratings - عرض موحد لجميع الخدمات مع التقييمات';

-- ===== ROW-LEVEL SECURITY POLICIES =====
-- سياسات الأمان على مستوى الصفوف

-- تفعيل Row-Level Security على كل الجداول
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments_rent ENABLE ROW LEVEL SECURITY;
ALTER TABLE yacht_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_cleaning_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_generated_content ENABLE ROW LEVEL SECURITY;

-- سياسات السماح بالقراءة (Read) - يمكن للجميع قراءة البيانات
CREATE POLICY "Allow read access" ON clinics FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON child_shops FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON apartments_rent FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON yacht_services FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON home_cleaning_services FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON user_generated_content FOR SELECT USING (true);

-- سياسات السماح بالإضافة فقط من المستخدم المُسجل (Insert)
CREATE POLICY "Allow insert only for authenticated users"
ON user_generated_content FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- منع التعديل والحذف لبيانات المستخدمين من قبل الآخرين
CREATE POLICY "Allow update/delete only by owner"
ON user_generated_content FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow delete only by owner"
ON user_generated_content FOR DELETE USING (auth.uid() = user_id);

-- سياسات إضافية للجداول الأخرى (للمدراء فقط)
-- يمكن للمدراء فقط إضافة وتعديل بيانات الخدمات الأساسية

-- سياسة للعيادات - إدراج وتعديل للمدراء فقط
CREATE POLICY "Allow admin insert/update clinics"
ON clinics FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- سياسة لمحلات الأطفال - إدراج وتعديل للمدراء فقط
CREATE POLICY "Allow admin insert/update child_shops"
ON child_shops FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- سياسة للشقق - إدراج وتعديل للمدراء فقط
CREATE POLICY "Allow admin insert/update apartments"
ON apartments_rent FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- سياسة لليخوت - إدراج وتعديل للمدراء فقط
CREATE POLICY "Allow admin insert/update yachts"
ON yacht_services FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- سياسة للتنظيف - إدراج وتعديل للمدراء فقط
CREATE POLICY "Allow admin insert/update cleaning"
ON home_cleaning_services FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- تعليقات على السياسات
COMMENT ON POLICY "Allow read access" ON clinics IS 'السماح للجميع بقراءة بيانات العيادات';
COMMENT ON POLICY "Allow read access" ON child_shops IS 'السماح للجميع بقراءة بيانات محلات الأطفال';
COMMENT ON POLICY "Allow read access" ON apartments_rent IS 'السماح للجميع بقراءة بيانات الشقق';
COMMENT ON POLICY "Allow read access" ON yacht_services IS 'السماح للجميع بقراءة بيانات اليخوت';
COMMENT ON POLICY "Allow read access" ON home_cleaning_services IS 'السماح للجميع بقراءة بيانات التنظيف';
COMMENT ON POLICY "Allow read access" ON user_generated_content IS 'السماح للجميع بقراءة المحتوى المُنشأ';

COMMENT ON POLICY "Allow insert only for authenticated users" ON user_generated_content IS 'السماح بالإضافة للمستخدمين المُسجلين فقط';
COMMENT ON POLICY "Allow update/delete only by owner" ON user_generated_content IS 'السماح بالتعديل لصاحب المحتوى فقط';
COMMENT ON POLICY "Allow delete only by owner" ON user_generated_content IS 'السماح بالحذف لصاحب المحتوى فقط';

-- ===== END OF SECURITY POLICIES =====

-- ===== END OF SCHEMA =====
