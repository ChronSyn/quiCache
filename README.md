# quiCache - A simple key-value cache for Javascript applications

![version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)

> Easily store and retrieve data while it's not expired!

## Install

**NPM**

`npm i --save quiCache`

**Yarn**

`yarn add quiCache`

## How it works

quiCache provides a key-value structure for data to be stored in. During construction, you can specify the following properties;

- cacheMaxAgeValue &lt;number = 30> : The maximum age of any data before it is considered expired
- cacheMaxAgeUnit &lt;moment.unitOfTime.All = 'seconds'> : The time unit used with cacheMaxAgeValue
- timezone: &lt;string = 'europe/london'> : The timezone for keys to be stored and compared against

When adding data to the cache, you specify the key, and the data, and quiCache handles everything else.

When reading data from the cache, simply provide the key.

## API

See [api.md](./api.md) for full details

## Example

    import cache from 'quiCache';
    const cache = new Cache();

    const myCachedDataKey = "openSource";
    if (!cache.cahceDataExists(myCachedDataKey) || !cache.hasCacheExpired(myCachedDataKey)){
      const myObjectToCache = {
        aString: "abc",
        aBoolean: true,
        aNumber: 123
      };
      return cache.setCacheData(myCachedDataKey, myObjectToCache);
    }
    return cache.getCacheData(myCachedDataKey);

## Author(s)

👤 **Scott Pritchard ([Github](https://github.com/ChronSyn), [Twitter](https://twitter.com/ChronSyn))**
