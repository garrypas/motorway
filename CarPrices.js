const ThirdPartyClientCached = require("./ThirdPartyClientCached");

class CarPrices {
    constructor() {
        this.thirdPartyClient = new ThirdPartyClientCached();
    }

    async getPrice(numberPlate, skipCacheForRead = true) {
        return this.thirdPartyClient.getExternalPrice(numberPlate, skipCacheForRead);
    }
}

module.exports = CarPrices;