-- services.sql: تعريف جدول الخدمات للمنصة

-- إنشاء جدول الخدمات
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_category TEXT NOT NULL,        -- نوع الخدمة (مدربين خاصين، خدامات، إلخ)
  name TEXT NOT NULL,                    -- اسم الخدمة أو المقدم
  description TEXT,                      -- وصف الخدمة
  price NUMERIC(10,2),                   -- سعر الخدمة
  phone VARCHAR(20),                     -- رقم الهاتف
  whatsapp VARCHAR(20),                  -- رقم واتساب
  instagram TEXT,                        -- حساب انستغرام
  location TEXT,                         -- الموقع (إن وُجد)
  available BOOLEAN DEFAULT TRUE,        -- متاح أو غير متاح
  created_at TIMESTAMP DEFAULT NOW()     -- تاريخ الإضافة
);

-- إنشاء فهرس على حقل التصنيف لتسريع عمليات البحث
CREATE INDEX idx_services_category ON services(service_category);

-- إنشاء فهرس على حقل الاسم لتسريع عمليات البحث بالاسم
CREATE INDEX idx_services_name ON services(name);

-- إضافة تعليق على الجدول
COMMENT ON TABLE services IS 'جدول الخدمات المتاحة في منصة AD Pulse';

-- إضافة بعض البيانات التجريبية
INSERT INTO services (service_category, name, description, price, phone, whatsapp, instagram, location)
VALUES 
  ('مدربين خاصين', 'أحمد محمد', 'مدرب لياقة بدنية معتمد مع خبرة 5 سنوات في التدريب الشخصي', 250.00, '+97150XXXXXXX', '+97150XXXXXXX', 'ahmad_fitness', 'أبوظبي - الريم'),
  ('مدربين خاصين', 'سارة علي', 'مدربة يوغا محترفة متخصصة في اليوغا العلاجية', 200.00, '+97155XXXXXXX', '+97155XXXXXXX', 'sara_yoga', 'أبوظبي - المارية'),
  ('خدم منازل', 'وكالة الإمارات للخدمات', 'توفير عاملات منازل بنظام الساعة أو الدوام الكامل', 30.00, '+9712XXXXXXX', '+9715XXXXXXX', 'emirates_services', 'أبوظبي - المركزية'),
  ('سائقين', 'محمد أحمد', 'سائق خاص ذو خبرة في أبوظبي مع رخصة قيادة إماراتية', 3000.00, '+97154XXXXXXX', '+97154XXXXXXX', NULL, 'أبوظبي - المصفح'),
  ('رعاية أطفال', 'مركز السعادة', 'خدمات رعاية الأطفال مع مربيات مؤهلات', 50.00, '+9712XXXXXXX', '+9715XXXXXXX', 'happiness_center', 'أبوظبي - الخالدية');
