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
/** Properties which are contained in each cache entry */
/**
 * @param timestamp timestamp: The time that the entry was added to the cache
 * @param cacheName data: Contains the data you passed to the cache
 */
interface ICacheEntry {
    timestamp: number;
    data: {
        [key: string]: any;
    };
}
export interface ICacheManagerDataCache {
    [key: string]: ICacheEntry;
}
export declare enum QuicacheMessages {
    ERROR_TIME_LT1 = "Time can not be less than 1",
    ERROR_DEPRECATED_USE_ENABLEDEBUGLOGS = "This method is deprecated. Please use enableDebugLogs()",
    MESSAGE_DEBUG_LOGS_ENABLED = "[QUICACHE] Debug logs enabled"
}
/** Properties which can be passed to the constructor */
/**
 * @param cacheMaxAgeInSeconds cacheMaxAgeInSeconds: The maximum age of a cache entry, in seconds
 * @param cacheName cacheName: A 'friendly name' for the cache, used for callback events
 * @param onCacheDataAdd onCacheDataAdd: A callback to run when data is added to the cache
 * @param onCacheDataExpired onCacheDataExpired: A callback to run when data in the cache expires
 * @param onCacheDataAlreadyExists onCacheDataAlreadyExists: A callback to run when data in the cache already exists with the provided key. Will not trigger if you're using cacheDataExists() as a conditional check
 */
interface ICacheConstructorProps {
    cacheMaxAgeInSeconds: number;
    cacheName?: string;
    onCacheDataAdd?: (data: IOnCacheEvent) => void;
    onCacheDataExpired?: (data: IOnCacheEvent) => void;
    onCacheDataAlreadyExists?: (data: IOnCacheEvent) => void;
}
interface IOnCacheEvent {
    /** The key used to map data in the cache */
    field: string;
    /** The data stored against the field/key */
    data: ICacheEntry;
    /** The cache name as defined during construction */
    cacheName: string;
    /** The time until the data with the specified field/key will expire, in seconds */
    expires: number;
}
export interface ICacheManager {
    getAllCachedData: () => void;
    getCacheData: (field: string) => ICacheEntry;
    setCacheData: (field: string, data: any) => ICacheEntry;
    cacheDataExists: (field: string) => boolean;
    getCacheDataAge: (field: string) => number;
    getCacheSize: (field: string) => number;
    getCacheName: () => string;
}
/**
 * The main CacheManager class
 */
declare class CacheManager implements ICacheManager {
    private _dataCache;
    private _cacheName;
    private _cacheMaxAgeInSeconds;
    private _onCacheDataExpired;
    private _onCacheDataAdd;
    private _onCacheDataAlreadyExists;
    /**
     * @param args Fish
      * @implements ICacheManager instance
    */
    constructor(args: ICacheConstructorProps);
    /**
     * @description Checks if data with the specified field/key exists in the cache
     * @param field The field/key to check the cache for
     * @returns If true, then some data with the specified field exists in the cache
     * @public
     */
    cacheDataExists: (field: string) => boolean;
    /**
     * @description Returns all cache data
     * @returns The contents of the cache
     * @public
     */
    getAllCachedData: () => ICacheManagerDataCache;
    /**
     * @description Returns data for the specified key from the cache
     * @param field The field/key to check the cache for
     * @returns The cached data, or null if it does not exist
     * @public
     */
    getCacheData: (field: string) => ICacheEntry;
    /**
     * @description Checks if data with the specified field/key exists in the cache
     * @param field The field/key to check the cache for
     * @returns The age of the cached data with the specified field/key
     * @public
     */
    getCacheDataAge: (field: string) => number;
    /**
     * @description Returns the name of the cache as specified during construction
     * @returns The name of the cache as specified during construction
     * @public
     */
    getCacheName: () => string;
    /**
     * @description Returns the size of the cache
     * @param field The field/key to check the cache for
     * @returns The size of the cache in bytes (according to JSON.stringify().length)
     * @public
     */
    getCacheSize: () => number;
    /**
     * @description Stores some data in the cache if data with that key doesn't already exist, and returns the data from the cache (after storing, if it does not already exist)
     * @param field The field/key that this data will be mapped to
     * @param data The data to store against this key
     * @returns The cached data as it is stored in the cache
     * @public
     */
    setCacheData: (field: string, data: any) => ICacheEntry;
}
export default CacheManager;
