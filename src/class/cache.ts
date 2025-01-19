// TIP: ctrl+cmd+t,生成函数注释
import { debugLog } from '../utils/index';

export class CacheModel {
  prefix = '';

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  handlePrefix = (key: string) => {
    if (this.prefix === '') {
      return key;
    } else {
      return `${this.prefix}${key}`;
    }
  };

  getItem = (key: string) => {
    return localStorage.getItem(this.handlePrefix(key));
  };

  setItem = (key: string, value: any) => {
    return localStorage.setItem(this.handlePrefix(key), value);
  };

  removeItem = (key: string) => {
    return localStorage.removeItem(this.handlePrefix(key));
  };

  /**
   * @description 获取缓存
   * @param {string} key
   * @return {*}
   */
  getStorage = <T>(key: string): T | null => {
    try {
      const res = this.getItem(key);
      if (res) {
        const data = JSON.parse(res);
        // 如果createTime没有值，则判断该缓存不合法；清除
        if (!data.createTime) {
          this.clearStorage(key);
          return null;
        } else {
          return data.value;
        }
      }
      return null;
    } catch (error) {
      debugLog('error', error);
      this.clearStorage(key);
      return null;
    }
  };

  /**
   * @description 设置缓存
   * @param {*} key
   * @param {*} value
   */
  setStorage = (key: string, value: any) => {
    try {
      const createTime = +new Date();
      this.setItem(key, JSON.stringify({ value, createTime }));
    } catch (error) {
      debugLog('error', error);
      this.clearStorage(key);
    }
  };

  /**
   * @description 清除缓存
   * @param {*} key
   */
  clearStorage = (key: string) => {
    try {
      this.removeItem(key);
    } catch (error) {
      debugLog('error', error);
    }
  };

  /**
   * @description 获取缓存,如果缓存已过期,会清除该缓存,并返回null
   * @param {*} key
   */
  getStorageExp = <T>(key: string): T | null => {
    try {
      const res = this.getItem(key);
      if (res) {
        const data = JSON.parse(res);
        const expireTime = data.expireTime;
        const isExpired = expireTime < +new Date();
        // 如果expireTime没有值，则判断该缓存不合法；清除
        // 如果expireTime有值，但小于当前时间，则代表已过期；清除
        if (!expireTime || isExpired) {
          this.clearStorage(key);
          return null;
        } else {
          return data.value;
        }
      }
      return null;
    } catch (error) {
      debugLog('error', error);
      this.clearStorage(key);
      return null;
    }
  };

  /**
   * @description 设置缓存以及缓存时长
   * @param {*} key
   * @param {*} value
   * @param {*} expires 缓存时长,单位:小时
   */
  setStorageExp = (key: string, value: any, expires: number) => {
    try {
      if ([key, value, expires].includes(undefined)) {
        debugLog('error', '请检查传入的参数！');
        return;
      }
      const createTime = +new Date();
      const expireTime = createTime + expires * 60 * 60 * 1000;
      this.setItem(key, JSON.stringify({ value, createTime, expireTime }));
    } catch (error) {
      debugLog('error', error);
      this.clearStorage(key);
    }
  };
}
