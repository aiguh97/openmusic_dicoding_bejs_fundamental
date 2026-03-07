const redis = require('redis');

// CacheService is a service that will be used to store data in Redis
class CacheService {
    constructor() {
        this._client = redis.createClient({
            socket: {
                host: process.env.REDIS_SERVER,
            },
        });

        this._client.on('error', (error) => {
            console.error(error);
        });

        this._client.connect();
    }

    // set inserts data to with default expiration time of 1 hour (3600 seconds)
    async set(key, value, expirationInSecond = 3600) {
        await this._client.set(key, value, {
            EX: expirationInSecond,
        });
    }

    // get retrieves data from Redis
    async get(key) {
        const result = await this._client.get(key);
        if (result === null) throw new Error('Cache tidak ditemukan');
        return result;
    }

    // delete deletes data from Redis
    delete(key) {
        return this._client.del(key);
    }
}

module.exports = CacheService;
