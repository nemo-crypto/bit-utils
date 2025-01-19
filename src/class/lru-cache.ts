// TIP: ctrl+cmd+t,生成函数注释

export class LRUCache {
  capacity: number;
  data = new Map();

  constructor(capacity: number) {
    if (capacity < 1) throw new Error('capacity必须大于1！');
    this.capacity = capacity;
  }

  get(key) {
    const data = this.data;
    const value = data.get(key);

    // 如果缓存里没有这个key，则返回null
    if (!data.has(key)) return null;

    // 如果缓存里有这个key，则删了旧的缓存，再设置新缓存（目的是让读取的这个key移到最后面）
    data.delete(key);
    data.set(key, value);

    return value;
  }

  put(key, value) {
    const data = this.data;

    if (data.has(key)) {
      // 如果缓存里有，则删了旧的缓存
      data.delete(key);
    }

    // 不管缓存里有没有，put操作都要设置缓存
    data.set(key, value);

    // 最后判断缓存是否超过capacity，如果超过则删掉最久没使用的缓存（也就是第一个）
    if (data.size > this.capacity) {
      data.delete(data.keys().next().value);
    }
  }
}
