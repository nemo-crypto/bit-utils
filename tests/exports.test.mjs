import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

test('公共入口在没有浏览器全局的 Node 进程中可导入', () => {
  const script = `
    for (const key of ['window', 'document', 'localStorage']) {
      Object.defineProperty(globalThis, key, { get() { throw new Error('访问浏览器全局: ' + key); } });
    }
    const api = await import('bi-utils');
    const browser = await import('bi-utils/browser');
    if (typeof api.CacheService !== 'function' || typeof browser.createBrowserStorage !== 'function') process.exit(1);
  `;
  assert.doesNotThrow(() => execFileSync(process.execPath, ['--input-type=module', '-e', script], { cwd: new URL('../', import.meta.url) }));
});

test('包的内部路径不能绕过 exports 直接导入', async () => {
  await assert.rejects(import('bi-utils/dist/core/clamp.js'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
});
