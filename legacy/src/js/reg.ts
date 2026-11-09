import { debugLog } from '../utils/index';

/**
 * @description 正则是否是纯数字（纯整数）
 * @example: isPureNumber(abc) ===> false；isPureNumber(1.23) ===> false；isPureNumber(123) ===> true；
 * @param {string} str
 * @return {*}
 */
export function isPureNumber(str: string) {
  const regex = /^\d+$/;
  return regex.test(str);
}

/**
 * @description 正则验证手机号、邮箱是否合法
 * @param {string} str
 * @param {*} type
 * @return {*}
 */
export const regVerify = (str: string, type: 'phone' | 'email') => {
  try {
    switch (type) {
      case 'email':
        // https://ihateregex.io/expr/email
        return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(str);
      case 'phone':
        return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
          str
        );
    }
  } catch (error: any) {
    debugLog('error', error);
    return false;
  }
};

/**
 * @description 判断字符串的开头和结尾是否有空格,有空格就返回true,否则返回false
 * @param {string} value
 * @return {*}
 */
export const judgeStringSpace = (value: string) => {
  const reg1 = /^\s+/g; // 匹配开头空格
  const reg2 = /\s+$/g; // 匹配结尾空格
  if (reg1.test(value) || reg2.test(value)) {
    return true;
  }
  return false;
};
