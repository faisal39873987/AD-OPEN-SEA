# 🗄️ قاعدة بيانات أبوظبي أوبن سي - Database Documentation

## 📋 نظرة عامة
مجموعة ملفات SQL شاملة لإعداد قاعدة بيانات أبوظبي أوبن سي في Supabase.

## 📁 ملفات قاعدة البيانات

### 1. `database_schema.sql` - المخطط الرئيسي
```sql
-- يحتوي على:
- 6 جداول رئيسية للخدمات
- نماذج البيانات الأساسية
- الفهارس والقيود
- البيانات التجريبية
- التعليقات والوثائق
```

**الجداول الرئيسية:**
- `clinics` - العيادات التجميلية
- `child_shops` - محلات مستلزمات الأطفال  
- `apartments_rent` - تأجير الشقق
- `yacht_services` - خدمات اليخوت
- `home_cleaning_services` - خدمات التنظيف المنزلي
- `user_generated_content` - المحتوى المُنشأ من المستخدمين

### 2. `security_policies.sql` - سياسات الأمان
```sql
-- يحتوي على:
- تفعيل Row-Level Security
- سياسات القراءة العامة
- حماية بيانات المستخدمين
- صلاحيات المدراء
- سياسات المصادقة
```

**السياسات المطبقة:**
- ✅ قراءة عامة لجميع الخدمات
- ✅ إضافة محتوى للمستخدمين المُسجلين فقط
- ✅ تعديل/حذف المحتوى لصاحبه فقط
- ✅ تحكم كامل للمدراء

### 3. `supabase_setup.sql` - إعدادات التطبيق
```sql
-- يحتوي على:
- تمكين الإضافات المطلوبة
- إعداد أدوار المستخدمين
- تحقق من إعدادات RLS
- استعلامات الصيانة
```

## 🚀 خطوات الإعداد

### 1. إنشاء مشروع Supabase
```bash
# اذهب إلى https://supabase.com
# أنشئ مشروع جديد
# احصل على URL و API Key
```

### 2. تطبيق مخطط قاعدة البيانات
```sql
-- في SQL Editor في Supabase، نفذ:
\i database_schema.sql
```

### 3. تطبيق سياسات الأمان
```sql
-- نفذ ملف السياسات:
\i security_policies.sql
```

### 4. تشغيل إعدادات إضافية
```sql
-- نفذ الإعدادات النهائية:
\i supabase_setup.sql
```

### 5. تحديث إعدادات التطبيق
```dart
// في lib/config/api_config.dart
class ApiConfig {
  static const String supabaseUrl = 'YOUR_SUPABASE_URL';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
}
```

## 🔒 الأمان والصلاحيات

### سياسات Row-Level Security
```sql
-- جميع الجداول محمية بـ RLS
-- القراءة متاحة للجميع
-- الكتابة محدودة حسب الصلاحيات
```

### أدوار المستخدمين
- **زائر**: قراءة البيانات فقط
- **مستخدم مُسجل**: قراءة + إضافة محتوى + تعديل محتواه
- **مدير**: تحكم كامل بالنظام

## 📊 البيانات التجريبية

### ملفات CSV المرفقة:
- `domestic_workers.csv` - بيانات العمالة المنزلية
- `yacht_rental.csv` - بيانات تأجير اليخوت

### تحميل البيانات:
```sql
-- استخدم Supabase Dashboard لتحميل ملفات CSV
-- أو استخدم API لتحميل البيانات برمجياً
```

## 🛠️ الصيانة والمراقبة

### استعلامات مفيدة:
```sql
-- عرض إحصائيات الجداول
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY tablename;

-- عرض السياسات المطبقة
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```

### النسخ الاحتياطي:
```bash
# استخدم أدوات Supabase للنسخ الاحتياطي
# أو pg_dump للنسخ المخصص
```

## 📞 الدعم والمساعدة

### عند مواجهة مشاكل:
1. تحقق من صحة SQL syntax
2. تأكد من تطبيق جميع الملفات بالترتيب
3. راجع سجلات الأخطاء في Supabase
4. تحقق من صلاحيات المستخدم

### موارد مفيدة:
- [وثائق Supabase](https://supabase.com/docs)
- [دليل Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---
**إعداد قاعدة البيانات - أبوظبي أوبن سي 🌊**
