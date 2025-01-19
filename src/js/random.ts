/**
 * @description 获取[min,max]之间的随机整数。
 * @example: getRangeRandom(-10,100) ===> -8
 * @param {number} min
 * @param {number} max
 * @return {*}
 */
export const getRangeRandom = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * @description: 随机数组的一个元素
 * @example: getRandomOne([10,2,4,6]) ===> 6
 * @param {any} arr
 * @return {*}
 */
export const getRandomOne = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * @description 获取随机字符串(ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789)
 * @example: getRandomString(4) ===> abd3
 * @param {number} length
 * @return {*}
 */
export const getRandomString = (length: number): string => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';
  for (let i = 0; i < length; i += 1) {
    res += str.charAt(getRangeRandom(0, str.length - 1));
  }
  return res;
};

/**
 * @description: 获取随机整数
 * @example: getRandomInt(4) ===> 3251
 * @param {*} length
 * @return {*}
 */
export const getRandomInt = (length) => {
  if (length > 16 || length < 1) throw new Error('length的范围:[1,16]');
  let num = +`${Math.random()}`.slice(2, 2 + length);
  if (String(num).length !== length) {
    num = getRandomInt(length);
  }
  return num;
};
