# quiCache

> A simple key-value cache for Javascript applications

## Install

**Yarn**

`yarn add quiCache`

**NPM**

`npm i --save quiCache`


## Introduction

Version 2 has completely overhauled the library, and is not compatible with prior versions.

quiCache provides a key-value structure for data to be stored in. As of version 2.0, you can only specify a cache maximum age in seconds.
When adding data to the cache, you specify the key, and the data as arguments to `setCacheData()`, and quiCache handles everything else.
When reading data from the cache, simply provide the key to `getCacheData()`.

As of version 2.0:
  - The constructor now expects an object with params
  - Cached data will be automatically removed when it expires
  - if a key already exists in the cache, it's data will **not** be overwritten when calling `setCacheData()`


## Interfaces

The following interfaces and enums are exported from quicache to assist in development;

    ICacheManagerDataCache
    ICacheManager

## API

See the [docs folder](./docs/index.html) for full details

## Examples

#### Javascript

```javascript
import cache from 'quiCache';
const myCache = new cache({
  cacheMaxAgeInSeconds: 30,
  cacheName: "myCache",
  onCacheDataExpired: (data) => console.log(`Field ${data.field} expired in ${data.cacheName}`),
  onCacheDataAdd: (data) => console.log(`Field ${data.field} added to cache ${data.cacheName}`),
  onCacheDataAlreadyExists: (data) => {
    console.log(`Field ${data.field} already exists in cache ${data.cacheName}, and expires in ${data.expires} seconds`)
  }
});

const myCachedDataKey = "openSource";
if (!myCache.cacheDataExists(myCachedDataKey)){
  const myObjectToCache = {
    aString: "abc",
    aBoolean: true,
    aNumber: 123
  };
  return myCache.setCacheData(myCachedDataKey, myObjectToCache);
}
return myCache.getCacheData(myCachedDataKey);
```

#### Typescript
```typescript
import cache, { ICacheManager } from 'quiCache';
const myCache:ICacheManager = new cache({
  cacheMaxAgeInSeconds: 30,
  cacheName: "myCache",
  onCacheDataExpired: (data) => console.log(`Field ${data.field} expired in ${data.cacheName}`),
  onCacheDataAdd: (data) => console.log(`Field ${data.field} added to cache ${data.cacheName}`),
  onCacheDataAlreadyExists: (data) => {
    console.log(`Field ${data.field} already exists in cache ${data.cacheName}, and expires in ${data.expires} seconds`)
  }
});
const myCachedDataKey: string = "openSource";
interface IMyObjectInterface {
  aString: string
  aBoolean: boolean
  aNumber: number
}

if (!myCache.cacheDataExists(myCachedDataKey)){
  const myObjectToCache: IMyObjectInterface = {
    aString: "abc",
    aBoolean: true,
    aNumber: 123
  }
  return myCache.setCacheData(myCachedDataKey, myObjectToCache);
}
return myCache.getCacheData(myCachedDataKey);
```

## Author(s)

👤 **Scott Pritchard ([Github](https://github.com/ChronSyn), [Twitter](https://twitter.com/ChronSyn))**
