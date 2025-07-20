-- إعدادات Supabase للمطورين - Abu Dhabi OpenSea
-- Supabase Setup Instructions for Developers

/*
=================================================================
خطوات إعداد قاعدة البيانات في Supabase
Steps to setup database in Supabase
=================================================================

1. إنشاء مشروع جديد في Supabase
   Create new project in Supabase (https://supabase.com)

2. تطبيق مخطط قاعدة البيانات
   Apply database schema:
   - نفذ ملف: database_schema.sql
   - Execute file: database_schema.sql

3. تطبيق سياسات الأمان
   Apply security policies:
   - نفذ ملف: security_policies.sql
   - Execute file: security_policies.sql

4. تحديث إعدادات التطبيق
   Update app configuration:
   - افتح: lib/config/api_config.dart
   - Open: lib/config/api_config.dart
   - حدث URL و API Key
   - Update URL and API Key

=================================================================
*/

-- تمكين الإضافات المطلوبة - Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- تمكين المصادقة - Enable authentication
-- هذا يتم تلقائياً في Supabase - This is automatic in Supabase

-- إعداد المستخدمين والأدوار - Setup users and roles
-- إنشاء دور المدير - Create admin role
INSERT INTO auth.users (id, email, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@abudhabi-opensea.com', 'admin')
ON CONFLICT DO NOTHING;

-- إعداد البيانات التجريبية - Setup sample data
-- (سيتم تحميلها من ملفات CSV) - (Will be loaded from CSV files)

-- تحقق من إعداد RLS - Verify RLS setup
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- عرض السياسات المطبقة - Show applied policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
