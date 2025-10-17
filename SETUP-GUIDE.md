# 🚀 دليل إعداد نظام التسجيل والإشعارات

هذا الدليل يشرح كيفية إعداد Firebase و Telegram Bot لتفعيل نظام التسجيل.

---

## 📋 المتطلبات

1. حساب Google (للوصول إلى Firebase)
2. حساب Telegram
3. متصفح ويب حديث

---

## 🔥 الخطوة 1: إعداد Firebase

### أ) إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اضغط على **"Add project"** أو **"إضافة مشروع"**
3. أدخل اسم المشروع (مثل: `educational-website`)
4. اتبع الخطوات (يمكنك تعطيل Google Analytics إذا أردت)
5. اضغط **"Create project"**

### ب) إضافة تطبيق ويب

1. في لوحة المشروع، اضغط على أيقونة **Web** (`</>`)
2. أدخل اسم التطبيق (مثل: `Academy Website`)
3. **لا تضع علامة** على "Firebase Hosting" (غير مطلوب)
4. اضغط **"Register app"**
5. **انسخ إعدادات Firebase** التي ستظهر (ستحتاجها لاحقاً)

### ج) تفعيل Authentication

1. من القائمة الجانبية، اختر **"Authentication"**
2. اضغط **"Get started"**
3. في تبويب **"Sign-in method"**:
   - فعّل **Email/Password** (اضغط عليه ← Enable ← Save)
   - فعّل **Google** (اضغط عليه ← Enable ← اختر بريد إلكتروني ← Save)

### د) تفعيل Firestore Database

1. من القائمة الجانبية، اختر **"Firestore Database"**
2. اضغط **"Create database"**
3. اختر **"Start in test mode"** (للتطوير)
4. اختر الموقع الأقرب لك (مثل: `europe-west1`)
5. اضغط **"Enable"**

### هـ) نسخ إعدادات Firebase

1. اذهب إلى **Project Settings** (أيقونة الترس)
2. انزل إلى قسم **"Your apps"**
3. انسخ الإعدادات التي تبدأ بـ `const firebaseConfig = {`

**مثال:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

---

## 📱 الخطوة 2: إعداد Telegram Bot

### أ) إنشاء Bot

1. افتح تليجرام وابحث عن: **@BotFather**
2. أرسل له: `/newbot`
3. أدخل اسم البوت (مثل: `Academy Notifications`)
4. أدخل username للبوت (يجب أن ينتهي بـ `bot`، مثل: `academy_notify_bot`)
5. **احفظ الـ Token** الذي سيرسله لك (يبدو مثل: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### ب) الحصول على Chat ID

**الطريقة 1: باستخدام Bot**
1. ابحث في تليجرام عن: **@userinfobot**
2. اضغط **Start** أو أرسل `/start`
3. سيرسل لك **User ID** - احفظه

**الطريقة 2: يدوياً**
1. أرسل أي رسالة للبوت الذي أنشأته
2. افتح في المتصفح: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   (استبدل `<YOUR_BOT_TOKEN>` بالـ Token الخاص بك)
3. ستجد `"chat":{"id":123456789}` - هذا هو الـ Chat ID

---

## ⚙️ الخطوة 3: تحديث الملفات

### افتح ملف `js/firebase-config.js`

1. ابحث عن السطور التي تبدأ بـ:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
   ```

2. استبدل البيانات بإعداداتك من Firebase:
   ```javascript
   const firebaseConfig = {
       apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789012",
       appId: "1:123456789012:web:xxxxxxxxxxxxx"
   };
   ```

3. ابحث عن:
   ```javascript
   const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
   const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';
   ```

4. استبدلها بالبيانات الخاصة بك:
   ```javascript
   const TELEGRAM_BOT_TOKEN = '123456789:ABCdefGHIjklMNOpqrsTUVwxyz';
   const TELEGRAM_CHAT_ID = '123456789';
   ```

5. **احفظ الملف**

---

## 🎯 الخطوة 4: التجربة

### اختبار التسجيل

1. افتح `register.html` في المتصفح
2. املأ بيانات التسجيل
3. اضغط **"إنشاء الحساب"**
4. يجب أن تصلك رسالة على تليجرام! 📱

### اختبار تسجيل الدخول

1. افتح `login.html` في المتصفح
2. أدخل البريد وكلمة المرور
3. اضغط **"تسجيل الدخول"**
4. يجب أن يتم تحويلك للصفحة الرئيسية

---

## 🔒 الخطوة 5: الأمان (مهم!)

### حماية Firebase

بعد الانتهاء من التطوير، يجب تعديل قواعد الأمان:

1. في Firebase Console → **Firestore Database** → **Rules**
2. استبدل القواعد بهذا:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### حماية Bot Token

**⚠️ مهم جداً:**
- **لا تنشر** ملف `firebase-config.js` على GitHub
- أضف الملف إلى `.gitignore`:
  ```
  js/firebase-config.js
  ```

**للنشر:**
- استخدم متغيرات بيئة (Environment Variables)
- أو استخدم خدمة أسرار (Secrets) في منصة الاستضافة

---

## 🌐 الخطوة 6: النشر

### خيارات النشر:

1. **Netlify** (موصى به):
   - اسحب المجلد على [netlify.com](https://netlify.com)
   - أو اربطه مع GitHub

2. **Vercel**:
   - استورد المشروع من GitHub
   - النشر تلقائي

3. **GitHub Pages**:
   - رفع الملفات على GitHub
   - Settings → Pages → Enable

**ملاحظة:** عند النشر، تأكد من إضافة Domain في إعدادات Firebase:
- Authentication → Settings → Authorized domains → Add domain

---

## 🎨 التخصيص

### تغيير الألوان

في `css/style.css`:
```css
:root {
    --primary-color: #4CAF50;  /* غير هذا اللون */
    --secondary-color: #2196F3;
}
```

### تغيير نص الإشعار في تليجرام

في `js/firebase-config.js`، عدّل دالة `sendTelegramNotification`:
```javascript
const message = `
🎓 *تسجيل مستخدم جديد*
👤 ${userData.fullName}
📧 ${userData.email}
`;
```

---

## ❓ حل المشاكل الشائعة

### المشكلة: "Firebase not defined"
**الحل:** تأكد من أن السكريبتات في الترتيب الصحيح:
```html
<script src="firebase-app.js"></script>
<script src="firebase-auth.js"></script>
<script src="firebase-firestore.js"></script>
<script src="js/firebase-config.js"></script>
<script src="js/auth.js"></script>
```

### المشكلة: لا تصل الإشعارات على تليجرام
**الحل:** 
- تأكد من Bot Token و Chat ID صحيحين
- أرسل رسالة للبوت أولاً قبل التجربة
- تحقق من Console في المتصفح للأخطاء

### المشكلة: "auth/unauthorized-domain"
**الحل:** 
- اذهب إلى Firebase Console
- Authentication → Settings → Authorized domains
- أضف الدومين (مثل: `localhost` أو دومين الاستضافة)

---

## 📞 الدعم

إذا واجهت مشاكل:
1. افحص **Console** في المتصفح (F12)
2. راجع **Firebase Console** لرؤية الأخطاء
3. تأكد من صحة جميع البيانات المدخلة

---

## ✅ قائمة التحقق النهائية

- [ ] تم إنشاء مشروع Firebase
- [ ] تم تفعيل Authentication (Email + Google)
- [ ] تم تفعيل Firestore Database
- [ ] تم نسخ إعدادات Firebase إلى `firebase-config.js`
- [ ] تم إنشاء Telegram Bot والحصول على Token
- [ ] تم الحصول على Chat ID
- [ ] تم تحديث ملف `firebase-config.js`
- [ ] تم اختبار التسجيل وتسجيل الدخول
- [ ] تصل الإشعارات على تليجرام بنجاح

**🎉 مبروك! نظام التسجيل جاهز للعمل!**
