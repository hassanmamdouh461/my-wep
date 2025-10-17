# 🔶 وضع التجربة (Demo Mode)

الموقع الآن يعمل في **وضع التجربة** بدون Firebase.

## ✅ ما يعمل حالياً:

- ✅ إنشاء حساب جديد (يُحفظ في المتصفح فقط)
- ✅ تسجيل الدخول
- ✅ عرض اسم المستخدم في القائمة
- ✅ تسجيل الخروج
- ✅ جميع التحقق من البيانات

## ⚠️ ما لا يعمل:

- ❌ حفظ البيانات في قاعدة بيانات حقيقية
- ❌ إشعارات Telegram
- ❌ التسجيل عبر Google
- ❌ مزامنة البيانات بين الأجهزة

## 📦 كيف يعمل؟

البيانات تُحفظ في **localStorage** في المتصفح فقط:
- إذا حذفت الـ cache، ستفقد البيانات
- البيانات لا تظهر على أجهزة أخرى

## 🔥 للتحويل إلى Firebase الحقيقي:

### 1. أعد إعداد Firebase
اتبع `SETUP-GUIDE.md` خطوة بخطوة

### 2. عدّل الملفات:

**في `register.html` و `login.html`:**
```html
<!-- احذف هذا السطر: -->
<script src="js/demo-auth.js"></script>

<!-- وفعّل هذه السكريبتات: -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="js/firebase-config.js"></script>
<script src="js/auth.js"></script>
```

**في `index.html`:**
```html
<!-- احذف هذا السطر: -->
<script src="js/demo-auth.js"></script>
```

### 3. عدّل `js/firebase-config.js`
ضع إعدادات Firebase الحقيقية

---

## 🎯 الخلاصة

- **حالياً:** وضع تجريبي سريع للاختبار ✅
- **لاحقاً:** عدّل firebase-config.js واستخدم النظام الحقيقي 🔥

---

**💡 نصيحة:** جرّب الموقع الآن في وضع التجربة، وعندما تكون جاهزاً، حوّله إلى Firebase!
