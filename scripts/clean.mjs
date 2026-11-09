import { rm } from 'node:fs/promises';

// 路径相对于脚本定位，不依赖调用者所在目录。
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
