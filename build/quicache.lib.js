"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.QuicacheMessages = void 0;
var differenceInSeconds_1 = __importDefault(require("date-fns/differenceInSeconds"));
var QuicacheMessages;
(function (QuicacheMessages) {
    QuicacheMessages["ERROR_TIME_LT1"] = "Time can not be less than 1";
    QuicacheMessages["ERROR_DEPRECATED_USE_ENABLEDEBUGLOGS"] = "This method is deprecated. Please use enableDebugLogs()";
    QuicacheMessages["MESSAGE_DEBUG_LOGS_ENABLED"] = "[QUICACHE] Debug logs enabled";
})(QuicacheMessages = exports.QuicacheMessages || (exports.QuicacheMessages = {}));
/**
 * The main CacheManager class
 */
var CacheManager = /** @class */ (function () {
    function CacheManager(args) {
        var _this = this;
        var _a, _b;
        this._dataCache = new Map();
        this._cacheName = null;
        this._cacheMaxAgeInSeconds = 0;
        /**
         * @description Updates the cache max age to a new value
         * @param cacheMaxAgeInSeconds The new max age for the cache
         * @public
         */
        this.setCacheMaxAge = function (cacheMaxAgeInSeconds) {
            _this._onCacheMaxAgeSet({
                oldMaxAgeInSeconds: _this._cacheMaxAgeInSeconds,
                newMaxAgeInSeconds: cacheMaxAgeInSeconds
            });
            _this._cacheMaxAgeInSeconds = cacheMaxAgeInSeconds;
        };
        /**
         * @description Updates the cache max age to a new value
         * @param cacheName The new max age for the cache
         * @public
         */
        this.setCacheName = function (cacheName) {
            _this._onCacheNameSet({
                oldName: _this._cacheName,
                newName: cacheName
            });
            _this._cacheName = cacheName;
        };
        /**
         * @description Checks if data with the specified field/key exists in the cache
         * @param field The field/key to check the cache for
         * @returns If true, then some data with the specified field exists in the cache
         * @public
         */
        this.cacheDataExists = function (field) {
            var _a, _b;
            return (_b = Boolean((_a = _this === null || _this === void 0 ? void 0 : _this._dataCache) === null || _a === void 0 ? void 0 : _a[field])) !== null && _b !== void 0 ? _b : false;
        };
        /**
         * @description Returns all cache data
         * @returns The contents of the cache
         * @public
         */
        this.getAllCachedData = function () { return _this === null || _this === void 0 ? void 0 : _this._dataCache; };
        /**
         * @description Returns data for the specified key from the cache
         * @param field The field/key to check the cache for
         * @returns The cached data, or null if it does not exist
         * @public
         */
        this.getCacheData = function (field) { var _a, _b; return (_b = (_a = _this === null || _this === void 0 ? void 0 : _this._dataCache) === null || _a === void 0 ? void 0 : _a[field]) !== null && _b !== void 0 ? _b : null; };
        /**
         * @description Checks if data with the specified field/key exists in the cache
         * @param field The field/key to check the cache for
         * @returns The age of the cached data with the specified field/key
         * @public
         */
        this.getCacheDataAge = function (field) {
            var _a, _b, _c;
            return ((_b = (_a = _this === null || _this === void 0 ? void 0 : _this._dataCache) === null || _a === void 0 ? void 0 : _a[field]) === null || _b === void 0 ? void 0 : _b.timestamp) ? differenceInSeconds_1["default"](new Date(), new Date((_c = _this === null || _this === void 0 ? void 0 : _this._dataCache) === null || _c === void 0 ? void 0 : _c[field].timestamp)) : -1;
        };
        /**
         * @description Returns the name of the cache as specified during construction
         * @returns The maximum age of data in the cache as specified during construction (or changed using setCacheName)
         * @public
         */
        this.getCacheName = function () { return _this._cacheName; };
        /**
         * @description Returns the maximum age of data in the cache as specified during construction (or changed using setCacheMaxAge)
         * @returns The maximum age of data in the cache as specified during construction (or changed using setCacheMaxAge)
         * @public
         */
        this.getCacheMaxAge = function () { return _this._cacheMaxAgeInSeconds; };
        /**
         * @description Returns the size of the cache
         * @param field The field/key to check the cache for
         * @returns The size of the cache in bytes (according to JSON.stringify().length)
         * @public
         */
        this.getCacheSize = function () {
            return JSON.stringify(_this._dataCache).length;
        };
        /**
         * @description Stores some data in the cache if data with that key doesn't already exist, and returns the data from the cache (after storing, if it does not already exist)
         * @param field The field/key that this data will be mapped to
         * @param data The data to store against this key
         * @returns The cached data as it is stored in the cache
         * @public
         */
        this.setCacheData = function (field, data) {
            var _a, _b;
            if (_this.cacheDataExists(field)) {
                _this._onCacheDataAlreadyExists({
                    data: _this._dataCache[field],
                    cacheName: _this._cacheName,
                    expires: (_a = _this.getCacheDataAge(field)) !== null && _a !== void 0 ? _a : -1,
                    field: field
                });
                return _this === null || _this === void 0 ? void 0 : _this._dataCache[field];
            }
            _this._dataCache[field] = {
                timestamp: new Date().getTime(),
                data: data
            };
            _this._onCacheDataAdd({
                data: _this._dataCache[field],
                cacheName: _this._cacheName,
                expires: (_b = _this.getCacheDataAge(field)) !== null && _b !== void 0 ? _b : -1,
                field: field
            });
            var deleteTimeout = _this._cacheMaxAgeInSeconds * 1000;
            setTimeout(function () {
                var _a;
                // Check if cached data exists before attempting to invoke expiration callback or delete non-existant property
                if (!_this.cacheDataExists(field)) {
                    return null;
                }
                _this._onCacheDataExpired({
                    data: _this._dataCache[field],
                    cacheName: _this._cacheName,
                    expires: (_a = _this.getCacheDataAge(field)) !== null && _a !== void 0 ? _a : -1,
                    field: field
                });
                delete _this._dataCache[field];
            }, deleteTimeout);
            return _this === null || _this === void 0 ? void 0 : _this._dataCache[field];
        };
        /**
         * @description Deletes data in the cache that has the specified field/keyt
         * @param field The field/key of the data to delete
         * @returns The cached data as it is stored in the cache, or null if the specified key does not exist
         * @public
         */
        this.deleteCacheData = function (field) {
            var _a;
            if (_this.cacheDataExists(field)) {
                _this._onCacheDataDelete({
                    data: _this._dataCache[field],
                    cacheName: _this._cacheName,
                    expires: (_a = _this.getCacheDataAge(field)) !== null && _a !== void 0 ? _a : -1,
                    field: field
                });
                var cacheEntry = _this === null || _this === void 0 ? void 0 : _this._dataCache[field];
                delete _this._dataCache[field];
                return cacheEntry;
            }
            return null;
        };
        if (!(args === null || args === void 0 ? void 0 : args.cacheMaxAgeInSeconds)) {
            console.warn("No cacheMaxAgeInSeconds provided, defaulting to 60 seconds");
        }
        var fallbackCacheName = new Date().getTime().toString();
        if (!(args === null || args === void 0 ? void 0 : args.cacheName)) {
            console.warn("No cacheName provided, falling back to " + fallbackCacheName);
        }
        this._cacheMaxAgeInSeconds = (_a = args === null || args === void 0 ? void 0 : args.cacheMaxAgeInSeconds) !== null && _a !== void 0 ? _a : 60;
        this._cacheName = (_b = args === null || args === void 0 ? void 0 : args.cacheName) !== null && _b !== void 0 ? _b : fallbackCacheName;
        this._onCacheDataAdd = function (data) { return args.onCacheDataAdd ? args.onCacheDataAdd(data) : {}; };
        this._onCacheDataExpired = function (data) { return args.onCacheDataExpired ? args.onCacheDataExpired(data) : {}; };
        this._onCacheDataAlreadyExists = function (data) { return args.onCacheDataAlreadyExists ? args.onCacheDataAlreadyExists(data) : {}; };
        this._onCacheDataDelete = function (data) { return args.onCacheDataDelete ? args.onCacheDataDelete(data) : {}; };
        this._onCacheNameSet = function (data) { return args.onCacheNameSet ? args.onCacheNameSet(data) : {}; };
        this._onCacheMaxAgeSet = function (data) { return args.onCacheMaxAgeSet ? args.onCacheMaxAgeSet(data) : {}; };
    }
    return CacheManager;
}());
exports["default"] = CacheManager;
