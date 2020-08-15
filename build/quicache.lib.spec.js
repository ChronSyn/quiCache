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
    "setCacheMaxAge",
    "setCacheName",
    "getCacheData",
    "setCacheData",
    "deleteCacheData",
    "cacheDataExists",
    "getCacheDataAge",
    "getCacheSize",
    "getCacheName"
];
var defaultCacheName = "cacheTest";
var defaultCacheMaxAge = 120;
var myCache = new quicache_lib_1["default"]({
    cacheName: defaultCacheName,
    cacheMaxAgeInSeconds: defaultCacheMaxAge
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
        it("Can use a number as a key on cache data", function () {
            var X = myCache.setCacheData(123456, cacheDataToCompare);
            chai_1.expect(X).to.have.property("timestamp");
            chai_1.expect(X).to.have.property("data");
        });
        it("Can use NaN as a key on cache data", function () {
            var X = myCache.setCacheData(NaN, cacheDataToCompare);
            chai_1.expect(X).to.have.property("timestamp");
            chai_1.expect(X).to.have.property("data");
        });
        it("Can use number with numeric separater as a key on cache data", function () {
            var X = myCache.setCacheData(123500999, cacheDataToCompare);
            chai_1.expect(X).to.have.property("timestamp");
            chai_1.expect(X).to.have.property("data");
        });
        it("Can get all cache data", function () {
            var Y = myCache.getAllCachedData();
            chai_1.expect(Object.keys(Y)).to.contain.members(["test", "123456", "NaN", "123500999"]);
            chai_1.expect(Y["test"]).to.have.property("timestamp");
            chai_1.expect(Y["test"]).to.have.property("data");
            chai_1.expect(Y[123456]).to.have.property("timestamp");
            chai_1.expect(Y[123456]).to.have.property("data");
            chai_1.expect(Y[NaN]).to.have.property("timestamp");
            chai_1.expect(Y[NaN]).to.have.property("data");
            chai_1.expect(Y[123500999]).to.have.property("timestamp");
            chai_1.expect(Y[123500999]).to.have.property("data");
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
        it("Can delete an entry from the cache [ deleteCacheData('test') ===> getCacheData('test') ]", function () {
            var X = myCache.deleteCacheData('test');
            chai_1.expect(X).to.have.property("timestamp");
            chai_1.expect(X).to.have.property("data");
            var cacheGetShouldFail = myCache.getCacheData('test');
            chai_1.expect(cacheGetShouldFail).to.be["null"];
        });
        it("Can get the cache name [ getCacheName() ]", function () {
            chai_1.expect(myCache.getCacheName()).to.equal(defaultCacheName);
        });
        it("Can get the cache max age [ getCacheMaxAge() ]", function () {
            chai_1.expect(myCache.getCacheMaxAge()).to.equal(defaultCacheMaxAge);
        });
        it("Can set the cache name [setCacheName('test_updated') ==> getCacheName()]", function () {
            myCache.setCacheName(defaultCacheName + "_updated");
            chai_1.expect(myCache.getCacheName()).to.equal(defaultCacheName + "_updated");
        });
        it("Can set the cache max age [setCacheNameAge(15) ===> getCacheMaxAge()]", function () {
            myCache.setCacheMaxAge(15);
            chai_1.expect(myCache.getCacheMaxAge()).to.equal(15);
        });
    });
});
