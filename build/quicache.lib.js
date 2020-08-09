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
    /**
     * @param args Fish
      * @implements ICacheManager instance
    */
    function CacheManager(args) {
        var _this = this;
        var _a, _b;
        this._dataCache = {};
        this._cacheName = null;
        this._cacheMaxAgeInSeconds = 0;
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
         * @returns The name of the cache as specified during construction
         * @public
         */
        this.getCacheName = function () { return _this._cacheName; };
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
    }
    return CacheManager;
}());
exports["default"] = CacheManager;
