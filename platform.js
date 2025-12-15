// في class AIDevPlatform - أضف هذه الدوال:

registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('✅ Service Worker مسجل:', registration.scope);
                    
                    // تحديث التطبيق عند توفر نسخة جديدة
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateAvailable();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('❌ فشل تسجيل Service Worker:', error);
                });
        });
        
        // الاستماع للرسائل من Service Worker
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.action === 'reload') {
                window.location.reload();
            }
        });
    }
}

showUpdateAvailable() {
    const updateDiv = document.createElement('div');
    updateDiv.className = 'update-banner';
    updateDiv.innerHTML = `
        <div class="update-content">
            <i class="fas fa-sync-alt"></i>
            <span>تحديث جديد متوفر!</span>
            <button onclick="platform.updateApp()">تحديث الآن</button>
            <button onclick="this.parentElement.parentElement.remove()">لاحقاً</button>
        </div>
    `;
    
    document.body.appendChild(updateDiv);
}

updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.waiting.postMessage({ action: 'skipWaiting' });
        });
    }
}

checkInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // منع المتصفح من عرض الرسالة تلقائياً
        e.preventDefault();
        deferredPrompt = e;
        
        // عرض زر التثبيت الخاص بنا
        this.showInstallButton();
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('✅ تم تثبيت التطبيق');
        deferredPrompt = null;
        this.showNotification('🎉 تم تثبيت Bolt AI بنجاح!');
    });
}

showInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.className = 'install-promotion';
    installBtn.innerHTML = `
        <i class="fas fa-download"></i>
        <span>تثبيت التطبيق</span>
    `;
    
    installBtn.addEventListener('click', async () => {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ وافق المستخدم على التثبيت');
            }
            
            window.deferredPrompt = null;
            installBtn.remove();
        }
    });
    
    // أضف الزر في مكان مناسب
    const headerControls = document.querySelector('.header-controls');
    if (headerControls) {
        headerControls.appendChild(installBtn);
    }
}

checkNetworkStatus() {
    window.addEventListener('online', () => {
        this.showNotification('🌐 تم استعادة الاتصال بالإنترنت');
        document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', () => {
        this.showNotification('⚠️ فقدت الاتصال بالإنترنت');
        document.body.classList.add('offline');
    });
    
    // التحقق الأولي
    if (!navigator.onLine) {
        document.body.classList.add('offline');
    }
}

// في الدالة init() أضف:
init() {
    this.registerServiceWorker();
    this.checkInstallPrompt();
    this.checkNetworkStatus();
    // ... باقي التهيئة
}