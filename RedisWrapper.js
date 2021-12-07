const redis = require("redis");
const PENDING = "PENDING";
const POLLING_INTERVAL = 1000;
const MAX_TIME_TO_WAIT = 60000;

class RedisWrapper {
    constructor(baseUrl = process.env.REDIS_URL, port = process.env.REDIS_PORT) {
        this.baseUrl = baseUrl;
        this.port = port;
    }

    async get(key) {
        const redisClient = this.getClient();
        await redisClient.connect();
        let result = await redisClient.get(key);
        let timeWaited = 0;
        while(result === PENDING) {
            result = await new Promise(resolve => {
                redisClient.get(key).then(valueInCache => {
                    setTimeout(() => resolve(valueInCache), POLLING_INTERVAL);
                    timeWaited += POLLING_INTERVAL;
                });
            })
            if (timeWaited >= MAX_TIME_TO_WAIT) {
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