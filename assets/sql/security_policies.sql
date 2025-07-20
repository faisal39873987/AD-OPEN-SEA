-- ===== ROW-LEVEL SECURITY POLICIES =====
-- سياسات الأمان على مستوى الصفوف لقاعدة بيانات أبوظبي أوبن سي
-- Abu Dhabi OpenSea Database Row-Level Security Policies

-- =================================================================
-- تفعيل Row-Level Security على كل الجداول
-- =================================================================

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments_rent ENABLE ROW LEVEL SECURITY;
ALTER TABLE yacht_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_cleaning_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_generated_content ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- سياسات السماح بالقراءة (Read) - يمكن للجميع قراءة البيانات
-- =================================================================

CREATE POLICY "Allow read access" ON clinics FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON child_shops FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON apartments_rent FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON yacht_services FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON home_cleaning_services FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON user_generated_content FOR SELECT USING (true);

-- =================================================================
-- سياسات المحتوى المُنشأ من المستخدمين
-- =================================================================

-- سياسة السماح بالإضافة فقط من المستخدم المُسجل (Insert)
CREATE POLICY "Allow insert only for authenticated users"
ON user_generated_content FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- منع التعديل والحذف لبيانات المستخدمين من قبل الآخرين
CREATE POLICY "Allow update/delete only by owner"
ON user_generated_content FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow delete only by owner"
ON user_generated_content FOR DELETE USING (auth.uid() = user_id);

-- =================================================================
-- سياسات الخدمات الأساسية (للمدراء فقط)
-- =================================================================

-- سياسة للعيادات - إدراج وتعديل وحذف للمدراء فقط
CREATE POLICY "Allow admin full access clinics"
ON clinics FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- سياسة لمحلات الأطفال - إدراج وتعديل وحذف للمدراء فقط
CREATE POLICY "Allow admin full access child_shops"
ON child_shops FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- سياسة للشقق - إدراج وتعديل وحذف للمدراء فقط
CREATE POLICY "Allow admin full access apartments"
ON apartments_rent FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- سياسة لليخوت - إدراج وتعديل وحذف للمدراء فقط
CREATE POLICY "Allow admin full access yachts"
ON yacht_services FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- سياسة للتنظيف - إدراج وتعديل وحذف للمدراء فقط
CREATE POLICY "Allow admin full access cleaning"
ON home_cleaning_services FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- =================================================================
-- سياسات إضافية للمستخدمين المعتمدين
-- =================================================================

-- السماح للمستخدمين المُسجلين بإضافة تقييمات فقط
CREATE POLICY "Allow authenticated users to add reviews"
ON user_generated_content FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL AND 
    content_type IN ('review', 'rating', 'comment')
);

-- السماح للمدراء بإدارة كامل المحتوى المُنشأ
CREATE POLICY "Allow admin full control user content"
ON user_generated_content FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- =================================================================
-- تعليقات على السياسات
-- =================================================================

COMMENT ON POLICY "Allow read access" ON clinics IS 'السماح للجميع بقراءة بيانات العيادات - Public read access for clinics';
COMMENT ON POLICY "Allow read access" ON child_shops IS 'السماح للجميع بقراءة بيانات محلات الأطفال - Public read access for child shops';
COMMENT ON POLICY "Allow read access" ON apartments_rent IS 'السماح للجميع بقراءة بيانات الشقق - Public read access for apartments';
COMMENT ON POLICY "Allow read access" ON yacht_services IS 'السماح للجميع بقراءة بيانات اليخوت - Public read access for yacht services';
COMMENT ON POLICY "Allow read access" ON home_cleaning_services IS 'السماح للجميع بقراءة بيانات التنظيف - Public read access for cleaning services';
COMMENT ON POLICY "Allow read access" ON user_generated_content IS 'السماح للجميع بقراءة المحتوى المُنشأ - Public read access for user content';

COMMENT ON POLICY "Allow insert only for authenticated users" ON user_generated_content IS 'السماح بالإضافة للمستخدمين المُسجلين فقط - Insert allowed for authenticated users only';
COMMENT ON POLICY "Allow update/delete only by owner" ON user_generated_content IS 'السماح بالتعديل لصاحب المحتوى فقط - Update allowed for content owner only';
COMMENT ON POLICY "Allow delete only by owner" ON user_generated_content IS 'السماح بالحذف لصاحب المحتوى فقط - Delete allowed for content owner only';

-- =================================================================
-- ملاحظات هامة
-- =================================================================

/*
هذه السياسات تضمن:

1. قراءة عامة: يمكن لجميع المستخدمين قراءة بيانات الخدمات
2. حماية المحتوى: المستخدمون يمكنهم تعديل محتواهم فقط
3. صلاحيات المدراء: المدراء لديهم تحكم كامل بالنظام
4. المصادقة: العمليات الحساسة تتطلب مصادقة

ملاحظات الاستخدام:
- يجب تطبيق هذه السياسات بعد إنشاء الجداول
- تأكد من إعداد نظام المصادقة في Supabase
- اختبر السياسات قبل النشر في الإنتاج

These policies ensure:
1. Public read access for all service data
2. User content protection - users can only modify their own content
3. Admin privileges - admins have full system control
4. Authentication requirements for sensitive operations
*/

-- ===== END OF SECURITY POLICIES =====
