// service-worker.js
const CACHE_NAME = 'bolt-ai-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/platform.html',
  '/platform.js',
  '/platform.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/editor/editor.main.min.css'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Service Worker: تثبيت التخزين المؤقت');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Service Worker: مسح التخزين المؤقت القديم');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', event => {
  // استثناءات: Monaco Editor والـ APIs
  const url = new URL(event.request.url);
  if (url.pathname.includes('/vs/') || 
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('openai.com') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد في التخزين المؤقت
        if (response) {
          return response;
        }

        // جلب من الشبكة
        return fetch(event.request)
          .then(response => {
            // تحقق من أن الرد صالح للتخزين
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // استنساخ الرد للتخزين
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // في حالة عدم الاتصال، عرض صفحة بديلة
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// استقبال الرسائل من الصفحة
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// تحديث التطبيق في الخلفية
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  for (const url of urlsToCache) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.log(`فشل تحديث: ${url}`, error);
    }
  }
}