const NodeCache = require( "node-cache" );

function MemoryCache(expirationTimeInSeconds) {
    this.cache = new NodeCache({
        stdTTL: expirationTimeInSeconds
    });

    this.cache.on('set', (key, value) => {
        console.log(`Caching ${key}`);
    });
    this.cache.on('del', (key, value) => {
        console.log(`${key} has expired and has been deleted from cache`);
    });
}

MemoryCache.prototype.add = function (key, value) {
    this.cache.set(key, value);
};

MemoryCache.prototype.get = function (key) {
    const cacheEntry = this.cache.get(key);

    if (!cacheEntry) {
        return null;
    }

    return cacheEntry;
};

module.exports = MemoryCache;