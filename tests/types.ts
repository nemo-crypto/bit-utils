import { CacheService, LRUCache, MemoryStorage, chunk } from 'bi-utils';
import type { StoragePort } from 'bi-utils';
import { createBrowserStorage } from 'bi-utils/browser';

// 从消费方验证生成的声明文件，而不是绕过 exports 导入源码。
const grouped: number[][] = chunk([1, 2, 3] as const, 2);
void grouped;

const lru = new LRUCache<string, number>(2);
lru.set('count', 1);
const count: number | undefined = lru.get('count');
void count;
// @ts-expect-error 键必须符合泛型约束。
lru.set(1, 1);
// @ts-expect-error 值必须符合泛型约束。
lru.set('count', 'one');

const storage: StoragePort = new MemoryStorage();
const cache = new CacheService<string>({
  storage: createBrowserStorage(storage),
  isValue: (value): value is string => typeof value === 'string',
});
cache.set('lesson', 'TypeScript', 1000);
const value: string | null = cache.get('lesson');
void value;
// @ts-expect-error 缓存值必须匹配运行时校验器声明的类型。
cache.set('lesson', 42, 1000);
