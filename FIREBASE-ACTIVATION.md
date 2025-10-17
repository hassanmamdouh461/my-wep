# 🔥 خطوات تفعيل Firebase (مهم!)

تم تحديث الإعدادات، لكن تحتاج لتفعيل الخدمات في Firebase Console.

## ⚡ خطوتان فقط:

### 1️⃣ تفعيل Authentication

اذهب إلى: https://console.firebase.google.com/project/academy-website-f7c83/authentication

**الخطوات:**
1. اضغط **"Get started"** (إذا لم تفعله من قبل)
2. في تبويب **"Sign-in method"**:
   
   **✅ Email/Password:**
   - اضغط على "Email/Password"
   - فعّل الخيار الأول (Enable)
   - اضغط Save
   
   **✅ Google:**
   - اضغط على "Google"
   - فعّل Enable
   - اختر أي بريد إلكتروني من القائمة
   - اضغط Save

3. في تبويب **"Settings"**:
   - تحت "Authorized domains"
   - تأكد من وجود `localhost` (إذا لم يكن موجوداً، أضفه)

---

### 2️⃣ تفعيل Firestore Database

اذهب إلى: https://console.firebase.google.com/project/academy-website-f7c83/firestore

**الخطوات:**
1. اضغط **"Create database"**
2. اختر **"Start in test mode"**
3. اضغط Next
4. اختر موقع: **"europe-west"** (أو الأقرب)
5. اضغط **Enable**
6. انتظر دقيقة حتى يكتمل الإنشاء

---

## 🎯 بعد الانتهاء:

افتح `register.html` وسجل حساب جديد:
- ✅ سيُحفظ في Firebase
- ✅ ستصلك رسالة على Telegram
- ✅ يمكنك تسجيل الدخول من أي جهاز
- ✅ التسجيل عبر Google سيعمل

---

## ✅ قائمة التحقق:

- [ ] فعّلت Email/Password Authentication
- [ ] فعّلت Google Sign-in
- [ ] أضفت localhost في Authorized domains
- [ ] أنشأت Firestore Database في test mode
- [ ] جربت التسجيل وشتغل!

---

**بعد إكمال الخطوات، جرب التسجيل مباشرة!** 🚀
