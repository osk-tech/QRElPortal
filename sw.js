importScripts('./sw-config.js', './sw-strategies.js');

self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
            self.skipWaiting()
        ])
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE) {
                        return caches.delete(cacheName);
                    }
                    return undefined;
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_SCOPE_PATH)) {
        return;
    }

    if (url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.jpeg') ||
        url.pathname.endsWith('.webp') ||
        url.pathname.endsWith('.svg')) {
        event.respondWith(networkFirst(request, IMAGE_CACHE));
        return;
    }

    if (url.pathname.endsWith('.json') && !url.pathname.endsWith('manifest.json')) {
        event.respondWith(networkWithCacheFallback(request));
        return;
    }

    if (shouldUseNetworkFirst(request, url)) {
        event.respondWith(networkFirst(request, CACHE_NAME));
        return;
    }

    event.respondWith(cacheFirst(request));
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
