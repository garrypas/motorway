const RedisWrapper = require("./RedisWrapper");
const ThirdPartyClient = require("./ThirdPartyClient");

class ThirdPartyClientCached {
    constructor() {
        this.thirdPartyClient = new ThirdPartyClient();
        this.redisWrapper = new RedisWrapper();
    }

    async getExternalPrice(numberPlate, skipCacheForRead) {
        if(!skipCacheForRead) {
            const cachedPrice = await this.redisWrapper.get(numberPlate);
            if(cachedPrice !== null) {
                return cachedPrice;
            }
        }
        return this.thirdPartyClient.getExternalPrice(numberPlate);
    }
}

module.exports = ThirdPartyClientCached;