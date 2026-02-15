/**
 * MedFocus — Service Worker v4
 * Cache-first strategy for offline support + Push Notifications
 */
const CACHE_NAME = 'medfocus-v4';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/YRvaGtdlMcygSIGU.png',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (!url.origin.includes(self.location.origin) && !url.hostname.includes('fonts.googleapis.com') && !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.hostname.includes('fonts')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/');
        });
      })
  );
});

// ─── PUSH NOTIFICATIONS ────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'MedFocus', body: 'Hora de estudar!', icon: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png' };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png',
    badge: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png',
    vibrate: [100, 50, 100],
    data: { url: '/' },
    actions: [
      { action: 'study', title: 'Estudar Agora' },
      { action: 'later', title: 'Lembrar Depois' },
    ],
    tag: 'medfocus-reminder',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'later') {
    // Schedule another reminder in 30 minutes via message to client
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SNOOZE_REMINDER', delay: 30 });
        });
      })
    );
    return;
  }

  // Open or focus the app
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('/');
      }
    })
  );
});

// Handle periodic background sync (for study reminders)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'medfocus-study-reminder') {
    event.waitUntil(
      self.registration.showNotification('MedFocus — Lembrete de Estudo', {
        body: 'Mantenha seu streak ativo! Estude pelo menos 15 minutos hoje.',
        icon: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png',
        badge: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png',
        vibrate: [100, 50, 100],
        tag: 'medfocus-daily-reminder',
        actions: [
          { action: 'study', title: 'Estudar Agora' },
        ],
      })
    );
  }
});
