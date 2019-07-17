"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const has_1 = __importDefault(require("lodash/has"));
const get_1 = __importDefault(require("lodash/get"));
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
class CacheManager {
    /**
     * @description Outputs a debug log message
     * @param {string} message The debug message to display
     * @private
     */
    _debugLog(message = "") {
        console.log(`${new Date().getTime()} [QUICACHE] (debug): ${message}`);
    }
    /**
     * @description Converts a time to the various ETimeDuration (e.g. seconds to [seconds, minutes, hours, days])
     * @param {number} inTime The time to convert
     * @param {ETimeDuration} inFormat The format of inTime
     * @returns {IConvertStructure} inTime converted to the various formats
     * @private
     */
    _convert(inTime = 30, inFormat = ETimeDuration.SECONDS) {
        if (inTime < 1) {
            throw new Error(QuicacheMessages.ERROR_TIME_LT1);
        }
        return (() => {
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
                        DAYS: (inTime / 60 / 24) / 1000,
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
                        DAYS: (inTime / 24) / 1000,
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
                        DAYS: (inTime) / 1000,
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
                        DAYS: (inTime / 60 / 60 / 24) / 1000,
                    };
            }
        })();
    }
    /**
     * @param {number} _cacheMaxAgeValue The maximum age of the cached data (in _cacheMaxAgeUnit)
     * @param {number} _cacheMaxAgeUnit The unit which _cacheMaxAgeValue should operate at
     * @public
     * @implements {ICacheManager} ICacheManager instance
     */
    constructor(_cacheMaxAgeValue = 30, _cacheMaxAgeUnit = ETimeDuration.SECONDS) {
        this._dataCache = {};
        if (_cacheMaxAgeValue < 1) {
            throw new Error(QuicacheMessages.ERROR_TIME_LT1);
        }
        this._cacheMaxAgeValue = _cacheMaxAgeValue;
        this._cacheMaxAgeUnit = _cacheMaxAgeUnit;
    }
    /**
     * @description Allows us to identify the size of the entire cache, or a specific field within the cache.
     * @param {string=} field [Optional] They key of the data we want to check the size of. If not present, will get the size of the entire cache.
     * @public
     * @returns {number} The size of the requested cache data in bytes according to `JSON.stringify().length`
     */
    getCacheSize(field) {
        if (!field) {
            if (this._showDebug) {
                this._debugLog(`Call to "getCacheSize" without field, returning full cache size`);
            }
            ;
            return JSON.stringify(this.getAllCachedData()).length;
        }
        if (this._showDebug) {
            this._debugLog(`Call to "getCacheSize" for "${field}"`);
        }
        ;
        return JSON.stringify(this.getCacheData(field)).length;
    }
    /**
     * @description Alias of this.enableDebugLogs. This method is deprecated - please use enableDebugLogs().
     * @public
     * @returns {this} The cache manager instance
     * @deprecated This method is deprecated - please use enableDebugLogs()
     */
    setDebug() {
        this._debugLog(QuicacheMessages.ERROR_DEPRECATED_USE_ENABLEDEBUGLOGS);
        return this.enableDebugLogs();
    }
    /**
     * @description Enables debug logs.
     * @public
     * @returns {this} The cache manager instance
     */
    enableDebugLogs() {
        this._showDebug = true;
        this._debugLog("Debug logs are now enabled");
        return this;
    }
    /**
     * @description Disables debug logs.
     * @public
     * @returns {this} The cache manager instance
     */
    disableDebugLogs() {
        this._showDebug = true;
        this._debugLog("Debug logs are now disabled");
        return this;
    }
    /**
     * @description Allow retrieval of all cached data
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    getAllCachedData() {
        if (this._showDebug) {
            this._debugLog(`Call to "getAllCachedData"`);
        }
        ;
        return this._dataCache;
    }
    /**
     * @description Allow retrieval of all cached data which hasn't expired
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    getNonExpiredData() {
        if (this._showDebug) {
            this._debugLog(`Call to "getNonExpiredData"`);
        }
        ;
        return {
            timestamp: this._dataCache.timestamp,
            data: Object.entries(this._dataCache.data).filter(([cacheKey, cacheEntry]) => !this.hasCacheExpired(cacheKey))
        };
    }
    /**
     * @description Allow retrieval of all cached data which has expired
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    getExpiredData() {
        if (this._showDebug) {
            this._debugLog(`Call to "getExpiredData"`);
        }
        ;
        return {
            timestamp: this._dataCache.timestamp,
            data: Object.entries(this._dataCache.data).filter(([cacheKey, cacheEntry]) => !this.hasCacheExpired(cacheKey))
        };
    }
    /**
     * @description Retrieves some data from the cache
     * @param {string} field The key of the data which should be returned
     * @public
     * @returns {ICacheManagerDataCache} The data which you cached with this key
     */
    getCacheData(field) {
        if (this._showDebug) {
            this._debugLog(`Call to "getCacheData" for field "${field}"`);
            if (!has_1.default(this, `_dataCache[${field}]`)) {
                this._debugLog(`"${field}" not found in cache, proceeding to all cache data`);
            }
        }
        ;
        return get_1.default(this, `_dataCache[${field}]`, this.getAllCachedData());
    }
    /**
     * @description Sets some data in the cache
     * @param {string} field The key by which data should be stored
     * @param {any} data The data you wish to store. Can be any type.
     * @public
     * @returns {ICacheManagerDataCache} The data which has been cached, including it's timestamp
     */
    setCacheData(field, data) {
        if (this._showDebug) {
            this._debugLog(`Call to "setCacheData" for field "${field}"`);
        }
        ;
        this._dataCache[field] = {
            timestamp: new Date().getTime(),
            data: data
        };
        return this._dataCache[field];
    }
    /**
     * @description Tells us if some of our data already exists in the cache by passing it's key
     * @param {string} field The key we want to check for existance of data
     * @public
     * @returns {boolean} Does the data exist in the cache or not
     */
    cacheDataExists(field) {
        if (this._showDebug) {
            this._debugLog(`Call to "cacheDataExists" for field "${field}"`);
        }
        ;
        return has_1.default(this, `_dataCache[${field}]`);
    }
    /**
     * @description Tells us how old some of our cached data is
     * @param {string} field The key of the data we want to check the age of (i.e. it's age in the cache)
     * @public
     * @returns {number} The number, in seconds, since the timestampe was last modified (i.e. since the data was updates or places into the cache)
     */
    getCacheDataAge(field) {
        if (this._showDebug) {
            this._debugLog(`Call to "getCacheDataAge" for field "${field}"`);
        }
        ;
        return this._convert(new Date().getTime() - this._dataCache[field].timestamp, this._cacheMaxAgeUnit)[this._cacheMaxAgeUnit];
    }
    /**
     * @description Allows checking if some of our cached data has expired
     * @param {string} field The key we want to check for expiry (i.e. is it older than our _cacheMaxAgeValue)
     * @public
     * @returns {boolean} Has our cached data expired?
     */
    hasCacheExpired(field) {
        const compareCalculation = new Date().getTime() - this._dataCache[field].timestamp;
        if (this._showDebug) {
            this._debugLog(`Call to "hasCacheExpired" for "${field}".`);
        }
        ;
        const convertedTime = this._convert(compareCalculation, this._cacheMaxAgeUnit);
        return convertedTime[this._cacheMaxAgeUnit] > this._cacheMaxAgeValue;
    }
    /**
     * @description Checks if some of our cached data is present and not expired
     * @param {string} field The key we want to check the validity of (i.e. it is present in the cache, and it has not expired)
     * @public
     * @returns {boolean} Is our cached data present, and is it not expired? (true: present and not expired, false, not present or has expired)
     */
    cacheDataIsValid(field) {
        this._debugLog(`Call to "cacheDataIsValid" for "${field}".`);
        return this.cacheDataExists(field) && this.hasCacheExpired(field);
    }
}
exports.default = CacheManager;
//# sourceMappingURL=quicache.lib.js.map