"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var quicache_lib_1 = __importDefault(require("./quicache.lib"));
var chai_1 = require("chai");
require("mocha");
var CacheManagerFunctions = [
    "getAllCachedData",
    "getCacheData",
    "setCacheData",
    "cacheDataExists",
    "getCacheDataAge",
    "enableDebugLogs",
    "disableDebugLogs"
];
var myCache = new quicache_lib_1["default"]({
    cacheName: "cacheTest",
    cacheMaxAgeInSeconds: 120
});
var cacheDataToCompare = {
    aString: "aString"
};
describe("Check functions", function () {
    CacheManagerFunctions.map(function (entry) {
        it(entry + " property exists...", function () {
            chai_1.expect(myCache).to.have.property(entry);
        });
        it(entry + " is a function...", function () {
            chai_1.expect(myCache).to.have.property(entry).that.is.a('function');
        });
    });
    describe("Setting and getting data", function () {
        it("Can set some data on the cache which is returned with timestamp and data properties", function () {
            var X = myCache.setCacheData('test', cacheDataToCompare);
            chai_1.expect(X).to.have.property("timestamp");
            chai_1.expect(X).to.have.property("data");
        });
        it("Can tell us that data doesn't exist on the cache [ cacheDataExists('test_noexist') ]", function () {
            chai_1.expect(myCache.cacheDataExists('test_noexist')).to.equal(false);
        });
        it("Can tell us that data does exist on the cache [ cacheDataExists('test') ]", function () {
            chai_1.expect(myCache.cacheDataExists('test')).to.equal(true);
        });
        it("Can tell us the cache data age in a number format [ getCacheDataAge('test') ]", function () {
            var X = myCache.getCacheDataAge('test');
            chai_1.expect(X).to.be.a("number");
        });
        it("Can retrieve some data which returns a timestamp property [ getCacheData('test') ]", function () {
            chai_1.expect(myCache.getCacheData('test')).to.have.property("timestamp");
        });
        it("Can retrieve some data which returns a data property [ getCacheData('test') ]", function () {
            chai_1.expect(myCache.getCacheData('test')).to.have.property("data");
        });
    });
});
