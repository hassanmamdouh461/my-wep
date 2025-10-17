// ================================
// نسخة تجريبية - بدون Firebase
// ================================
// هذا الملف للتجربة فقط! البيانات لن تُحفظ
// لاستخدام النظام الحقيقي، عدّل firebase-config.js

// دوال مساعدة
function showMessage(text, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function setupPasswordToggle(toggleBtnId, passwordInputId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const passwordInput = document.getElementById(passwordInputId);
    
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = toggleBtn.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.classList.remove('loading');
    }
}

// تخزين محلي بسيط
const USERS_KEY = 'demo_users';

function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUser(userData) {
    const users = getUsers();
    users.push(userData);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(email) {
    const users = getUsers();
    return users.find(u => u.email === email);
}

function setCurrentUser(userData) {
    localStorage.setItem('current_user', JSON.stringify(userData));
}

function getCurrentUser() {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('current_user');
}

// ================================
// صفحة التسجيل
// ================================

if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // التحقق
        if (!fullName || fullName.length < 3) {
            showMessage('الرجاء إدخال اسم صحيح (3 أحرف على الأقل)', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('كلمة المرور غير متطابقة', 'error');
            return;
        }
        
        if (!terms) {
            showMessage('يجب الموافقة على الشروط والأحكام', 'error');
            return;
        }
        
        // التحقق من وجود المستخدم
        if (findUser(email)) {
            showMessage('البريد الإلكتروني مستخدم بالفعل', 'error');
            return;
        }
        
        setButtonLoading(registerBtn, true);
        
        // محاكاة التأخير
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
            uid: 'user_' + Date.now(),
            fullName: fullName,
            email: email,
            phone: phone,
            createdAt: new Date().toISOString()
        };
        
        saveUser(userData);
        setCurrentUser(userData);
        
        showMessage('✅ تم إنشاء الحساب بنجاح! (نسخة تجريبية)', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        setButtonLoading(registerBtn, false);
    });
    
    // زر Google (تجريبي)
    const googleRegisterBtn = document.getElementById('googleRegisterBtn');
    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', () => {
            showMessage('التسجيل عبر Google يتطلب إعداد Firebase', 'info');
        });
    }
}

// ================================
// صفحة تسجيل الدخول
// ================================

if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    setupPasswordToggle('togglePassword', 'password');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showMessage('الرجاء إدخال البريد الإلكتروني وكلمة المرور', 'error');
            return;
        }
        
        setButtonLoading(loginBtn, true);
        
        // محاكاة التأخير
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = findUser(email);
        
        if (!user) {
            showMessage('المستخدم غير موجود', 'error');
            setButtonLoading(loginBtn, false);
            return;
        }
        
        // في النسخة التجريبية، نقبل أي كلمة مرور للمستخدم الموجود
        setCurrentUser(user);
        
        showMessage('✅ تم تسجيل الدخول بنجاح! (نسخة تجريبية)', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        setButtonLoading(loginBtn, false);
    });
    
    // زر Google (تجريبي)
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            showMessage('تسجيل الدخول عبر Google يتطلب إعداد Firebase', 'info');
        });
    }
}

// ================================
// تحديث أزرار التنقل
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    const navButtons = document.querySelector('.nav-buttons');
    
    if (navButtons && user) {
        navButtons.innerHTML = `
            <div class="user-menu" style="display: flex; align-items: center; gap: 1rem;">
                <span class="user-name" style="color: var(--text-color);">${user.fullName}</span>
                <button class="btn btn-outline" id="logoutBtn">تسجيل الخروج</button>
            </div>
        `;
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                logout();
                window.location.reload();
            });
        }
    }
});

console.log('🔶 تعمل في وضع التجربة - للنظام الحقيقي، عدّل firebase-config.js');
