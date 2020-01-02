function MemoryCache(expirtationTimeInMs, maxAmountOfEntries) {
    this.expirtationTimeInMs = expirtationTimeInMs;
    this.maxAmountOfEntries = maxAmountOfEntries;
    this.cache = {};
}

MemoryCache.prototype.add = function (key, value) {
    this.cache[key] = {
        value,
        timestamp: Date.now(),
    };
};

MemoryCache.prototype.get = function (key) {
    const cacheEntry = this.cache[key];

    if (!cacheEntry) {
        return null;
    }

    if (Date.now() - cacheEntry.timestamp >= this.expirtationTimeInMs) {
        this.cache[key] = null; // clear entry in cache, it's expired
        return null;
    }

    return cacheEntry.value;
};

module.exports = MemoryCache;