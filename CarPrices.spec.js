const expect = require("chai").expect;
const CarPrices = require("./CarPrices");
const sinon = require("sinon");

describe("CarPrices tests", function () {
    let carPrices;
    beforeEach(() => {
        carPrices = new CarPrices();
        sinon.stub(carPrices.thirdPartyClient, "getExternalPrice").returns(100000.00);
    });

    afterEach(() => {
        carPrices.thirdPartyClient.getExternalPrice.restore();
    })

    describe("Given a valid number plate", () => {
        it("Should return price when number plate is valid", async () => {
            const price = await carPrices.getPrice("P120 123", true);
            expect(price).to.equal(price);
        });
    });
});