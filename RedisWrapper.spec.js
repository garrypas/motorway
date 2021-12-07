const { expect } = require("chai");
const redis = require("redis");
const sinon = require("sinon");
const RedisWrapper = require("./RedisWrapper");

describe("RedisWrapper tests", function () {
    let redisWrapper;
    beforeEach(function () {
        const data = {
            "testValue": "1234"
        };
        const redisStub = {
            connect: () => Promise.resolve(),
            get: async key => data[key],
            set: async (key, value) => data[key] = value
        };
        sinon.stub(redis, "createClient").returns(redisStub);
        redisWrapper = new RedisWrapper();
    });

    afterEach(() => {
        redis.createClient.restore();
    });

    it("Reads", async () => {
        const result = await redisWrapper.get("testValue");
        expect(result).to.equal("1234");
    });

    it("First read is pending then second read will wait for it to complete", async () => {
        await redisWrapper.set("testValueAsync", "PENDING");
        const getPromise = redisWrapper.get("testValueAsync");
        await redisWrapper.set("testValueAsync", "12345");
        const result = await getPromise;
        expect(result).to.equal("12345");
    });

    it("First read is pending, second read has a different key, they return distinct values (don't trip over one-another)", async () => {
        await Promise.all([
            redisWrapper.set("testValueAsync1", "v1"),
            redisWrapper.set("testValueAsync2", "v2")
        ]);

        const [ value1, value2 ] = await Promise.all([
            redisWrapper.get("testValueAsync1"),
            redisWrapper.get("testValueAsync2")
        ]);

        expect(value1).to.equal("v1");
        expect(value2).to.equal("v2");
    });
});
