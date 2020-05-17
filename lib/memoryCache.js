const NodeCache = require("node-cache");
const { logCache } = require('./logger');

function MemoryCache(expirationTimeInSeconds) {
    this.cache = new NodeCache({
        stdTTL: expirationTimeInSeconds
    });

    this.cache.on('set', (key, value) => {
        logCache(`Caching: ${key}`);
    });
    this.cache.on('expired', (key, value) => {
        logCache(`Cache expire: ${key}`);
    });
}

MemoryCache.prototype.add = function (key, value) {
    return this.cache.set(key, value);
};

MemoryCache.prototype.get = function (key) {
    const cacheEntry = this.cache.get(key);

    if (!cacheEntry) {
        logCache(`Cache miss`);
        return null;
    }

    logCache(`Cache hit`);

    return cacheEntry;
};

module.exports = MemoryCache;