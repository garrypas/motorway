const redis = require("redis");
const PENDING = "PENDING";
const POLLING_INTERVAL = 1000;
const MAX_TIME_TO_WAIT = 60000;

class RedisWrapper {
    constructor(baseUrl = process.env.REDIS_URL, port = process.env.REDIS_PORT, pollingInterval = POLLING_INTERVAL, maxTimeToWait = MAX_TIME_TO_WAIT) {
        this.baseUrl = baseUrl;
        this.port = port;
        this.pollingInterval = typeof pollingInterval === undefined ? POLLING_INTERVAL : pollingInterval;
        this.maxTimeToWait = typeof maxTimeToWait === undefined ? MAX_TIME_TO_WAIT : maxTimeToWait;
    }

    async get(key) {
        const redisClient = this.getClient();
        await redisClient.connect();
        let result = await redisClient.get(key);
        let timeWaited = 0;
        while(result === PENDING) {
            result = await new Promise(resolve => {
                redisClient.get(key).then(valueInCache => {
                    setTimeout(() => resolve(valueInCache), this.pollingInterval);
                    timeWaited += this.pollingInterval;
                });
            });
            if (timeWaited >= this.maxTimeToWait) {
                result = null;
            }
        }
        return result;
    }

    async set(key, value) {
        const client = this.getClient();
        await client.connect();
        await client.set(key, value);
    }

    getClient() {
        return redis.createClient({ url: `${this.baseUrl}:${this.port}` });
    }
}

module.exports = RedisWrapper;