const cacheName = "HealthyFoodGreen";

const cacheAssets = [
    'index.html',
    'assets/css/main.css',
    'assets/css/bootstrap.min.css.map',
    'assets/css/bootstrap.min.css',
    'assets/css/bootstrap.css.map',
    'assets/JS/bootstrap.min.js',
    'assets/JS/bootstrap.min.js.map'

];

/* Call install Event */

self.addEventListener("install", (e) => {
    console.log("Service worker : installed");
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log("Service Worker: Caching Files");
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())


    )
})


//Active event 

self.addEventListener("activate", (e) => {
    console.log("Service worker : Activated ")

    //Remove Unwanted caches
    e.waitUntil(
        caches.keys().then(cacheName => {
            return Promise.all(
                cacheName.map(cache => {
                    if (cache != cacheName) {
                        console.log("Service worker : Clear old cache");
                        return caches.delete(cache);
                    }
                })
            )
        })
    )

})

//Call Fetch Event 

self.addEventListener('fetch', e => {
    console.log("Service Worker : Fetching");
    e.respondWith(
        fetch(e.request)
            .then(res => {
                //Make copy of clone
                const resClone = res.clone();
                // Open Cache
                caches.open(cacheName)
                    .then(cache => {
                        //Add Response to cache
                        cache.put(e.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(e.request).then(res => res) ) 
    );
})
