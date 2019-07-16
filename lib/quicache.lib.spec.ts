import cache, { ICacheManager, ICacheManagerDataCache } from "./quicache.lib";
import { assert, expect } from "chai";
import "mocha";

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

const myCache = new cache();
const cacheDataToCompare = {
  aString: "aString"
};

describe("Check functions", ()=> {
  CacheManagerFunctions.map((entry: string)=>{
    it(`${entry} property exists...`, ()=>{
      expect(myCache).to.have.property(entry);
    });

    it(`${entry} is a function...`, ()=>{
      expect(myCache).to.have.property(entry).that.is.a('function');
    });
  });

  describe("Setting and getting data", () => {
    it("Can set some data on the cache which is returned with timestamp and data properties", () => {
      expect(myCache.setCacheData('test', cacheDataToCompare)).to.have.property("timestamp").and.to.have.property("data");
    });

    it("Can tell us that data doesn't exist on the cache", () => {
      expect(myCache.cacheDataExists('test_noexist')).to.equal(false)
    });

    it("Can tell us that data does exist on the cache", () => {
      expect(myCache.cacheDataExists('test')).to.equal(true)
    });

    it("Can tell us the cache data age in a number format", () => {
      expect(myCache.getCacheDataAge('test')).to.be.a("number")
    });

    it("Can retrieve some data which returns a timestamp property", () => {
      expect(myCache.getCacheData('test')).to.have.property("timestamp")
    });

    it("Can retrieve some data which returns a data property", () => {
      expect(myCache.getCacheData('test')).to.have.property("data")
    });
  })

})