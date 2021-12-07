const expect = require("chai").expect;
const App = require("./App");
const sinon = require("sinon");
const request = require("supertest");
const CarPrices = require("./CarPrices");

describe("App tests", function () {
    const NUMBER_PLATE = "PX 123";
    const GET_PRICE_VALID_URI = `/price?numberPlate=${NUMBER_PLATE}`;
    const GET_PRICE_INVALID_URI = `/price?numberOopsPlate=${NUMBER_PLATE}`;
    const PRICE = 10000.01;
    let server, app;

    before(() => {
        ({ server, app } =  App(8081));
    });

    after(() => {
        server.close();
    });

    describe("2xx responses", () => {
        beforeEach(() => {
            sinon.stub(CarPrices.prototype, "getPrice").returns(Promise.resolve(PRICE));
        });
    
        afterEach(() => {
            CarPrices.prototype.getPrice.restore();
        });
        it("GET price - 200 when number plate is valid", done => {
            request(app)
                .get(GET_PRICE_VALID_URI)
                .expect(200)
                .end(done);
        });
        it("GET price - returns price in response body", done => {
            request(app)
                .get(GET_PRICE_VALID_URI)
                .end((_, response) => {
                    expect(response.body.price).to.equal(PRICE).and.not.to.be.undefined;
                    done();
                });
        });
    });

    describe("5xx responses", () => {
        beforeEach(() => {
            sinon.stub(CarPrices.prototype, "getPrice").throws();
        });
    
        afterEach(() => {
            CarPrices.prototype.getPrice.restore();
        });
        it("GET price - 500 when internal error", done => {
            request(app)
                .get(GET_PRICE_VALID_URI)
                .expect(500)
                .end(done);
        });
    });

    describe("4xx responses", () => {
        it("GET price - 400 when number plate is missing", done => {
            request(app)
                .get(GET_PRICE_INVALID_URI)
                .expect(400)
                .end(done);
        });
    });
});