<a name="CacheManager"></a>

## CacheManager
**Kind**: global class  

* [CacheManager](#CacheManager)
    * [new CacheManager(useNativeDate, cacheMaxAgeValue, cacheMaxAgeUnit, timezone)](#new_CacheManager_new)
    * [.enableNativeDate()](#CacheManager+enableNativeDate) ⇒ <code>this</code>
    * ~~[.setDebug()](#CacheManager+setDebug) ⇒ <code>this</code>~~
    * [.enableDebugLogs()](#CacheManager+enableDebugLogs) ⇒ <code>this</code>
    * [.disableDebugLogs()](#CacheManager+disableDebugLogs) ⇒ <code>this</code>
    * [.getAllCachedData()](#CacheManager+getAllCachedData) ⇒ <code>ICacheManagerDataCache</code>
    * [.getNonExpiredData()](#CacheManager+getNonExpiredData) ⇒ <code>ICacheManagerDataCache</code>
    * [.getExpiredData()](#CacheManager+getExpiredData) ⇒ <code>ICacheManagerDataCache</code>
    * [.getCacheData(field)](#CacheManager+getCacheData) ⇒ <code>ICacheManagerDataCache</code>
    * [.setCacheData(field, data)](#CacheManager+setCacheData) ⇒ <code>ICacheManagerDataCache</code>
    * [.cacheDataExists(field)](#CacheManager+cacheDataExists) ⇒ <code>boolean</code>
    * [.getCacheDataAge(field)](#CacheManager+getCacheDataAge) ⇒ <code>number</code>
    * [.hasCacheExpired(field)](#CacheManager+hasCacheExpired) ⇒ <code>boolean</code>
    * [.cacheDataIsValid(field)](#CacheManager+cacheDataIsValid) ⇒ <code>boolean</code>

<a name="new_CacheManager_new"></a>

### new CacheManager(useNativeDate, cacheMaxAgeValue, cacheMaxAgeUnit, timezone)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| useNativeDate | <code>boolean</code> | <code>false</code> | <p>Whether to use native JS date or to use momentJS</p> |
| cacheMaxAgeValue | <code>number</code> | <code>30</code> | <p>The maximum age of the cached data (in cacheMaxAgeUnit)</p> |
| cacheMaxAgeUnit | <code>number</code> | <code>seconds</code> | <p>The unit which cacheMaxAgeValue should operate at</p> |
| timezone | <code>string</code> | <code>&quot;Europe/London&quot;</code> | <p>The timezone which timestamps should be set in - only applies when not using native JS</p> |

<a name="CacheManager+enableNativeDate"></a>

### cacheManager.enableNativeDate() ⇒ <code>this</code>
<p>Enables JS native date. It is not possible to go back to moment format once this is set!</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>this</code> - <p>The cache manager instance</p>  
<a name="CacheManager+setDebug"></a>

### ~~cacheManager.setDebug() ⇒ <code>this</code>~~
***Deprecated***

<p>Alias of this.enableDebugLogs. This method is deprecated - please use enableDebugLogs().</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>this</code> - <p>The cache manager instance</p>  
<a name="CacheManager+enableDebugLogs"></a>

### cacheManager.enableDebugLogs() ⇒ <code>this</code>
<p>Enables debug logs.</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>this</code> - <p>The cache manager instance</p>  
<a name="CacheManager+disableDebugLogs"></a>

### cacheManager.disableDebugLogs() ⇒ <code>this</code>
<p>Disables debug logs.</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>this</code> - <p>The cache manager instance</p>  
<a name="CacheManager+getAllCachedData"></a>

### cacheManager.getAllCachedData() ⇒ <code>ICacheManagerDataCache</code>
<p>Allow retrieval of all cached data</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>ICacheManagerDataCache</code> - <p>The object which contains the timestamp and data</p>  
<a name="CacheManager+getNonExpiredData"></a>

### cacheManager.getNonExpiredData() ⇒ <code>ICacheManagerDataCache</code>
<p>Allow retrieval of all cached data which hasn't expired</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>ICacheManagerDataCache</code> - <p>The object which contains the timestamp and data</p>  
<a name="CacheManager+getExpiredData"></a>

### cacheManager.getExpiredData() ⇒ <code>ICacheManagerDataCache</code>
<p>Allow retrieval of all cached data which has expired</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>ICacheManagerDataCache</code> - <p>The object which contains the timestamp and data</p>  
<a name="CacheManager+getCacheData"></a>

### cacheManager.getCacheData(field) ⇒ <code>ICacheManagerDataCache</code>
<p>Retrieves some data from the cache</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>ICacheManagerDataCache</code> - <p>The data which you cached with this key</p>  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | <p>The key of the data which should be returned</p> |

<a name="CacheManager+setCacheData"></a>

### cacheManager.setCacheData(field, data) ⇒ <code>ICacheManagerDataCache</code>
<p>Sets some data in the cache</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>ICacheManagerDataCache</code> - <p>The data which has been cached, including it's timestamp</p>  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | <p>The key by which data should be stored</p> |
| data | <code>any</code> | <p>The data you wish to store. Can be any type.</p> |

<a name="CacheManager+cacheDataExists"></a>

### cacheManager.cacheDataExists(field) ⇒ <code>boolean</code>
<p>Tells us if some of our data already exists in the cache by passing it's key</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>boolean</code> - <p>Does the data exist in the cache or not</p>  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | <p>The key we want to check for existance of data</p> |

<a name="CacheManager+getCacheDataAge"></a>

### cacheManager.getCacheDataAge(field) ⇒ <code>number</code>
<p>Tells us how old some of our cached data is</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>number</code> - <p>The number, in seconds, since the timestampe was last modified (i.e. since the data was updates or places into the cache)</p>  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | <p>The key of the data we want to check the age of (i.e. it's age in the cache)</p> |

<a name="CacheManager+hasCacheExpired"></a>

### cacheManager.hasCacheExpired(field) ⇒ <code>boolean</code>
<p>Allows checking if some of our cached data has expired</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>boolean</code> - <p>Has our cached data expired?</p>  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | <p>The key we want to check for expiry (i.e. is it older than our cacheMaxAgeValue)</p> |

<a name="CacheManager+cacheDataIsValid"></a>

### cacheManager.cacheDataIsValid(field) ⇒ <code>boolean</code>
<p>Checks if some of our cached data is present and not expired</p>

**Kind**: instance method of [<code>CacheManager</code>](#CacheManager)  
**Returns**: <code>boolean</code> - <p>Is our cached data present, and is it not expired? (true: present and not expired, false, not present or has expired)</p>  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | <p>The key we want to check the validity of (i.e. it is present in the cache, and it has not expired)</p> |

