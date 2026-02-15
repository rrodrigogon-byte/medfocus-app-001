/**
 * MedFocus — Service Worker v5
 * Enhanced offline support: caches flashcards, quizzes, study materials
 * + Push Notifications + Background Sync
 */
const CACHE_NAME = 'medfocus-v5';
const STUDY_CACHE = 'medfocus-study-v1';
const API_CACHE = 'medfocus-api-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/YRvaGtdlMcygSIGU.png',
];

// ─── INSTALL ────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ─── ACTIVATE ────────────────────────────────────
self.addEventListener('activate', (event) => {
  const validCaches = [CACHE_NAME, STUDY_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => !validCaches.includes(key)).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ─── FETCH ────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Handle tRPC API calls (for offline study data)
  if (url.pathname.startsWith('/api/trpc/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Skip non-same-origin requests (except fonts and CDN assets)
  if (!url.origin.includes(self.location.origin) && 
      !url.hostname.includes('fonts.googleapis.com') && 
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('manuscdn.com')) {
    return;
  }

  // Cache-first for static assets (CSS, JS, fonts, images)
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
    url.hostname.includes('fonts') ||
    url.hostname.includes('manuscdn.com')
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

  // Network-first for HTML pages
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

// ─── API REQUEST HANDLER (Offline-capable) ────────────────
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const batchParam = url.searchParams.get('batch');
  const inputParam = url.searchParams.get('input');
  
  // Determine if this is a cacheable study-related request
  const isCacheable = isStudyRelatedRequest(url);

  try {
    const response = await fetch(request);
    if (response.ok && isCacheable) {
      const clone = response.clone();
      const cache = await caches.open(API_CACHE);
      await cache.put(request, clone);
    }
    return response;
  } catch (error) {
    // Offline: try to serve from cache
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return offline-friendly error
    return new Response(
      JSON.stringify([{
        result: {
          data: { json: null },
          error: {
            message: 'Você está offline. Dados em cache não disponíveis para esta requisição.',
            code: -1,
          }
        }
      }]),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Check if the tRPC request is study-related and should be cached
function isStudyRelatedRequest(url) {
  const pathname = url.pathname;
  const cacheableRoutes = [
    'progress.get',
    'progress.history',
    'classroom.myClassrooms',
    'classroom.activities',
    'ai.generateQuiz',
    'ai.generateFlashcards',
    'ai.generateMindMap',
    'ai.generateSummary',
    'ai.generateContent',
    'stripe.getPlans',
  ];
  return cacheableRoutes.some(route => pathname.includes(route));
}

// ─── MESSAGE HANDLER (Save study data for offline) ────────────────
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  if (type === 'CACHE_STUDY_DATA') {
    // Client sends study data to be cached for offline use
    event.waitUntil(cacheStudyData(data));
  }

  if (type === 'CLEAR_STUDY_CACHE') {
    event.waitUntil(caches.delete(STUDY_CACHE));
  }

  if (type === 'GET_CACHE_STATUS') {
    event.waitUntil(
      getCacheStatus().then((status) => {
        event.source.postMessage({ type: 'CACHE_STATUS', data: status });
      })
    );
  }
});

async function cacheStudyData(data) {
  const cache = await caches.open(STUDY_CACHE);
  const { key, content } = data;
  const response = new Response(JSON.stringify(content), {
    headers: { 'Content-Type': 'application/json', 'X-Cached-At': new Date().toISOString() },
  });
  await cache.put(new Request(`/offline-study/${key}`), response);
}

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const sizes = {};
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    sizes[name] = keys.length;
  }
  return { caches: sizes, online: self.navigator?.onLine ?? true };
}

// ─── BACKGROUND SYNC (Queue offline submissions) ────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-study-progress') {
    event.waitUntil(syncStudyProgress());
  }
  if (event.tag === 'sync-quiz-submissions') {
    event.waitUntil(syncQuizSubmissions());
  }
});

async function syncStudyProgress() {
  const cache = await caches.open(STUDY_CACHE);
  const keys = await cache.keys();
  const pendingSync = keys.filter(k => k.url.includes('/offline-study/pending-'));
  
  for (const request of pendingSync) {
    try {
      const cached = await cache.match(request);
      if (!cached) continue;
      const data = await cached.json();
      
      // Try to sync with server
      const response = await fetch('/api/trpc/progress.addXp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (response.ok) {
        await cache.delete(request);
      }
    } catch (e) {
      // Will retry on next sync
      console.log('[SW] Sync failed, will retry:', e.message);
    }
  }
}

async function syncQuizSubmissions() {
  const cache = await caches.open(STUDY_CACHE);
  const keys = await cache.keys();
  const pendingQuiz = keys.filter(k => k.url.includes('/offline-study/quiz-submission-'));
  
  for (const request of pendingQuiz) {
    try {
      const cached = await cache.match(request);
      if (!cached) continue;
      const data = await cached.json();
      
      const response = await fetch('/api/trpc/classroom.submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (response.ok) {
        await cache.delete(request);
      }
    } catch (e) {
      console.log('[SW] Quiz sync failed, will retry:', e.message);
    }
  }
}

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
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SNOOZE_REMINDER', delay: 30 });
        });
      })
    );
    return;
  }

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

// Handle periodic background sync
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
