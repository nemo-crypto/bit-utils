import { CacheService, LRUCache, MemoryStorage, chunk, clamp } from 'bi-utils';

console.log('1. 纯函数：分页大小', clamp(200, 1, 100));
console.log('2. 泛型分组：', chunk(['A', 'B', 'C', 'D', 'E'], 2));

const recent = new LRUCache(2);
recent.set('a', '课程 A');
recent.set('b', '课程 B');
recent.get('a');
recent.set('c', '课程 C');
console.log('3. LRU：A 被访问后保留，B 被淘汰', recent.has('a'), recent.has('b'));

// 注入时钟，无需真实等待即可演示过期边界。
let now = 1000;
const cache = new CacheService({
  storage: new MemoryStorage(),
  isValue: (value) => typeof value === 'string',
  now: () => now,
});
cache.set('lesson', '依赖倒置与可测试性', 500);
console.log('4. TTL 缓存：', cache.get('lesson'));
now += 500;
console.log('5. 到期自动清理：', cache.get('lesson'));
