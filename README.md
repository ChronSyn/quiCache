# quiCache

> An in-memory key-value cache for Javascript and Typescript applications

## Install

**Yarn**

`yarn add quiCache`

**NPM**

`npm i --save quiCache`

## Introduction

QuiCache is an in-memory caching solution for Javascript and Typescript applications. It relies only on the `date-fns` package, meaning that it should be compatible with every major JS environment out there.

QuiCache provides a key-value structure for data to be stored in. When adding data to the cache, you specify the key, and the data as arguments to `setCacheData()`, and quiCache handles everything else. When reading data from the cache, simply provide the key to `getCacheData()`.

## API / Documentation

See the [docs folder](./docs/index.html) for full details.
Usage examples can be found at the bottom of the readme.

#### Version 3.0

Version 3 now provides support for Typescript generics.

This means that `data` returned from the following methods will infer type data:

- `onCacheDataAdd`
- `onCacheDataAccessed`
- `onCacheDataDelete`
- `onCacheDataExpired`
- `onCacheDataAlreadyExists`
- `getCacheData`
- `setCacheData`
- `getAllCachedData`
- `deleteCacheData`

Due to this, when creating a cache instance with `new QuiCache()`, you must also define the data type you're returning if you're fully typing it:

```
interface IMyDataInterface {
  aString: string;
  aNumber: number;
  aBoolean: boolean;
}

const MyCache: ICacheManager<IMyDataInterface> = new QuiCache({
  cacheName: "MyCache",
  cacheMaxAgeInSeconds: 30
});
```

You can still create and manage your cache in the same way if you're not specifying the type `ICacheManager`, but type data may not be returned.

This change doesn't prevent your ability to store data of `any` type in an individual cache field, but merely enhances the developer experience if you use 1 cache for data which follows a specific interface.

No other changes beyond those in 2.0 are required to be compatible with QuiCache 3.0.

#### Version 2.0

Version 2 has completely overhauled the library, and is mostly incompatible with prior versions (due to changes to the constructor method and several methods being removed).

The changes made should drastically simplify working with the library and provide a nicer developer experience.

- A new method, `deleteCacheData()`, has been added to allow deletion of any cached data by providing it's field name / key
- The concept of expired and non-expired data no longer exists - Cache data now automatically deletes when it expires
- New optional callbacks in the constructor method have been aded: `onCacheDataAdd`, `onCacheDataDelete`, `onCacheDataExpired`, `onCacheDataAlreadyExists`
- Version 2.1.2 has added some new optional callback:
  - `onCacheDataAccessed` - this will trigger when a field is accessed in the cache
  - `onCacheDataDoesNotAlreadyExist` - this will trigger if the specified field is not found in the cache when calling `setCacheData`, `deleteCacheData`
- Enabling and disabling debug has been removed due to addition of callbacks
- You can now provide a name to your cache, which can be useful for the callbacks
- Methods to allow changing the cache age and name have been added
- As of version 2.0.2 map is now used for storing data (instead of an object), meaning it is possible to set keys/fields of any type (instead of just string)
  - At this time, only strings and numbers are accepted as keys, but supporting all primitive types is planned for a future release

#### Further notes on version 2.0

- The constructor now expects an object with params/arguments
- You can only specify a cache maximum age value in seconds (e.g. 120 = 2 minutes), and it is no longer possible to specify the unit of time
- If a key already exists in the cache, it's data will **not** be overwritten when calling `setCacheData()`
- It is possible to update the cache max age after creation by calling `setCacheMaxAge()` and passing a value
  - Values which were added to the cache before this method is called are **not** affected and will be removed at the end of the originally intended expiry time

## Interfaces

The following interfaces and enums are exported from quicache to assist in development;

    ICacheManagerDataCache
    ICacheManager

## Example

```typescript
import quicache, { ICacheManager } from "quicache";

// Create an interface for your data
interface IMyInterface {
  aString: string;
  aBoolean: boolean;
  aNumber: number;
  anOptionalString?: string;
}

// Initialize the cache with your interface
const myCache: ICacheManager<IMyInterface> = new quicache({
  cacheName: "MyCache",
  cacheMaxAgeInSeconds: 30,
  onCacheDataExpired: (data) =>
    console.log(`Field ${data.field} expired in cache ${data.cacheName}`),
  onCacheDataAdd: (data) =>
    console.log(`Field ${data.field} added to cache ${data.cacheName}`),
  onCacheDataAlreadyExists: (data) => {
    console.log(
      `Field ${data.field} already exists in cache ${data.cacheName}, and expires in ${data.expires} seconds`
    );
  },
});

const cacheKey = "testData";

// If the data doesn't exist in the cache, we'll create it
if (!myCache.cacheDataExists(cacheKey)) {
  try {
    const dataToSetInCache = {
      aString: "ABC",
      aBoolean: true,
      aNumber: 123,
    };

    // setCacheData returns the timestamp and data that it inserts into the cache
    return myCache.setCacheData(cacheKey, dataToSetInCache).data;
  } catch (err) {
    return err;
  }
} else {
  // Data exists in cache, so we'll return it
  // getCacheData returns the timestamp and data
  const cachedata = myCache.getCacheData(cacheKey);
  return cachedata.data;
}
```

## Author(s)

👤 **Scott Pritchard ([Github](https://github.com/ChronSyn)**
