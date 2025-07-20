# إعداد منتجات Stripe للإنتاج 🔐

## ملاحظة مهمة
المفاتيح المضافة حالياً هي **مفاتيح اختبار مؤقتة** لضمان عمل التطبيق. للحصول على المفاتيح الحقيقية، يجب إنشاء منتجات في Stripe Dashboard.

## خطوات إعداد منتجات Stripe الحقيقية:

### 1. تسجيل الدخول إلى Stripe Dashboard
```
https://dashboard.stripe.com
```

### 2. إنشاء المنتجات (Products)

#### المنتج الأساسي - Standard Plan
- اسم المنتج: **AD Pulse Standard**
- الوصف: Basic service discovery features
- نوع المنتج: Service
- السعر: حسب اختيارك (مثلاً 9.99 AED شهرياً)

#### المنتج المتقدم - Plus Plan  
- اسم المنتج: **AD Pulse Plus**
- الوصف: Advanced features with AI recommendations
- أسعار:
  - شهري: مثلاً 19.99 AED
  - سنوي: مثلاً 199.99 AED (خصم)

#### المنتج للفرق - Team Plan
- اسم المنتج: **AD Pulse Team**
- الوصف: Team collaboration and advanced analytics
- أسعار:
  - شهري: مثلاً 49.99 AED
  - سنوي: مثلاً 499.99 AED (خصم)

### 3. نسخ المفاتيح من Stripe

بعد إنشاء المنتجات، انسخ المفاتيح التالية:

```env
# Product IDs (تبدأ بـ prod_)
NEXT_PUBLIC_STRIPE_STANDARD_PRODUCT_ID=prod_xxxxxxxxxx

# Price IDs (تبدأ بـ price_)
NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID=price_xxxxxxxxxx
```

### 4. تحديث ملفات البيئة

#### للتطوير (.env.local):
```bash
# استخدم Test Keys للتطوير
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### للإنتاج (.env.production أو Vercel):
```bash
# استخدم Live Keys للإنتاج
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### 5. إعداد Webhook في Stripe

1. اذهب إلى **Developers > Webhooks**
2. أضف endpoint جديد: `https://yourdomain.com/api/webhooks/stripe`
3. اختر الأحداث:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 6. اختبار النظام

1. اختبار في بيئة Test أولاً
2. استخدام بطاقات Stripe الاختبارية:
   - **نجح**: 4242 4242 4242 4242
   - **فشل**: 4000 0000 0000 0002

## الحالة الحالية ✅

```
✅ مفاتيح اختبار مؤقتة مضافة
✅ التطبيق يعمل بدون أخطاء
✅ جاهز للنشر مع مفاتيح الاختبار
🔄 يحتاج مفاتيح Stripe حقيقية للإنتاج
```

## ملاحظات أمنية 🔒

- **لا تشارك** مفاتيح Live Secret مع أحد
- **استخدم فقط** Test keys في التطوير  
- **تأكد** من إعداد Webhook endpoints بشكل صحيح
- **مراجعة** إعدادات الأمان في Stripe Dashboard

---

*تم إنشاء هذا الملف لمساعدتك في إعداد Stripe بشكل صحيح* 🚀
