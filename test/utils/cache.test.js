const cache = require("../../src/utils/cache");

describe("cache utility tests", () => {

    beforeEach(() => {
        cache.flushAll();
    });

    test("should set and get value", () => {
        cache.set("key", "value");

        const result = cache.get("key");

        expect(result).toBe("value");
    });

    test("should return undefined for missing key", () => {
        const result = cache.get("missing");

        expect(result).toBeUndefined();
    });

    test("should check if key exists", () => {
        cache.set("key", "value");

        const exists = cache.has("key");

        expect(exists).toBe(true);
    });

    test("should delete key", () => {
        cache.set("key", "value");

        cache.del("key");

        expect(cache.get("key")).toBeUndefined();
    });

    test("should flush all keys", () => {
        cache.set("k1", "v1");
        cache.set("k2", "v2");

        cache.flushAll();

        expect(cache.get("k1")).toBeUndefined();
        expect(cache.get("k2")).toBeUndefined();
    });

});