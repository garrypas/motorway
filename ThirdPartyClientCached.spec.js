const ThirdPartyClientCached = require("./ThirdPartyClientCached");
const sinon = require("sinon");
const { expect } = require("chai");

describe("ThirdPartyClientCached tests", function () {
    const PRICE_IN_CACHE = 999;
    const PRICE_AT_SERVICE = 111;
    const NUMBER_PLATE = "XYZ";

    let thirdPartyClientCached;
    let getStub;
    let getExternalPriceStub;

    beforeEach(() => {
        thirdPartyClientCached = new ThirdPartyClientCached();
        getStub = sinon.stub(thirdPartyClientCached.redisWrapper, "get").returns(PRICE_IN_CACHE);
        getExternalPriceStub = sinon.stub(thirdPartyClientCached.thirdPartyClient, "getExternalPrice").returns(PRICE_AT_SERVICE);
    });

    afterEach(() => {
        thirdPartyClientCached.thirdPartyClient.getExternalPrice.restore();
    });

    describe("Given the ability to read from a cache rather than calling an expensive service", function() {
        describe("When skipCacheForRead is false", () => {
            it("Attempts to retrieve from cache if skipCacheForRead is false", () => {
                thirdPartyClientCached.getExternalPrice(NUMBER_PLATE, false);
                sinon.assert.calledWith(getStub, NUMBER_PLATE);
            });

            it("Returns the price from the cache", async () => {
                const price = await thirdPartyClientCached.getExternalPrice(NUMBER_PLATE, false);
                expect(price).to.equal(PRICE_IN_CACHE);
            });
        });

        describe("When skipCacheForRead is true", () => {
            it("Skips read from cache if skipCacheForRead is true and goes to service", () => {
                thirdPartyClientCached.getExternalPrice(NUMBER_PLATE, true);
                sinon.assert.notCalled(getStub);
                sinon.assert.calledWith(getExternalPriceStub, NUMBER_PLATE);
            });

            it("Returns the price from the service", async () => {
                const price = await thirdPartyClientCached.getExternalPrice(NUMBER_PLATE, true);
                expect(price).to.equal(PRICE_AT_SERVICE);
            });
        });
    });
});