/** Map 按插入顺序迭代；每次访问将键移动到末尾。 */
export class LRUCache<K, V> {
  private readonly entries = new Map<K, V>();

  constructor(private readonly capacity: number) {
    if (!Number.isSafeInteger(capacity) || capacity < 1) {
      throw new RangeError('capacity 必须是正安全整数');
    }
  }

  get size(): number {
    return this.entries.size;
  }

  has(key: K): boolean {
    return this.entries.has(key);
  }

  get(key: K): V | undefined {
    if (!this.entries.has(key)) return undefined;
    // has 已确认存在；V 本身也允许包含 undefined。
    const value = this.entries.get(key) as V;
    this.entries.delete(key);
    this.entries.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    this.entries.delete(key);
    this.entries.set(key, value);
    if (this.entries.size > this.capacity) {
      const oldest = this.entries.keys().next();
      if (!oldest.done) this.entries.delete(oldest.value);
    }
  }

  delete(key: K): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}
