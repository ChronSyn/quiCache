"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const quicache_lib_1 = __importDefault(require("./quicache.lib"));
const chai_1 = require("chai");
require("mocha");
const CacheManagerFunctions = [
    "getAllCachedData",
    "getNonExpiredData",
    "getExpiredData",
    "getCacheData",
    "setCacheData",
    "cacheDataExists",
    "getCacheDataAge",
    "hasCacheExpired",
    "cacheDataIsValid",
    "setDebug",
    "enableDebugLogs",
    "disableDebugLogs"
];
const myCache = new quicache_lib_1.default();
const cacheDataToCompare = {
    aString: "aString"
};
describe("Check functions", () => {
    CacheManagerFunctions.map((entry) => {
        it(`${entry} property exists...`, () => {
            chai_1.expect(myCache).to.have.property(entry);
        });
        it(`${entry} is a function...`, () => {
            chai_1.expect(myCache).to.have.property(entry).that.is.a('function');
        });
    });
    describe("Setting and getting data", () => {
        it("Can set some data on the cache which is returned with timestamp and data properties", () => {
            chai_1.expect(myCache.setCacheData('test', cacheDataToCompare)).to.have.property("timestamp").and.to.have.property("data");
        });
        it("Can tell us that data doesn't exist on the cache", () => {
            chai_1.expect(myCache.cacheDataExists('test_noexist')).to.equal(false);
        });
        it("Can tell us that data does exist on the cache", () => {
            chai_1.expect(myCache.cacheDataExists('test')).to.equal(true);
        });
        it("Can tell us the cache data age in a number format", () => {
            chai_1.expect(myCache.getCacheDataAge('test')).to.be.a("number");
        });
        it("Can retrieve some data which returns a timestamp property", () => {
            chai_1.expect(myCache.getCacheData('test')).to.have.property("timestamp");
        });
        it("Can retrieve some data which returns a data property", () => {
            chai_1.expect(myCache.getCacheData('test')).to.have.property("data");
        });
    });
});
//# sourceMappingURL=quicache.lib.spec.js.map