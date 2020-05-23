const NodeCache = require("node-cache");
const { logCache } = require('./logger');

function MemoryCache(expirationTimeInSeconds) {
    this.cache = new NodeCache({
        stdTTL: expirationTimeInSeconds
    });

    this.cache.on('expired', (key, value) => {
        logCache(`Cache key expired: ${key}`);
    });
}

MemoryCache.prototype.add = function (key, value) {
    return this.cache.set(key, value);
};

MemoryCache.prototype.get = function (key) {
    const cacheEntry = this.cache.get(key);

    if (!cacheEntry) {
        logCache(`Cache miss, now caching: ${key}`);
        return null;
    }

    logCache(`Cache hit for key: ${key}`);

    return cacheEntry;
};

module.exports = MemoryCache;