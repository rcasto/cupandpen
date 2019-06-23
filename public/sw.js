const cacheVersion = 1;
const cacheName = `cupandpen-${cacheVersion}`;
const urlsToCache = [
  '/',
  'styles/style.css'
];
const networkTimeoutInMs = 5000;

// On install, cache some resource.
self.addEventListener('install', function (evt) {
  console.log('The service worker is being installed.');

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function (evt) {
  console.log('The service worker is serving the asset.');
  // Try network and if it fails, go for the cached copy.
  evt.respondWith(fromNetwork(evt.request, networkTimeoutInMs)
    .catch(function () {
      return fromCache(evt.request);
    }));
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(cacheName)
    .then(function (cache) {
      return cache.addAll(urlsToCache);
    });
}

function update(request) {
  return caches.open(cacheName)
    .then(function (cache) {
      return fetch(request)
        .then(function (response) {
          return cache.put(request, response.clone())
            .then(function () {
              return response;
            });
        });
    });
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, networkTimeoutInMs) {
  return new Promise(function (fulfill, reject) {
    // Reject in case of timeout.
    var timeoutId = setTimeout(reject, networkTimeoutInMs);
    // Fulfill in case of success.
    update(request)
      .then(function (response) {
        clearTimeout(timeoutId);
        fulfill(response);
        // Reject also if network fetch rejects.
      }, reject);
  });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(cacheName)
    .then(function (cache) {
      return cache.match(request)
        .then(function (matching) {
          return matching || Promise.reject('no-match');
        });
    });
}