import assert from 'node:assert/strict';
import test from 'node:test';
import { LRUCache } from 'bi-utils';

test('读取刷新最近访问顺序，淘汰最久未访问的键', () => {
  const cache = new LRUCache(2);
  cache.set('a', 1);
  cache.set('b', 2);
  assert.equal(cache.get('a'), 1);
  cache.set('c', 3);
  assert.equal(cache.has('b'), false);
  assert.equal(cache.get('a'), 1);
  assert.equal(cache.size, 2);
});

test('更新不增加容量，undefined 值通过 has 区别于缺失', () => {
  const cache = new LRUCache(2);
  cache.set('a', undefined);
  cache.set('b', 2);
  cache.set('a', undefined);
  cache.set('c', 3);
  assert.equal(cache.has('a'), true);
  assert.equal(cache.get('a'), undefined);
  assert.equal(cache.has('b'), false);
  assert.equal(cache.delete('a'), true);
  cache.clear();
  assert.equal(cache.size, 0);
});

test('容量 1 可用，非正整数容量被拒绝', () => {
  const cache = new LRUCache(1);
  cache.set(undefined, false);
  cache.set('new', 0);
  assert.equal(cache.has(undefined), false);
  assert.equal(cache.get('new'), 0);
  for (const value of [0, -1, 1.1, NaN, Infinity]) {
    assert.throws(() => new LRUCache(value), RangeError);
  }
});
