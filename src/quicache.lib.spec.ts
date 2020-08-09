import cache, { ICacheManager, ICacheManagerDataCache } from "./quicache.lib";
import { assert, expect } from "chai";
import "mocha";

const CacheManagerFunctions = [
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

const defaultCacheName = "cacheTest";
const defaultCacheMaxAge = 120;
const myCache = new cache({
  cacheName: defaultCacheName,
  cacheMaxAgeInSeconds: defaultCacheMaxAge
});
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
      const X = myCache.setCacheData('test', cacheDataToCompare);
      expect(X).to.have.property("timestamp");
      expect(X).to.have.property("data");
    });

    it("Can tell us that data doesn't exist on the cache [ cacheDataExists('test_noexist') ]", () => {
      expect(myCache.cacheDataExists('test_noexist')).to.equal(false)
    });

    it("Can tell us that data does exist on the cache [ cacheDataExists('test') ]", () => {
      expect(myCache.cacheDataExists('test')).to.equal(true)
    });

    it("Can tell us the cache data age in a number format [ getCacheDataAge('test') ]", () => {
      const X = myCache.getCacheDataAge('test');
      expect(X).to.be.a("number")
    });

    it("Can retrieve some data which returns a timestamp property [ getCacheData('test') ]", () => {
      expect(myCache.getCacheData('test')).to.have.property("timestamp")
    });

    it("Can retrieve some data which returns a data property [ getCacheData('test') ]", () => {
      expect(myCache.getCacheData('test')).to.have.property("data")
    });

    it("Can delete an entry from the cache [ deleteCacheData('test') ===> getCacheData('test') ]", () => {
      const X = myCache.deleteCacheData('test');
      expect(X).to.have.property("timestamp");
      expect(X).to.have.property("data");
      
      const cacheGetShouldFail = myCache.getCacheData('test');
      expect(cacheGetShouldFail).to.be.null;
    });

    it("Can get the cache name [ getCacheName() ]", () => {
      expect(myCache.getCacheName()).to.equal(defaultCacheName);
    })

    it("Can get the cache max age [ getCacheMaxAge() ]", () => {
      expect(myCache.getCacheMaxAge()).to.equal(defaultCacheMaxAge);
    })

    it("Can set the cache name [setCacheName('test_updated') ==> getCacheName()]", () => {
      myCache.setCacheName(`${defaultCacheName}_updated`)
      expect(myCache.getCacheName()).to.equal(`${defaultCacheName}_updated`);
    })

    it("Can set the cache max age [setCacheNameAge(15) ===> getCacheMaxAge()]", () => {
      myCache.setCacheMaxAge(15);
      expect(myCache.getCacheMaxAge()).to.equal(15);
    })

  })

})