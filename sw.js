const rideCacheName = 'ride-cache-v1';

const ursToCatch = [
    './index.html',
    './login.html',
    './signup.html',
    'js/all_rides.js',
    'js/cookie_file.js',
    'js/dialogs.js',
    'js/login.js',
    'js/main.js',
    'js/reusable.js',
    'js/ride.js',
    'js/user.js',
    'css/main.css',
    'css/responsive.css',
    'images/bicycle-ride.png',
    'images/icons/icon-72x72.png'
];

self.addEventListener('install', (event) => {
 

    event.waitUntil(
        caches.open(rideCacheName).then((cache) => {
            return cache.addAll(ursToCatch);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName.startsWith('ride-') && 
                        cacheName !== rideCacheName;
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
/*
self.addEventListener('fetch', event => {

    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request)
                .then(response => caches.open(rideCacheName)
                    .then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                )
            )
    );

});*/

self.addEventListener('fetch', event => {

    event.respondWith(
        fetch(event.request)
            .then(response => caches.open(rideCacheName)
                .then(cache => {
                    cache.put(event.request, response.clone());
                    return response || caches.match(event.request);
                })
            )
    );

});
