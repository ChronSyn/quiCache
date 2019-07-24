# quiCache

![version](https://img.shields.io/badge/version-1.0.43-blue.svg?cacheSeconds=2592000)

> A simple key-value cache for Javascript applications

## Install

**NPM**

`npm i --save quiCache`

**Yarn**

`yarn add quiCache`

## Introduction

quiCache provides a key-value structure for data to be stored in. During construction, you can specify the following (optional) properties;

- cacheMaxAgeValue &lt;number = 30> : The maximum age of any data before it is considered expired
- cacheMaxAgeUnit &lt;ETimeDuration = 'seconds'> : The time unit used with cacheMaxAgeValue

When adding data to the cache, you specify the key, and the data, and quiCache handles everything else.

When reading data from the cache, simply provide the key.

Keys should be unique as calling `setCacheData()` with a key which already exists will overwrite data already in the cache at that key. A solution to this would be to create a new quiCache instance.

## Interfaces

The following interfaces and enums are exported from quicache to assist in development;

    ICacheManagerDataCache
    ETimeDuration
    IConvertStructure
    ICacheManager

## API

See [api.md](./api.md) for full details

## Examples

#### Javascript

```javascript
import cache from 'quiCache';
const myCache = new cache();

const myCachedDataKey = "openSource";
if (!myCache.cacheDataIsValid(myCachedDataKey)){
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
const myCache:ICacheManager = new cache();
const myCachedDataKey: string = "openSource";
const IMyObjectInterface {
  aString: string
  aBoolean: boolean
  aNumber: number
}

if (!myCache.cacheDataIsValid(myCachedDataKey)){
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
