async function fetchFresh(request) {
    return fetch(new Request(request, { cache: 'no-store' }));
}

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        if (request.mode === 'navigate') {
            const fallbackResponse = await caches.match(APP_SCOPE_URL.href);
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

async function networkFirst(request, cacheName = CACHE_NAME) {
    try {
        const networkResponse = await fetchFresh(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        if (request.mode === 'navigate') {
            const fallbackResponse = await caches.match(APP_SCOPE_URL.href) ||
                await caches.match(new URL('index.html', APP_SCOPE_URL).href);
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

async function networkWithCacheFallback(request) {
    try {
        const networkResponse = await fetchFresh(request);
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Offline', { status: 503 });
    }
}

function shouldUseNetworkFirst(request, url) {
    return request.mode === 'navigate' ||
        url.pathname.endsWith('.html') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.webmanifest') ||
        url.pathname.endsWith('manifest.json');
}
