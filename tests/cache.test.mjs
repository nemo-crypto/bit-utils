import assert from 'node:assert/strict';
import test from 'node:test';
import { CacheService, MemoryStorage } from 'bi-utils';
import { createBrowserStorage } from 'bi-utils/browser';

const isString = (value) => typeof value === 'string';

test('TTL 使用注入时钟，在到期时刻清除数据', () => {
  let now = 0;
  const storage = new MemoryStorage();
  const cache = new CacheService({ storage, isValue: isString, now: () => now });
  cache.set('key', 'value', 100);
  now = 99;
  assert.equal(cache.get('key'), 'value');
  now = 100;
  assert.equal(cache.get('key'), null);
  assert.equal(storage.getItem('demo:key'), null);
  cache.set('immediate', 'value', 0);
  assert.equal(cache.get('immediate'), null);
});

test('损坏 JSON、错误版本或值类型被清除', () => {
  const storage = new MemoryStorage();
  const cache = new CacheService({ storage, isValue: isString, now: () => 0 });
  for (const raw of ['not json', 'null', '{"version":2,"expiresAt":100,"value":"x"}', '{"version":1,"expiresAt":100,"value":42}', '{"version":1,"expiresAt":"100","value":"x"}']) {
    storage.setItem('demo:key', raw);
    assert.equal(cache.get('key'), null);
    assert.equal(storage.getItem('demo:key'), null);
  }
});

test('存储前缀隔离，空字符串等有效值可以往返', () => {
  const storage = new MemoryStorage();
  const a = new CacheService({ storage, isValue: isString, prefix: 'a:', now: () => 0 });
  const b = new CacheService({ storage, isValue: isString, prefix: 'b:', now: () => 0 });
  a.set('key', '', 100);
  b.set('key', 'b', 100);
  assert.equal(a.get('key'), '');
  a.remove('key');
  assert.equal(b.get('key'), 'b');
  assert.equal(new MemoryStorage().getItem('b:key'), null);
});

test('非法 TTL、错误类型、序列化丢失数据明确报错', () => {
  const storage = new MemoryStorage();
  const cache = new CacheService({ storage, isValue: isString, now: () => 0 });
  for (const ttl of [-1, NaN, Infinity]) assert.throws(() => cache.set('key', 'value', ttl), RangeError);
  assert.throws(() => cache.set('key', 42, 100), TypeError);
  const numbers = new CacheService({ storage, isValue: (v) => typeof v === 'number', now: () => 0 });
  assert.throws(() => numbers.set('nan', NaN, 100), TypeError);
  assert.equal(storage.getItem('demo:nan'), null);
});

test('浏览器适配器保留 storage 的 this，存储异常向调用方传播', () => {
  const storage = {
    data: new Map(),
    getItem(key) { return this.data.get(key) ?? null; },
    setItem(key, value) { this.data.set(key, value); },
    removeItem(key) { this.data.delete(key); },
  };
  const adapter = createBrowserStorage(storage);
  const cache = new CacheService({ storage: adapter, isValue: isString });
  cache.set('key', 'value', 1000);
  assert.equal(cache.get('key'), 'value');
  cache.remove('key');
  assert.equal(storage.data.size, 0);
  storage.setItem = () => { throw new Error('quota exceeded'); };
  assert.throws(() => cache.set('key', 'value', 1000), /quota exceeded/);
});
