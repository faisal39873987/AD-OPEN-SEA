# إعداد قاعدة البيانات - خطوات سريعة

## 1. إعداد Supabase
1. اذهب إلى [Supabase Dashboard](https://app.supabase.com/)
2. انتقل إلى مشروعك: `cceuyhebxxqafmrmnqhq`
3. اضغط على "SQL Editor" في الشريط الجانبي

## 2. تشغيل إعداد قاعدة البيانات
1. انسخ محتوى ملف `supabase-setup.sql`
2. الصق المحتوى في SQL Editor
3. اضغط "Run" لتشغيل الأوامر

## 3. التحقق من الإعداد
```sql
-- تحقق من الجداول
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('services', 'user_requests', 'user_feedback', 'bookings');

-- تحقق من البيانات التجريبية
SELECT * FROM services LIMIT 5;
```

## 4. إعداد Auth (اختياري)
1. اذهب إلى Authentication → Settings
2. فعل Google OAuth إذا أردت
3. أضف URL الموقع: `http://localhost:3000`

## 5. إعداد Storage (اختياري)
1. اذهب إلى Storage
2. أنشئ bucket جديد اسمه `avatars`
3. فعل Public access للصور

---

## الآن الموقع جاهز للاستخدام! 🎉

### الميزات المتوفرة:
- ✅ واجهة موحدة بتصميم ChatGPT
- ✅ تسجيل الدخول والتسجيل
- ✅ نظام الدفع مع Stripe
- ✅ بحث الخدمات
- ✅ دردشة مع المساعد الذكي
- ✅ تتبع الطلبات والتغذية الراجعة

### للوصول:
- الموقع: http://localhost:3000
- لوحة Supabase: https://app.supabase.com/project/cceuyhebxxqafmrmnqhq
- مساعد الذكي: https://chatgpt.com/g/g-6878b2d4d774819186609d62df9274c2-ad-plus?model=gpt-4-5
