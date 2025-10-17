// ================================
// إعدادات Firebase
// ================================
// للحصول على هذه الإعدادات:
// 1. اذهب إلى https://console.firebase.google.com
// 2. أنشئ مشروع جديد (أو اختر مشروع موجود)
// 3. اذهب إلى Project Settings > General
// 4. في قسم "Your apps" اختر Web app (</>) وانسخ الإعدادات

const firebaseConfig = {
    apiKey: "AIzaSyCOju8ZxRa5X3OO0rF3XKK32zpoiVsFLdI",
    authDomain: "academy-website-f7c83.firebaseapp.com",
    projectId: "academy-website-f7c83",
    storageBucket: "academy-website-f7c83.firebasestorage.app",
    messagingSenderId: "918853790493",
    appId: "1:918853790493:web:2153902e0134d8396fcff4"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// الحصول على مراجع للخدمات
const auth = firebase.auth();
const db = firebase.firestore();

// ================================
// إعدادات Telegram Bot
// ================================
// للحصول على Bot Token:
// 1. ابحث عن @BotFather في تليجرام
// 2. أرسل /newbot واتبع التعليمات
// 3. انسخ الـ Token

// للحصول على Chat ID:
// 1. ابحث عن @userinfobot في تليجرام
// 2. أرسل /start
// 3. انسخ الـ ID الخاص بك

const TELEGRAM_BOT_TOKEN = '8498245959:AAE9P-_7yutJlLBzAkrWLn07yZKILDF4f1k';
const TELEGRAM_CHAT_ID = '6479051123';

// دالة إرسال رسالة إلى تليجرام
async function sendTelegramNotification(userData) {
    const message = `
🎓 *تسجيل مستخدم جديد في أكاديميتي*

👤 *الاسم:* ${userData.fullName}
📧 *البريد:* ${userData.email}
📱 *الهاتف:* ${userData.phone || 'غير محدد'}
⏰ *التاريخ:* ${new Date().toLocaleString('ar-SA')}
🆔 *User ID:* ${userData.uid}

---
✅ تم التسجيل بنجاح!
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            console.error('فشل إرسال الإشعار إلى تليجرام');
        } else {
            console.log('تم إرسال الإشعار إلى تليجرام بنجاح');
        }
    } catch (error) {
        console.error('خطأ في إرسال الإشعار:', error);
    }
}

// تصدير المتغيرات
window.auth = auth;
window.db = db;
window.sendTelegramNotification = sendTelegramNotification;
