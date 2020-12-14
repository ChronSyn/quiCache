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
interface ICacheEntry<T> {
    timestamp: number;
    data: T;
}
export interface ICacheManagerDataCache<T> {
    [key: string]: ICacheEntry<T>;
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
 * @param showDebugMessages showDebugMessages: Whether to send console messages from Quicache (e.g. when initializing the cache with cacheName set to null, it will show a warning)
 * @param onCacheDataAdd onCacheDataAdd: A callback to run when data is added to the cache
 * @param onCacheDataExpired onCacheDataExpired: A callback to run when data in the cache expires
 * @param onCacheDataDelete onCacheDataDelete: A callback to run when data in the cache is deleted (does not run when data expires)
 * @param onCacheDataAlreadyExists onCacheDataAlreadyExists: A callback to run when data in the cache already exists with the provided key. Will not trigger if you're using cacheDataExists() as a conditional check
 * @param onCacheNameSet onCacheDataExpired: A callback to run when data in the cache expires
 * @param onCacheMaxAgeSet onCacheDataExpired: A callback to run when data in the cache expires
 */
interface ICacheConstructorProps<T> {
    cacheMaxAgeInSeconds: number;
    cacheName?: string;
    showDebugMessages?: boolean;
    onCacheDataAdd?: (data: IOnCacheEvent<T>) => void;
    onCacheDataAccessed?: (data: IOnCacheEvent<T>) => void;
    onCacheDataDelete?: (data: IOnCacheEvent<T>) => void;
    onCacheDataExpired?: (data: IOnCacheEvent<T>) => void;
    onCacheDataAlreadyExists?: (data: IOnCacheEvent<T>) => void;
    onCacheDataDoesNotAlreadyExist?: (data: IOnCacheDataNotExistEvent) => void;
    onCacheNameSet?: (data: IOnCacheNameSet) => void;
    onCacheMaxAgeSet?: (data: IOnCacheMaxAgeSet) => void;
}
interface IOnCacheNameSet {
    oldName: string;
    newName: string;
}
interface IOnCacheMaxAgeSet {
    cacheName: string;
    oldMaxAgeInSeconds: number;
    newMaxAgeInSeconds: number;
}
interface IOnCacheDataNotExistEvent {
    /** The key used to map data in the cache */
    field: string | number;
    /** The cache name as defined during construction */
    cacheName: string;
    /** The time until the data with the specified field/key will expire, in seconds */
    expires: number;
}
interface IOnCacheEvent<T> {
    /** The key used to map data in the cache */
    field: string | number;
    /** The data stored against the field/key */
    data: ICacheEntry<T>;
    /** The cache name as defined during construction */
    cacheName: string;
    /** The time until the data with the specified field/key will expire, in seconds */
    expires: number;
}
export interface ICacheManager<T> {
    getAllCachedData: () => Map<string | number, ICacheManagerDataCache<T>>;
    setCacheMaxAge: (cacheMaxAgeInSeconds: number) => void;
    setCacheName: (cacheName: string) => void;
    getCacheData: (field: string | number) => ICacheEntry<T> | null;
    setCacheData: (field: string | number, data: T) => ICacheEntry<T>;
    deleteCacheData: (field: string | number) => ICacheEntry<T> | null;
    cacheDataExists: (field: string | number) => boolean;
    getCacheDataAge: (field: string | number) => number;
    getCacheSize: (field: string | number) => number;
    getCacheName: () => string;
    getCacheMaxAge: () => number;
}
/**
 * The main CacheManager class
 */
declare class CacheManager<T> implements ICacheManager<T> {
    private _dataCache;
    private _cacheName;
    private _showDebugMessages;
    private _cacheMaxAgeInSeconds;
    private _onCacheDataExpired;
    private _onCacheDataAdd;
    private _onCacheDataAccessed;
    private _onCacheDataDelete;
    private _onCacheDataAlreadyExists;
    private _onCacheDataDoesNotAlreadyExist;
    private _onCacheNameSet;
    private _onCacheMaxAgeSet;
    constructor(args: ICacheConstructorProps<T>);
    /**
     * @description Updates the cache max age to a new value
     * @param cacheMaxAgeInSeconds The new max age for the cache
     * @public
     */
    setCacheMaxAge: (cacheMaxAgeInSeconds: number) => void;
    /**
     * @description Updates the cache max age to a new value
     * @param cacheName The new max age for the cache
     * @public
     */
    setCacheName: (cacheName: string) => void;
    /**
     * @description Checks if data with the specified field/key exists in the cache
     * @param field The field/key to check the cache for
     * @returns If true, then some data with the specified field exists in the cache
     * @public
     */
    cacheDataExists: (field: string | number) => boolean;
    /**
     * @description Returns all cache data
     * @returns The contents of the cache
     * @public
     */
    getAllCachedData: () => Map<string, ICacheManagerDataCache<T>>;
    /**
     * @description Returns data for the specified key from the cache
     * @param field The field/key to check the cache for
     * @returns The cached data, or null if it does not exist
     * @public
     */
    getCacheData: (field: string | number) => ICacheEntry<T> | null;
    /**
     * @description Checks if data with the specified field/key exists in the cache
     * @param field The field/key to check the cache for
     * @returns The age of the cached data with the specified field/key
     * @public
     */
    getCacheDataAge: (field: string | number) => number;
    /**
     * @description Returns the name of the cache as specified during construction
     * @returns The maximum age of data in the cache as specified during construction (or changed using setCacheName)
     * @public
     */
    getCacheName: () => string;
    /**
     * @description Returns the maximum age of data in the cache as specified during construction (or changed using setCacheMaxAge)
     * @returns The maximum age of data in the cache as specified during construction (or changed using setCacheMaxAge)
     * @public
     */
    getCacheMaxAge: () => number;
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
    setCacheData: (field: string | number, data: any) => ICacheEntry<T>;
    /**
     * @description Deletes data in the cache that has the specified field/keyt
     * @param field The field/key of the data to delete
     * @returns The cached data as it is stored in the cache, or null if the specified key does not exist
     * @public
     */
    deleteCacheData: (field: string | number) => ICacheEntry<T> | null;
}
export default CacheManager;
