const CACHE_VERSION = 'v8';
const CACHE_NAME = `portal-menu-${CACHE_VERSION}`;
const IMAGE_CACHE = `portal-images-${CACHE_VERSION}`;
const APP_SCOPE_URL = new URL(self.registration.scope);
const APP_SCOPE_PATH = APP_SCOPE_URL.pathname;
const ASSETS_TO_CACHE = [
    APP_SCOPE_URL.href,
    new URL('index.html', APP_SCOPE_URL).href,
    new URL('styles.css', APP_SCOPE_URL).href,
    new URL('script.js', APP_SCOPE_URL).href,
    new URL('manifest.json', APP_SCOPE_URL).href,
    new URL('branding/logoportal.webp', APP_SCOPE_URL).href
];
