import moment from 'moment-timezone';
import has from 'lodash/has';
import get from 'lodash/get';

export interface ICacheManagerDataCache {
  timestamp: number,
  data: {
    [key: string]: any
  }
}

export interface ICacheManager {
  getAllCachedData: () => void;
  getNonExpiredData: () => ICacheManagerDataCache;
  getExpiredData: () => ICacheManagerDataCache;
  getCacheData: (field: string) => ICacheManagerDataCache;
  setCacheData: (field: string, data: any) => ICacheManagerDataCache;
  cacheDataExists: (field: string) => boolean;
  getCacheDataAge: (field: string, unitOfTime: moment.unitOfTime.All) => number;
  hasCacheExpired: (field: string) => boolean;
  cacheDataIsValid: (field: string) => boolean;
  setDebug: () => this;
  enableDebugLogs: () => this;
  disableDebugLogs: () => this;
  enableNativeDate: () => this;
}

class CacheManager implements ICacheManager {
  private dataCache;
  private cacheMaxAgeValue;
  private cacheMaxAgeUnit;
  private showDebug;
  private useNativeDate;

  /**
   * @param {boolean} useNativeDate Whether to use native JS date or to use momentJS
   * @param {number} cacheMaxAgeValue The maximum age of the cached data (in cacheMaxAgeUnit)
   * @param {number} cacheMaxAgeUnit The unit which cacheMaxAgeValue should operate at
   * @param {string} timezone The timezone which timestamps should be set in - only applies when not using native JS
   * @implements {ICacheManager} ICacheManager instance
   */
  constructor(useNativeDate = false, cacheMaxAgeValue: number = 30, cacheMaxAgeUnit: moment.unitOfTime.All = 'seconds', timezone: string = 'Europe/London'){
    this.dataCache  = {};
    this.cacheMaxAgeValue = cacheMaxAgeValue;
    this.cacheMaxAgeUnit = cacheMaxAgeUnit;
    this.useNativeDate = useNativeDate;
    // moment.tz.setDefault(timezone)
  }

  /**
   * @description Enables JS native date. It is not possible to go back to moment format once this is set!
   * @returns {this} The cache manager instance
   */
  enableNativeDate(): this {
    this.useNativeDate = true;
    return this;
  }


  /**
   * @description Alias of this.enableDebugLogs. This method is deprecated - please use enableDebugLogs().
   * @returns {this} The cache manager instance
   * @deprecated This method is deprecated - please use enableDebugLogs()
   */
  setDebug():this{
    console.log("This method is deprecated. Please use enableDebugLogs()")
    return this.enableDebugLogs();
  }

  /**
   * @description Enables debug logs.
   * @returns {this} The cache manager instance
   */
  enableDebugLogs(): this {
    this.showDebug = true;
    return this;
  }

  /**
   * @description Disables debug logs.
   * @returns {this} The cache manager instance
   */
  disableDebugLogs(): this {
    this.showDebug = true;
    return this;
  }

  /**
   * @description Allow retrieval of all cached data
   * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
   */
  getAllCachedData(): ICacheManagerDataCache {
    if(this.showDebug){
      console.log("getAllCachedData")
    };
    return this.dataCache;
  }

  /**
   * @description Allow retrieval of all cached data which hasn't expired
   * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
   */
  getNonExpiredData(): ICacheManagerDataCache {
    if(this.showDebug){
      console.log("getNonExpiredData")
    };
    return {
      timestamp: this.dataCache.timestamp,
      data: Object.entries(this.dataCache.data).filter(([cacheKey, cacheEntry]) => !this.hasCacheExpired(cacheKey))
    }
  }

  /**
   * @description Allow retrieval of all cached data which has expired
   * @returns {ICacheManagerDataCache} The object which contains the timestamp and data
   */
  getExpiredData(): ICacheManagerDataCache {
    if(this.showDebug){
      console.log("getExpiredData")
    };
    return {
      timestamp: this.dataCache.timestamp,
      data: Object.entries(this.dataCache.data).filter(([cacheKey, cacheEntry]) => !this.hasCacheExpired(cacheKey))
    }
  }

  /**
   * @description Retrieves some data from the cache
   * @param {string} field The key of the data which should be returned
   * @returns {ICacheManagerDataCache} The data which you cached with this key
   */
  getCacheData(field: string): ICacheManagerDataCache {
    if(this.showDebug){
      console.log("getCacheData", field)
    };
    return get(this, `dataCache[${field}]`, this.getAllCachedData());
  }

  /**
   * @description Sets some data in the cache
   * @param {string} field The key by which data should be stored
   * @param {any} data The data you wish to store. Can be any type.
   * @returns {ICacheManagerDataCache} The data which has been cached, including it's timestamp
   */
  setCacheData(field: string, data: any): ICacheManagerDataCache{
    if(this.showDebug){
      console.log("setCacheData", field)
    };
    this.dataCache[field] = {
      timestamp: (this.useNativeDate) ? new Date().getTime() : moment(),
      data: data
    }
    return this.dataCache[field];
  }

  /**
   * @description Tells us if some of our data already exists in the cache by passing it's key
   * @param {string} field The key we want to check for existance of data
   * @returns {boolean} Does the data exist in the cache or not
   */
  cacheDataExists(field: string): boolean {
    if(this.showDebug){
      console.log("cacheDataExists", field)
    };
    return has(this, `dataCache[${field}]`);
  }
  
  /**
   * @description Tells us how old some of our cached data is
   * @param {string} field The key of the data we want to check the age of (i.e. it's age in the cache)
   * @returns {number} The number, in seconds, since the timestampe was last modified (i.e. since the data was updates or places into the cache)
   */
  getCacheDataAge(field: string): number {
    if(this.showDebug){
      console.log("getCacheDataAge", field)
    };
    return (this.useNativeDate)
      ? (new Date().getTime()-this.dataCache[field].timestamp)
      : moment().diff(moment(this.dataCache[field].timestamp), this.cacheMaxAgeUnit, true);
  }

  /**
   * @description Allows checking if some of our cached data has expired
   * @param {string} field The key we want to check for expiry (i.e. is it older than our cacheMaxAgeValue)
   * @returns {boolean} Has our cached data expired?
   */
  hasCacheExpired(field: string): boolean {
    if(this.showDebug){
      console.log("hasCacheExpired", field, this.dataCache[field].timestamp);
    };
    return (this.useNativeDate)
      ? (new Date().getTime()-this.dataCache[field].timestamp) > this.cacheMaxAgeUnit
      : moment().diff(moment(this.dataCache[field].timestamp), this.cacheMaxAgeUnit, true) > this.cacheMaxAgeValue;
  }

  /**
   * @description Checks if some of our cached data is present and not expired
   * @param {string} field The key we want to check the validity of (i.e. it is present in the cache, and it has not expired)
   * @returns {boolean} Is our cached data present, and is it not expired? (true: present and not expired, false, not present or has expired)
   */
  cacheDataIsValid(field: string): boolean {
    return this.cacheDataExists(field) && this.hasCacheExpired(field);
  }
}

export default CacheManager;