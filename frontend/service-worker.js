const CACHE_NAME = "second-chance-v4";

const APP_SHELL = [
    // ==========================================
    // PUBLIC PAGES
    // ==========================================

    "./home.html",
    "./products.html",
    "./house.html",
    "./sell.html",
    "./cart.html",
    "./account.html",
    "./manifest.json",

    // ==========================================
    // CSS
    // ==========================================

    "./css/variables.css",
    "./css/home.css",
    "./css/skeleton.css",
    "./css/header.css",
    "./css/header-mobile.css",
    "./css/bottom-nav.css",

    "./css/products.css",
    "./css/product-mobile.css",

    "./css/product-modal.css",
    "./css/product-modal-mobile.css",

    "./css/cart.css",
    "./css/cart-mobile.css",

    "./css/houses.css",
    "./css/houses-mobile.css",
    "./css/house-header.css",
    "./css/house-mobile.css",
    "./css/house-modal.css",

    "./css/sell.css",
    "./css/sell-mobile.css",

    "./css/account.css",
    "./css/account-mobile.css",

    "./css/home-mobile.css",

    // ==========================================
    // JAVASCRIPT
    // ==========================================

    "./js/api.js",
    "./js/auth.js",
    "./js/header.js",
    "./js/footer.js",

    "./js/home.js",
    "./js/products.js",
    "./js/product-modal.js",

    "./js/houses.js",
    "./js/house-header.js",
    "./js/house-modal.js",

    "./js/sell.js",

    "./js/cart.js",
    "./js/cart-page.js",

    "./js/account.js",

    // ==========================================
    // SHARED COMPONENTS
    // ==========================================

    "./components/header.html",

    // ==========================================
    // PWA ICONS
    // ==========================================

    "./images/icon-192.png",
    "./images/icon-512.png"
];


self.addEventListener("install", (event) => {
    console.log("Second Chance Service Worker installing...");

    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            await Promise.all(
                APP_SHELL.map(async (url) => {
                    try {
                        await cache.add(url);
                    } catch (error) {
                        console.warn(
                            "Could not cache:",
                            url,
                            error
                        );
                    }
                })
            );
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Second Chance Service Worker activated");

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Only handle GET requests.
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Never cache API requests.
    if (url.pathname.startsWith("/api/")) {
        return;
    }

    // Never interfere with external services.
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then((networkResponse) => {
                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    networkResponse.type === "basic"
                ) {
                    const responseToCache =
                        networkResponse.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }

                return networkResponse;
            });
        })
    );
});