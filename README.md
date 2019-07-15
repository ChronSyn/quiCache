# quiCache

![version](https://img.shields.io/badge/version-1.0.3-blue.svg?cacheSeconds=2592000)

> A simple key-value cache for Javascript applications

## Install

**NPM**

`npm i --save quiCache`

**Yarn**

`yarn add quiCache`

## Introduction

quiCache provides a key-value structure for data to be stored in. During construction, you can specify the following properties;

- useNativeDate &lt;boolean = false> : Whether to use native JS date or to use moment-timezone
- cacheMaxAgeValue &lt;number = 30> : The maximum age of any data before it is considered expired
- cacheMaxAgeUnit &lt;moment.unitOfTime.All = 'seconds'> : The time unit used with cacheMaxAgeValue
- timezone: &lt;string = 'europe/london'> : The timezone for keys to be stored and compared against

When adding data to the cache, you specify the key, and the data, and quiCache handles everything else.

When reading data from the cache, simply provide the key.

Keys should be unique as calling `setCacheData()` with a key which already exists will overwrite data already in the cache at that key. A solution to this would be to create a new quiCache instance.

## API

See [api.md](./api.md) for full details

## Example

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

## Author(s)

👤 **Scott Pritchard ([Github](https://github.com/ChronSyn), [Twitter](https://twitter.com/ChronSyn))**
