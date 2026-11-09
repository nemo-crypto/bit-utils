/**
 * @description 数组去重，缺点不能去除{}
 * @param {Array} arr
 * @return {*} 不修改原数组，返回新数组
 */
export const arrayUnique = (arr: Array<any>) => {
  return [...new Set(arr)];
};

/**
 * @description 洗牌算法
 * @param {Array} arr
 * @return {*} 不修改原数组，返回新数组
 */
export const arrayShuffle = (arr: Array<any>) => {
  const result = [...arr];
  for (let i = result.length - 1; i >= 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1)); // 随机下标
    const randomVal = result[randomIndex]; // 随机下标的值
    // 互换位置
    result[randomIndex] = result[i];
    result[i] = randomVal;
  }
  return result;
};

/**
 * @description 获取数组交集
 * @param {any} a
 * @param {any} b
 * @return {*}
 */
export const getArrayIntersection = (a: any[], b: any[]) => {
  return a.filter((v) => {
    return b.indexOf(v) > -1;
  });
};

/**
 * @description 获取数组的对称差集（不修改原数组）
 * @example
 * a[1,2,3,4,5],b[3,4,5,6,7],a和b的对称差集:getArraySymmetricDifference(a,b) ===> [1,2,6,7]
 * @param {any} a
 * @param {any} b
 * @return {*}
 */
export function getArraySymmetricDifference(arr1: any[], arr2: any[]) {
  const result: any[] = [];
  const diff = arr1.filter((x) => !arr2.includes(x));
  const diff2 = arr2.filter((x) => !arr1.includes(x));
  result.push(...diff);
  result.push(...diff2);
  return result;
}

/**
 * @description 获取数组差集（不修改原数组）
 * @example
 * a[1,2,3,4,5],b[2,4,6,8,10],a和b的差集:getArrayDifference(a,b) ===> [1,3,5]
 * a[1,2,3,4,5],b[2,4,6,8,10],b和a的差集:getArrayDifference(b,a) ===> [6,8,10]
 * @param {any} a
 * @param {any} b
 * @return {*}
 */
export const getArrayDifference = (a: any[], b: any[]) => {
  return a.filter((v) => {
    return b.indexOf(v) === -1;
  });
};

