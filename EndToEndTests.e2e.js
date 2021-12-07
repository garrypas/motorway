const createClient = require("redis").createClient;
const axios = require('axios');
const { expect } = require("chai");

const PORT = 8080;
const EXTERNAL_SERVICE_PORT = 4545;
const MOUNTEBANK_URL = "http://localhost";
const MOUNTEBANK_PORT = 2525;
const BASE_URI = `http://localhost:${PORT}`;

describe("End-to-end tests", function () {
    const NUMBER_PLATE = "PX 123";
    const PRICE_AT_EXTERNAL_SERVICE = "123.45";

    const priceStub = {
        "protocol": "http",
        "port": EXTERNAL_SERVICE_PORT,
        "numberOfRequests": 0,
        "recordRequests": false,
          "predicates": [
            {
              "equals": {
                "method": "GET",
                "path": "/external-price?numberPlate=PX 123"
              }
            }
          ],
        "stubs": [{
         "responses": [{
              "is": {
                "statusCode": 200,
                "headers": {
                  "Content-Type": "application/json"
                },
                "body": {
                      "price": PRICE_AT_EXTERNAL_SERVICE
                  }
              }      
          }]
        }]
      };

    before(async () => {
        await axios.post(`${MOUNTEBANK_URL}:${MOUNTEBANK_PORT}/imposters`, priceStub);
    });

    after(async () => {
      await axios.delete(`${MOUNTEBANK_URL}:${MOUNTEBANK_PORT}/imposters/${EXTERNAL_SERVICE_PORT}`)
    })

    describe("Given a number exists in the cache", () => {
        const PRICE_IN_CACHE = "100010.0";

        let client;
        beforeEach(async () => {
            client = createClient();
            await client.connect();
            client.del(NUMBER_PLATE);
        });

        afterEach(() => {
          client.disconnect();
        });

        it("Read the number plate from the cache", async () => {
            let response = await axios.get(`${BASE_URI}/price?numberPlate=${NUMBER_PLATE}`);
            let price = response.data.price;
            expect(price).to.equal(PRICE_AT_EXTERNAL_SERVICE);

            await client.set(NUMBER_PLATE, PRICE_IN_CACHE);
            response = await axios.get(`${BASE_URI}/price?numberPlate=${NUMBER_PLATE}`);
            price = response.data.price;
            expect(price).to.equal(PRICE_IN_CACHE);
        });
    });
});
