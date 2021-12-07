const axios = require("axios");

class ThirdPartyClient {
    constructor(baseUrl = process.env.THIRD_PARTY_URL, port = process.env.THIRD_PARTY_PORT) {
        this.baseUrl = baseUrl;
        this.port = port;
    }

    async getExternalPrice(numberPlate) {
        const response =  await axios.get(`${this.baseUrl}:${this.port}/external-price?numberPlate=${numberPlate}`);
        return response && response.data && response.data.price || null;
    }
}

module.exports = ThirdPartyClient;