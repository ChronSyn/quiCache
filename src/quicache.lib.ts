import has from 'lodash/has';
import get from 'lodash/get';
import isPast from 'date-fns/isPast';
import subtract from 'date-fns/sub';
import differenceInSeconds from 'date-fns/differenceInSeconds';

export interface IConvertStructure {
  SECOND: number,
  SECONDS: number,
  MINUTE: number,
  MINUTES: number,
  HOUR: number,
  HOURS: number,
  DAY: number,
  DAYS: number
}

/** Properties which are contained in each cache entry */
/**
 * @param timestamp timestamp: The time that the entry was added to the cache
 * @param cacheName data: Contains the data you passed to the cache
 */
interface ICacheEntry {
  timestamp: number,
  data: {
    [key: string]: any
  }
}

export interface ICacheManagerDataCache {
  [key: string]: ICacheEntry
}

export enum QuicacheMessages {
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
 * @param onCacheNameSet onCacheDataExpired: A callback to run when data in the cache expires
 * @param onCacheMaxAgeSet onCacheDataExpired: A callback to run when data in the cache expires
 */
interface ICacheConstructorProps {
  cacheMaxAgeInSeconds: number;
  cacheName?: string;
  onCacheDataAdd?: (data: IOnCacheEvent) => void;
  onCacheDataExpired?: (data: IOnCacheEvent) => void;
  onCacheDataAlreadyExists?: (data: IOnCacheEvent) => void;
  onCacheNameSet?: (data: IOnCacheNameSet) => void;
  onCacheMaxAgeSet?: (data: IOnCacheMaxAgeSet) => void;
}

interface IOnCacheNameSet {
  oldName: string;
  newName: string;
}

interface IOnCacheMaxAgeSet {
  oldMaxAgeInSeconds: number;
  newMaxAgeInSeconds: number;
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
  setCacheMaxAge: (cacheMaxAgeInSeconds: number) => void;
  setCacheName: (cacheName: string) => void;
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
class CacheManager implements ICacheManager {
  private _dataCache: ICacheManagerDataCache = {};
  private _cacheName: string = null;
  private _cacheMaxAgeInSeconds: number = 0;
  private _onCacheDataExpired: (data: IOnCacheEvent) => void;
  private _onCacheDataAdd: (data: IOnCacheEvent) => void;
  private _onCacheDataAlreadyExists: (data: IOnCacheEvent) => void;
  private _onCacheNameSet: (data: IOnCacheNameSet) => void;
  private _onCacheMaxAgeSet: (data: IOnCacheMaxAgeSet) => void;

  constructor(args: ICacheConstructorProps) {
    if (!args?.cacheMaxAgeInSeconds) {
      console.warn("No cacheMaxAgeInSeconds provided, defaulting to 60 seconds");
    }
    const fallbackCacheName: string = new Date().getTime().toString();
    if (!args?.cacheName) {
      console.warn(`No cacheName provided, falling back to ${fallbackCacheName}`)
    }
    this._cacheMaxAgeInSeconds = args?.cacheMaxAgeInSeconds ?? 60;
    this._cacheName = args?.cacheName ?? fallbackCacheName;
    this._onCacheDataAdd = (data: IOnCacheEvent) => args.onCacheDataAdd ? args.onCacheDataAdd(data) : {};
    this._onCacheDataExpired = (data: IOnCacheEvent) => args.onCacheDataExpired ? args.onCacheDataExpired(data) : {};
    this._onCacheDataAlreadyExists = (data: IOnCacheEvent) => args.onCacheDataAlreadyExists ? args.onCacheDataAlreadyExists(data) : {};
    this._onCacheNameSet = (data: IOnCacheNameSet) => args.onCacheNameSet ? args.onCacheNameSet(data) : {};
    this._onCacheMaxAgeSet = (data: IOnCacheMaxAgeSet) => args.onCacheMaxAgeSet ? args.onCacheMaxAgeSet(data) : {};
  }

  /**
   * @description Updates the cache max age to a new value
   * @param cacheMaxAgeInSeconds The new max age for the cache
   * @public
   */
  public setCacheMaxAge = (cacheMaxAgeInSeconds: number): void => {
    this._onCacheMaxAgeSet({
      oldMaxAgeInSeconds: this._cacheMaxAgeInSeconds,
      newMaxAgeInSeconds: cacheMaxAgeInSeconds
    })
    this._cacheMaxAgeInSeconds = cacheMaxAgeInSeconds;
  }

  /**
   * @description Updates the cache max age to a new value
   * @param cacheName The new max age for the cache
   * @public
   */
  public setCacheName = (cacheName: string): void => {
    this._onCacheNameSet({
      oldName: this._cacheName,
      newName: cacheName
    })
    this._cacheName = cacheName;
  }
  
  /**
   * @description Checks if data with the specified field/key exists in the cache
   * @param field The field/key to check the cache for
   * @returns If true, then some data with the specified field exists in the cache
   * @public
   */
  public cacheDataExists = (field: string): boolean => {
    return Boolean(this?._dataCache?.[field]) ?? false;
  };

  /**
   * @description Returns all cache data
   * @returns The contents of the cache
   * @public
   */
  public getAllCachedData = (): ICacheManagerDataCache => this?._dataCache;

  /**
   * @description Returns data for the specified key from the cache
   * @param field The field/key to check the cache for
   * @returns The cached data, or null if it does not exist
   * @public
   */
  public getCacheData = (field: string): ICacheEntry => this?._dataCache?.[field] ?? null;

  /**
   * @description Checks if data with the specified field/key exists in the cache
   * @param field The field/key to check the cache for
   * @returns The age of the cached data with the specified field/key
   * @public
   */
  public getCacheDataAge = (field: string): number => {
    return this?._dataCache?.[field]?.timestamp ? differenceInSeconds(new Date(), new Date(this?._dataCache?.[field].timestamp)) : -1
  }

  /**
   * @description Returns the name of the cache as specified during construction
   * @returns The name of the cache as specified during construction
   * @public
   */
  public getCacheName = (): string => this._cacheName;

  /**
   * @description Returns the size of the cache
   * @param field The field/key to check the cache for
   * @returns The size of the cache in bytes (according to JSON.stringify().length)
   * @public
   */
  public getCacheSize = (): number => {
    return JSON.stringify(this._dataCache).length;
  };

  /**
   * @description Stores some data in the cache if data with that key doesn't already exist, and returns the data from the cache (after storing, if it does not already exist)
   * @param field The field/key that this data will be mapped to
   * @param data The data to store against this key
   * @returns The cached data as it is stored in the cache
   * @public
   */
  public setCacheData = (field: string, data: any): ICacheEntry => {
    if (this.cacheDataExists(field)) {
      this._onCacheDataAlreadyExists({
        data: this._dataCache[field],
        cacheName: this._cacheName,
        expires: this.getCacheDataAge(field) ?? -1,
        field
      })
      return this?._dataCache[field];
    }

    this._dataCache[field] = {
      timestamp: new Date().getTime(),
      data
    };

    this._onCacheDataAdd({
      data: this._dataCache[field],
      cacheName: this._cacheName,
      expires: this.getCacheDataAge(field) ?? -1,
      field
    });

    const deleteTimeout = this._cacheMaxAgeInSeconds * 1000;
    setTimeout(() => {
      this._onCacheDataExpired({
        data: this._dataCache[field],
        cacheName: this._cacheName,
        expires: this.getCacheDataAge(field) ?? -1,
        field
      });
      delete this._dataCache[field];
    }, deleteTimeout);
    return this?._dataCache[field];
  };
}

export default CacheManager;