# quiCache

> A simple key-value cache for Javascript applications

**[Version 2.0 of QuiCache is now available, featuring several notable improvements!](https://github.com/ChronSyn/quiCache/tree/feature/2.0-release)**

## Install

**Yarn**

`yarn add quiCache@next`

**NPM**

`npm i --save quiCache@next`


## Introduction

quiCache provides a key-value structure for data to be stored in. When adding data to the cache, you specify the key, and the data as arguments to `setCacheData()`, and quiCache handles everything else.
When reading data from the cache, simply provide the key to `getCacheData()`.


#### Version 2.0

Version 2 has completely overhauled the library, and is mostly incompatible with prior versions (due to changes to the constructor method and several methods being removed).

The changes made should drastically simplify working with the library and provide a nicer developer experience.

  * A new method, `deleteCacheData()`, has been added to allow deletion of any cached data by providing it's field name / key
  * The concept of expired and non-expired data no longer exists - Cache data now automatically deletes when it expires
  * New optional callbacks in the constructor method have been aded: `onCacheDataAdd`, `onCacheDataDelete`, `onCacheDataExpired`, `onCacheDataAlreadyExists`
  * Enabling and disabling debug has been removed due to addition of callbacks
  * You can now provide a name to your cache, which can be useful for the callbacks
  * Methods to allow changing the cache age and name have been added
  * As of version 2.0.2 map is now used for storing data (instead of an object), meaning it is possible to set keys/fields of any type (instead of just string)
    * At this time, only strings and numbers are accepted as keys, but supporting all primitive types is planned for a future release

#### Further notes on version 2.0
  - The constructor now expects an object with params/arguments
  - You can only specify a cache maximum age value - this value is in seconds (e.g. 120 = 2 minutes)
  - If a key already exists in the cache, it's data will **not** be overwritten when calling `setCacheData()`
  - It is possible to update the cache max age after creation by calling `setCacheMaxAge()` and passing a value
    - Values which were added to the cache before this method is called are **not** affected

## Interfaces

The following interfaces and enums are exported from quicache to assist in development;

    ICacheManagerDataCache
    ICacheManager

## API

See the [docs folder](./docs/index.html) for full details

## Example

```typescript
import quicache, { ICacheManager } from "quicache";

const myCache: ICacheManager = new quicache({
    cacheMaxAgeInSeconds: 75,
    cacheName: "MyCache",
    onCacheDataExpired: (data) => console.log(`Field ${data.field} expired in cache ${data.cacheName}`),
    onCacheDataAdd: (data) => console.log(`Field ${data.field} added to cache ${data.cacheName}`),
    onCacheDataAlreadyExists: (data) => {
        console.log(`Field ${data.field} already exists in cache ${data.cacheName}, and expires in ${data.expires} seconds`)
    }
});

const cacheKey = "testData";
if (!myCache.cacheDataExists(cacheKey)) {
  try {
    const dataToSetInCache = {
      aString: "ABC",
      aBoolean: true,
      aNumber: 123
    }

    // setCacheData returns the timestamp and data that it inserts into the cache
    const cachedata = myCache.setCacheData(cacheKey, dataToSetInCache);
    return cachedata.data;
  } catch (err) {
    return err;
  }
} else {
  // getCacheData returns the timestamp and data
  const cachedata = myCache.getCacheData(cacheKey);
  return cachedata.data;
}
```

## Author(s)

👤 **Scott Pritchard ([Github](https://github.com/ChronSyn), [Twitter](https://twitter.com/ChronSyn))**
