/** 分组时保留顺序，不修改原数组；元素本身不会深拷贝。 */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (!Number.isSafeInteger(size) || size <= 0) {
    throw new RangeError('size 必须是正安全整数');
  }
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}
