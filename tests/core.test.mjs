import assert from 'node:assert/strict';
import test from 'node:test';
import { chunk, clamp } from 'bi-utils';

test('clamp 保留范围内数值，裁剪边界并拒绝非法输入', () => {
  assert.equal(clamp(5, 1, 10), 5);
  assert.equal(clamp(-1, 1, 10), 1);
  assert.equal(clamp(20, 1, 10), 10);
  for (const args of [[NaN, 0, 1], [1, 0, Infinity], [1, 2, 0]]) {
    assert.throws(() => clamp(...args), RangeError);
  }
});

test('chunk 保留顺序、不修改输入，支持空数组', () => {
  const input = Object.freeze([1, 2, 3, 4, 5]);
  assert.deepEqual(chunk(input, 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(chunk([], 3), []);
  assert.deepEqual(chunk(input, 99), [[1, 2, 3, 4, 5]]);
  for (const size of [0, -1, 1.5, NaN, Infinity]) {
    assert.throws(() => chunk(input, size), RangeError);
  }
});
