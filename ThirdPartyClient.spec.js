const ThirdPartyClient = require("./ThirdPartyClient");
const sinon = require("sinon");
const { expect } = require("chai");
const axios = require("axios");

describe("ThirdPartyClient tests", function () {
    const PRICE = "123.4";

    let thirdPartyClient;
    beforeEach(() => { 
        thirdPartyClient = new ThirdPartyClient("http://localhost", 80);
        sinon.stub(axios, "get").withArgs("http://localhost:80/external-price?numberPlate=PX 123").resolves({ data: { price: PRICE } });
    });

    afterEach(() => {
        axios.get.restore();
    })

    it("Given a number plate that is found then returns price", async () => {
        const price = await thirdPartyClient.getExternalPrice("PX 123");
        expect(price).to.equal(PRICE);
    });

    it("Given an invalid number plate then return null", async () => {
        const price = await thirdPartyClient.getExternalPrice("PX 666");
        expect(price).to.be.null;
    });
});