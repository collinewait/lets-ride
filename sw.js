const rideCacheName = 'ride-cache-v2';

const ursToCatch = [
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

});
