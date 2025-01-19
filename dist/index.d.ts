/**
 * @description 数组去重，缺点不能去除{}
 * @param {Array} arr
 * @return {*} 不修改原数组，返回新数组
 */
declare const arrayUnique: (arr: Array<any>) => any[];

/** 判断是否是ipad */
declare const isIPad: () => boolean;

/**
 * @description 将内容复制到剪切板
 * @param {string} text
 * @return {*}
 */
declare const copyToClipBoard: (text: string) => void;

/**
 * @description 格式化时间
 * @param {number} timetamp
 */
declare const formatDate: (timetamp: number) => {
    year: number;
    month: string | number;
    day: string | number;
    hour: string | number;
    minutes: string | number;
    seconds: string | number;
};

/**
 * @description 获取[min,max]之间的随机整数。
 * @example: getRangeRandom(-10,100) ===> -8
 * @param {number} min
 * @param {number} max
 * @return {*}
 */
declare const getRangeRandom: (min: number, max: number) => number;
/**
 * @description: 随机数组的一个元素
 * @example: getRandomOne([10,2,4,6]) ===> 6
 * @param {any} arr
 * @return {*}
 */
declare const getRandomOne: (arr: any[]) => any;
/**
 * @description 获取随机字符串(ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789)
 * @example: getRandomString(4) ===> abd3
 * @param {number} length
 * @return {*}
 */
declare const getRandomString: (length: number) => string;
/**
 * @description: 获取随机整数
 * @example: getRandomInt(4) ===> 3251
 * @param {*} length
 * @return {*}
 */
declare const getRandomInt: (length: any) => number;

/**
 * @description 正则是否是纯数字（纯整数）
 * @example: isPureNumber(abc) ===> false；isPureNumber(1.23) ===> false；isPureNumber(123) ===> true；
 * @param {string} str
 * @return {*}
 */
declare function isPureNumber(str: string): boolean;
/**
 * @description 正则验证手机号、邮箱是否合法
 * @param {string} str
 * @param {*} type
 * @return {*}
 */
declare const regVerify: (str: string, type: 'phone' | 'email') => boolean;
/**
 * @description 判断字符串的开头和结尾是否有空格,有空格就返回true,否则返回false
 * @param {string} value
 * @return {*}
 */
declare const judgeStringSpace: (value: string) => boolean;

/**
 * @description 获取地址栏参数(注意:请确保url是http://aaa.com/ds/?aa=1&bb=323这样子的)
 * @return {*}
 */
declare const getUrlParams: (key?: string) => any;

/**
 * @description: 字符串编码
 * @param {string} str
 * @return {*}
 */
declare function strBtoa(str: string): string;

declare class CacheModel {
    prefix: string;
    constructor(prefix: string);
    handlePrefix: (key: string) => string;
    getItem: (key: string) => string | null;
    setItem: (key: string, value: any) => void;
    removeItem: (key: string) => void;
    /**
     * @description 获取缓存
     * @param {string} key
     * @return {*}
     */
    getStorage: <T>(key: string) => T | null;
    /**
     * @description 设置缓存
     * @param {*} key
     * @param {*} value
     */
    setStorage: (key: string, value: any) => void;
    /**
     * @description 清除缓存
     * @param {*} key
     */
    clearStorage: (key: string) => void;
    /**
     * @description 获取缓存,如果缓存已过期,会清除该缓存,并返回null
     * @param {*} key
     */
    getStorageExp: <T>(key: string) => T | null;
    /**
     * @description 设置缓存以及缓存时长
     * @param {*} key
     * @param {*} value
     * @param {*} expires 缓存时长,单位:小时
     */
    setStorageExp: (key: string, value: any, expires: number) => void;
}

declare class LRUCache {
    capacity: number;
    data: Map<any, any>;
    constructor(capacity: number);
    get(key: any): any;
    put(key: any, value: any): void;
}

declare class ConcurrentPoll {
    /** 任务队列 */
    tasks: any[];
    /** 最大并发数 */
    max: number;
    total: number;
    delay: number;
    done: () => void;
    constructor({ max, done, delay }: {
        max?: number | undefined;
        done: any;
        delay?: number | undefined;
    });
    addTask(task: any): void;
    run(): Promise<string> | undefined;
}

declare const utils_arrayUnique: typeof arrayUnique;
declare const utils_isIPad: typeof isIPad;
declare const utils_copyToClipBoard: typeof copyToClipBoard;
declare const utils_formatDate: typeof formatDate;
declare const utils_getRangeRandom: typeof getRangeRandom;
declare const utils_getRandomOne: typeof getRandomOne;
declare const utils_getRandomString: typeof getRandomString;
declare const utils_getRandomInt: typeof getRandomInt;
declare const utils_isPureNumber: typeof isPureNumber;
declare const utils_regVerify: typeof regVerify;
declare const utils_judgeStringSpace: typeof judgeStringSpace;
declare const utils_getUrlParams: typeof getUrlParams;
declare const utils_strBtoa: typeof strBtoa;
type utils_CacheModel = CacheModel;
declare const utils_CacheModel: typeof CacheModel;
type utils_LRUCache = LRUCache;
declare const utils_LRUCache: typeof LRUCache;
type utils_ConcurrentPoll = ConcurrentPoll;
declare const utils_ConcurrentPoll: typeof ConcurrentPoll;
declare namespace utils {
  export {
    utils_arrayUnique as arrayUnique,
    utils_isIPad as isIPad,
    utils_copyToClipBoard as copyToClipBoard,
    utils_formatDate as formatDate,
    utils_getRangeRandom as getRangeRandom,
    utils_getRandomOne as getRandomOne,
    utils_getRandomString as getRandomString,
    utils_getRandomInt as getRandomInt,
    utils_isPureNumber as isPureNumber,
    utils_regVerify as regVerify,
    utils_judgeStringSpace as judgeStringSpace,
    utils_getUrlParams as getUrlParams,
    utils_strBtoa as strBtoa,
    utils_CacheModel as CacheModel,
    utils_LRUCache as LRUCache,
    utils_ConcurrentPoll as ConcurrentPoll,
  };
}

declare const version: string;

export { CacheModel, ConcurrentPoll, LRUCache, arrayUnique, copyToClipBoard, utils as default, formatDate, getRandomInt, getRandomOne, getRandomString, getRangeRandom, getUrlParams, isIPad, isPureNumber, judgeStringSpace, regVerify, strBtoa, version };
