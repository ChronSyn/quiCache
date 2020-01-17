"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var has_1 = __importDefault(require("lodash/has"));
var get_1 = __importDefault(require("lodash/get"));
var ETimeDuration;
(function (ETimeDuration) {
    ETimeDuration["SECOND"] = "SECONDS";
    ETimeDuration["SECONDS"] = "SECONDS";
    ETimeDuration["MINUTE"] = "MINUTES";
    ETimeDuration["MINUTES"] = "MINUTES";
    ETimeDuration["HOUR"] = "HOURS";
    ETimeDuration["HOURS"] = "HOURS";
    ETimeDuration["DAY"] = "DAYS";
    ETimeDuration["DAYS"] = "DAYS";
})(ETimeDuration = exports.ETimeDuration || (exports.ETimeDuration = {}));
var QuicacheMessages;
(function (QuicacheMessages) {
    QuicacheMessages["ERROR_TIME_LT1"] = "Time can not be less than 1";
    QuicacheMessages["ERROR_DEPRECATED_USE_ENABLEDEBUGLOGS"] = "This method is deprecated. Please use enableDebugLogs()";
    QuicacheMessages["MESSAGE_DEBUG_LOGS_ENABLED"] = "[QUICACHE] Debug logs enabled";
})(QuicacheMessages = exports.QuicacheMessages || (exports.QuicacheMessages = {}));
var CacheManager = /** @class */ (function () {
    /**
     * @param {number} _cacheMaxAgeValue The maximum age of the cached data (in _cacheMaxAgeUnit)
     * @param {number} _cacheMaxAgeUnit The unit which _cacheMaxAgeValue should operate at
     * @public
     * @implements {ICacheManager} ICacheManager instance
     */
    function CacheManager(_cacheMaxAgeValue, _cacheMaxAgeUnit) {
        if (_cacheMaxAgeValue === void 0) { _cacheMaxAgeValue = 30; }
        if (_cacheMaxAgeUnit === void 0) { _cacheMaxAgeUnit = ETimeDuration.SECONDS; }
        this._dataCache = {};
        if (_cacheMaxAgeValue < 1) {
            throw new Error(QuicacheMessages.ERROR_TIME_LT1);
        }
        this._cacheMaxAgeValue = _cacheMaxAgeValue;
        this._cacheMaxAgeUnit = _cacheMaxAgeUnit;
    }
    /**
     * @description Outputs a debug log message
     * @param {string} message The debug message to display
     * @private
     */
    CacheManager.prototype._debugLog = function (message) {
        if (message === void 0) { message = ""; }
        console.log(new Date().getTime() + " [QUICACHE] (debug): " + message);
    };
    /**
     * @description Converts a time to the various ETimeDuration (e.g. seconds to [seconds, minutes, hours, days])
     * @param {number} inTime The time to convert
     * @param {ETimeDuration} inFormat The format of inTime
     * @returns {IConvertStructure} inTime converted to the various formats
     * @private
     */
    CacheManager.prototype._convert = function (inTime, inFormat) {
        if (inTime === void 0) { inTime = 30; }
        if (inFormat === void 0) { inFormat = ETimeDuration.SECONDS; }
        if (inTime < 1) {
            throw new Error(QuicacheMessages.ERROR_TIME_LT1);
        }
        return (function () {
            switch (inFormat) {
                case ETimeDuration.MINUTE:
                case ETimeDuration.MINUTES:
                    return {
                        SECOND: (inTime * 60) / 1000,
                        SECONDS: (inTime * 60) / 1000,
                        MINUTE: (inTime) / 1000,
                        MINUTES: (inTime) / 100,
                        HOUR: (inTime / 60) / 1000,
                        HOURS: (inTime / 60) / 1000,
                        DAY: (inTime / 60 / 24) / 1000,
                        DAYS: (inTime / 60 / 24) / 1000
                    };
                case ETimeDuration.HOUR:
                case ETimeDuration.HOURS:
                    return {
                        SECOND: (inTime * 60 * 60) / 1000,
                        SECONDS: (inTime * 60 * 60) / 1000,
                        MINUTE: (inTime * 60) / 1000,
                        MINUTES: (inTime * 60) / 1000,
                        HOUR: (inTime) / 1000,
                        HOURS: (inTime) / 1000,
                        DAY: (inTime / 24) / 1000,
                        DAYS: (inTime / 24) / 1000
                    };
                case ETimeDuration.DAY:
                case ETimeDuration.DAYS:
                    return {
                        SECOND: (inTime * 60 * 60 * 60) / 1000,
                        SECONDS: (inTime * 60 * 60 * 60) / 1000,
                        MINUTE: (inTime * 60 * 60) / 1000,
                        MINUTES: (inTime * 60 * 60) / 1000,
                        HOUR: (inTime * 24) / 1000,
                        HOURS: (inTime * 24) / 1000,
                        DAY: (inTime) / 1000,
                        DAYS: (inTime) / 1000
                    };
                case ETimeDuration.SECOND:
                case ETimeDuration.SECONDS:
                default:
                    return {
                        SECOND: (inTime) / 1000,
                        SECONDS: (inTime) / 1000,
                        MINUTE: (inTime / 60) / 1000,
                        MINUTES: (inTime / 60) / 1000,
                        HOUR: (inTime / 60 / 60) / 1000,
                        HOURS: (inTime / 60 / 60) / 1000,
                        DAY: (inTime / 60 / 60 / 24) / 1000,
                        DAYS: (inTime / 60 / 60 / 24) / 1000
                    };
            }
        })();
    };
    /**
     * @description Allows us to identify the size of the entire cache, or a specific field within the cache.
     * @param {string=} field [Optional] They key of the data we want to check the size of. If not present, will get the size of the entire cache.
     * @public
     * @returns {number} The size of the requested cache data in bytes according to `JSON.stringify().length`
     */
    CacheManager.prototype.getCacheSize = function (field) {
        if (!field) {
            if (this._showDebug) {
                this._debugLog("Call to \"getCacheSize\" without field, returning full cache size");
            }
            ;
            return JSON.stringify(this.getAllCachedData()).length;
        }
        if (this._showDebug) {
            this._debugLog("Call to \"getCacheSize\" for \"" + field + "\"");
        }
        ;
        return JSON.stringify(this.getCacheData(field)).length;
    };
    /**
     * @description Alias of this.enableDebugLogs. This method is deprecated - please use enableDebugLogs().
     * @public
     * @returns {this} The cache manager instance
     * @deprecated This method is deprecated - please use enableDebugLogs()
     */
    CacheManager.prototype.setDebug = function () {
        this._debugLog(QuicacheMessages.ERROR_DEPRECATED_USE_ENABLEDEBUGLOGS);
        return this.enableDebugLogs();
    };
    /**
     * @description Enables debug logs.
     * @public
     * @returns {this} The cache manager instance
     */
    CacheManager.prototype.enableDebugLogs = function () {
        this._showDebug = true;
        this._debugLog("Debug logs are now enabled");
        return this;
    };
    /**
     * @description Disables debug logs.
     * @public
     * @returns {this} The cache manager instance
     */
    CacheManager.prototype.disableDebugLogs = function () {
        this._showDebug = true;
        this._debugLog("Debug logs are now disabled");
        return this;
    };
    /**
     * @description Allow retrieval of all cached data
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    CacheManager.prototype.getAllCachedData = function () {
        if (this._showDebug) {
            this._debugLog("Call to \"getAllCachedData\"");
        }
        ;
        return this._dataCache;
    };
    /**
     * @description Allow retrieval of all cached data which hasn't expired
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    CacheManager.prototype.getNonExpiredData = function () {
        var _this = this;
        if (this._showDebug) {
            this._debugLog("Call to \"getNonExpiredData\"");
        }
        ;
        return {
            timestamp: this._dataCache.timestamp,
            data: Object.entries(this._dataCache.data).filter(function (_a) {
                var cacheKey = _a[0], cacheEntry = _a[1];
                return !_this.hasCacheExpired(cacheKey);
            })
        };
    };
    /**
     * @description Allow retrieval of all cached data which has expired
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    CacheManager.prototype.getExpiredData = function () {
        var _this = this;
        if (this._showDebug) {
            this._debugLog("Call to \"getExpiredData\"");
        }
        ;
        return {
            timestamp: this._dataCache.timestamp,
            data: Object.entries(this._dataCache.data).filter(function (_a) {
                var cacheKey = _a[0], cacheEntry = _a[1];
                return !_this.hasCacheExpired(cacheKey);
            })
        };
    };
    /**
     * @description Retrieves some data from the cache
     * @param {string} field The key of the data which should be returned
     * @public
     * @returns {ICacheManagerDataCache} The data which you cached with this key
     */
    CacheManager.prototype.getCacheData = function (field) {
        if (this._showDebug) {
            this._debugLog("Call to \"getCacheData\" for field \"" + field + "\"");
            if (!has_1["default"](this, "_dataCache[" + field + "]")) {
                this._debugLog("\"" + field + "\" not found in cache, proceeding to all cache data");
            }
        }
        ;
        return get_1["default"](this, "_dataCache[" + field + "]", this.getAllCachedData());
    };
    /**
     * @description Sets some data in the cache
     * @param {string} field The key by which data should be stored
     * @param {any} data The data you wish to store. Can be any type.
     * @public
     * @returns {ICacheManagerDataCache} The data which has been cached, including it's timestamp
     */
    CacheManager.prototype.setCacheData = function (field, data) {
        if (data === void 0) { data = {}; }
        if (this._showDebug) {
            this._debugLog("Call to \"setCacheData\" for field \"" + field + "\"");
        }
        ;
        var timestamp = new Date().getTime();
        this._dataCache[field] = {
            timestamp: timestamp,
            data: data
        };
        return this._dataCache[field];
    };
    /**
     * @description Tells us if some of our data already exists in the cache by passing it's key
     * @param {string} field The key we want to check for existance of data
     * @public
     * @returns {boolean} Does the data exist in the cache or not
     */
    CacheManager.prototype.cacheDataExists = function (field) {
        if (this._showDebug) {
            this._debugLog("Call to \"cacheDataExists\" for field \"" + field + "\"");
        }
        ;
        return has_1["default"](this, "_dataCache[" + field + "]");
    };
    /**
     * @description Tells us how old some of our cached data is
     * @param {string} field The key of the data we want to check the age of (i.e. it's age in the cache)
     * @public
     * @returns {number} The number, in seconds, since the timestampe was last modified (i.e. since the data was updates or places into the cache)
     */
    CacheManager.prototype.getCacheDataAge = function (field) {
        if (this._showDebug) {
            this._debugLog("Call to \"getCacheDataAge\" for field \"" + field + "\"");
        }
        ;
        return this._convert(new Date().getTime() - this._dataCache[field].timestamp, this._cacheMaxAgeUnit)[this._cacheMaxAgeUnit];
    };
    /**
     * @description Allows checking if some of our cached data has expired
     * @param {string} field The key we want to check for expiry (i.e. is it older than our _cacheMaxAgeValue)
     * @public
     * @returns {boolean} Has our cached data expired?
     */
    CacheManager.prototype.hasCacheExpired = function (field) {
        var _a;
        // if (!this.cacheDataExists(field) || this.cacheDataIsValid(field)){
        //   return true;
        // }
        var compareCalculation = new Date().getTime() - (_a = this._dataCache[field].timestamp, (_a !== null && _a !== void 0 ? _a : new Date().getTime()));
        if (this._showDebug) {
            this._debugLog("Call to \"hasCacheExpired\" for \"" + field + "\".");
        }
        ;
        var convertedTime = this._convert(compareCalculation, this._cacheMaxAgeUnit);
        return convertedTime[this._cacheMaxAgeUnit] > this._cacheMaxAgeValue;
    };
    /**
     * @description Checks if some of our cached data is present and not expired
     * @param {string} field The key we want to check the validity of (i.e. it is present in the cache, and it has not expired)
     * @public
     * @returns {boolean} Is our cached data present, and is it not expired? (true: present and not expired, false, not present or has expired)
     */
    CacheManager.prototype.cacheDataIsValid = function (field) {
        if (this._showDebug) {
            this._debugLog("Call to \"cacheDataIsValid\" for \"" + field + "\".");
        }
        return this.cacheDataExists(field) && this.hasCacheExpired(field);
    };
    return CacheManager;
}());
exports["default"] = CacheManager;
