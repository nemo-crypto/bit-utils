/** 把有限数值限制在闭区间内；无效输入明确报错。 */
export function clamp(value: number, min: number, max: number): number {
  if (![value, min, max].every(Number.isFinite) || min > max) {
    throw new RangeError('value/min/max 必须是有限数字，且 min <= max');
  }
  return Math.min(max, Math.max(min, value));
}
