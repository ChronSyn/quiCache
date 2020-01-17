export declare enum ETimeDuration {
    SECOND = "SECONDS",
    SECONDS = "SECONDS",
    MINUTE = "MINUTES",
    MINUTES = "MINUTES",
    HOUR = "HOURS",
    HOURS = "HOURS",
    DAY = "DAYS",
    DAYS = "DAYS"
}
export interface IConvertStructure {
    SECOND: number;
    SECONDS: number;
    MINUTE: number;
    MINUTES: number;
    HOUR: number;
    HOURS: number;
    DAY: number;
    DAYS: number;
}
export interface ICacheManagerDataCache {
    timestamp: number;
    data: {
        [key: string]: any;
    };
}
export declare enum QuicacheMessages {
    ERROR_TIME_LT1 = "Time can not be less than 1",
    ERROR_DEPRECATED_USE_ENABLEDEBUGLOGS = "This method is deprecated. Please use enableDebugLogs()",
    MESSAGE_DEBUG_LOGS_ENABLED = "[QUICACHE] Debug logs enabled"
}
export interface ICacheManager {
    getAllCachedData: () => void;
    getNonExpiredData: () => ICacheManagerDataCache;
    getExpiredData: () => ICacheManagerDataCache;
    getCacheData: (field: string) => ICacheManagerDataCache;
    setCacheData: (field: string, data: any) => ICacheManagerDataCache;
    cacheDataExists: (field: string) => boolean;
    getCacheDataAge: (field: string, unitOfTime: ETimeDuration) => number;
    hasCacheExpired: (field: string) => boolean;
    cacheDataIsValid: (field: string) => boolean;
    getCacheSize: (field: string) => number;
    setDebug: () => this;
    enableDebugLogs: () => this;
    disableDebugLogs: () => this;
}
declare class CacheManager implements ICacheManager {
    private _dataCache;
    private _cacheMaxAgeValue;
    private _cacheMaxAgeUnit;
    private _showDebug;
    /**
     * @description Outputs a debug log message
     * @param {string} message The debug message to display
     * @private
     */
    private _debugLog;
    /**
     * @description Converts a time to the various ETimeDuration (e.g. seconds to [seconds, minutes, hours, days])
     * @param {number} inTime The time to convert
     * @param {ETimeDuration} inFormat The format of inTime
     * @returns {IConvertStructure} inTime converted to the various formats
     * @private
     */
    private _convert;
    /**
     * @param {number} _cacheMaxAgeValue The maximum age of the cached data (in _cacheMaxAgeUnit)
     * @param {number} _cacheMaxAgeUnit The unit which _cacheMaxAgeValue should operate at
     * @public
     * @implements {ICacheManager} ICacheManager instance
     */
    constructor(_cacheMaxAgeValue?: number, _cacheMaxAgeUnit?: ETimeDuration);
    /**
     * @description Allows us to identify the size of the entire cache, or a specific field within the cache.
     * @param {string=} field [Optional] They key of the data we want to check the size of. If not present, will get the size of the entire cache.
     * @public
     * @returns {number} The size of the requested cache data in bytes according to `JSON.stringify().length`
     */
    getCacheSize(field: string): number;
    /**
     * @description Alias of this.enableDebugLogs. This method is deprecated - please use enableDebugLogs().
     * @public
     * @returns {this} The cache manager instance
     * @deprecated This method is deprecated - please use enableDebugLogs()
     */
    setDebug(): this;
    /**
     * @description Enables debug logs.
     * @public
     * @returns {this} The cache manager instance
     */
    enableDebugLogs(): this;
    /**
     * @description Disables debug logs.
     * @public
     * @returns {this} The cache manager instance
     */
    disableDebugLogs(): this;
    /**
     * @description Allow retrieval of all cached data
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    getAllCachedData(): ICacheManagerDataCache;
    /**
     * @description Allow retrieval of all cached data which hasn't expired
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    getNonExpiredData(): ICacheManagerDataCache;
    /**
     * @description Allow retrieval of all cached data which has expired
     * @public
     * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
     */
    getExpiredData(): ICacheManagerDataCache;
    /**
     * @description Retrieves some data from the cache
     * @param {string} field The key of the data which should be returned
     * @public
     * @returns {ICacheManagerDataCache} The data which you cached with this key
     */
    getCacheData(field: string): ICacheManagerDataCache;
    /**
     * @description Sets some data in the cache
     * @param {string} field The key by which data should be stored
     * @param {any} data The data you wish to store. Can be any type.
     * @public
     * @returns {ICacheManagerDataCache} The data which has been cached, including it's timestamp
     */
    setCacheData(field: string, data?: any): ICacheManagerDataCache;
    /**
     * @description Tells us if some of our data already exists in the cache by passing it's key
     * @param {string} field The key we want to check for existance of data
     * @public
     * @returns {boolean} Does the data exist in the cache or not
     */
    cacheDataExists(field: string): boolean;
    /**
     * @description Tells us how old some of our cached data is
     * @param {string} field The key of the data we want to check the age of (i.e. it's age in the cache)
     * @public
     * @returns {number} The number, in seconds, since the timestampe was last modified (i.e. since the data was updates or places into the cache)
     */
    getCacheDataAge(field: string): number;
    /**
     * @description Allows checking if some of our cached data has expired
     * @param {string} field The key we want to check for expiry (i.e. is it older than our _cacheMaxAgeValue)
     * @public
     * @returns {boolean} Has our cached data expired?
     */
    hasCacheExpired(field: string): boolean;
    /**
     * @description Checks if some of our cached data is present and not expired
     * @param {string} field The key we want to check the validity of (i.e. it is present in the cache, and it has not expired)
     * @public
     * @returns {boolean} Is our cached data present, and is it not expired? (true: present and not expired, false, not present or has expired)
     */
    cacheDataIsValid(field: string): boolean;
}
export default CacheManager;
