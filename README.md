# Bit Utils · TypeScript 工具库架构教学 Demo

从一个小型工具库学习工程框架搭建：**模块分层 → 公共 API → 环境适配 → 类型约束 → 构建产物 → 自动化测试 → CI**。重点是理解每层的职责，不是收集更多工具函数。

新主线是 `private` 的 ESM 教学项目，包名仍为 `bi-utils`。历史实现已移入 [legacy](legacy/README.md)，不参与构建；这次是教学版重构，不是旧 API 的兼容升级。

<!-- BEGIN project-discovery -->
## 项目定位与实践入口

TypeScript utility library architecture tutorial with pure functions, LRU cache, TTL caching and storage adapters. ESM 工具库教学：类型设计、构建、测试与 CI。

适合从以下入口阅读实现与接入条件：

- [LRU 缓存与集合](src/collections/)
- [环境适配](src/adapters/)
- [架构设计](docs/architecture.md)
<!-- END project-discovery -->

## 五分钟运行

使用 Node.js 24（最低 22）与 npm；版本记录在 `.nvmrc` 和 `package.json`。

```sh
nvm use                    # 未安装 nvm 时自行使用 Node 24
npm ci                     # 按 package-lock.json 安装唯一开发依赖 TypeScript
npm run check              # 类型检查、构建、运行自动化测试
npm run demo               # 运行完整命令行示例
```

Demo 会输出纯函数分组、LRU 淘汰结果，以及缓存从有效到到期的变化。示例使用注入时钟，不等待真实时间，不需要浏览器、后端或密钥。

## 目录与阅读顺序

```text
bit-utils/
├── src/
│   ├── core/              # clamp / chunk：纯函数与边界条件
│   ├── collections/       # LRUCache：泛型、封装与状态
│   ├── ports/             # StoragePort：最小能力契约
│   ├── services/          # CacheService：TTL、校验、序列化规则
│   ├── adapters/          # MemoryStorage / 浏览器存储适配
│   ├── index.ts           # 主入口，不依赖浏览器全局
│   └── browser.ts         # 浏览器适配子入口
├── examples/              # 消费实际构建产物的示例
├── tests/                 # 使用 node:test 验证公开行为
├── scripts/               # 仅清理生成目录
├── docs/                  # 架构、课程与迁移说明
├── legacy/                # 历史源码对照，不参与主线
└── .github/workflows/     # 与本地同命令的 CI
```

建议先阅读 [架构设计](docs/architecture.md)，再按 [课程路线](docs/learning-path.md) 实操；旧使用方查看 [迁移说明](docs/migration.md)。

## 核心示例

```ts
import { CacheService, MemoryStorage } from 'bi-utils';

const cache = new CacheService<string>({
  storage: new MemoryStorage(),
  isValue: (value): value is string => typeof value === 'string',
});

cache.set('lesson', '依赖倒置', 5_000); // 毫秒
console.log(cache.get('lesson'));      // string | null
```

缓存服务只依赖 `StoragePort`，不直接访问 localStorage。浏览器应用中可以显式注入：

```ts
import { CacheService } from 'bi-utils';
import { createBrowserStorage } from 'bi-utils/browser';

const cache = new CacheService<string>({
  storage: createBrowserStorage(window.localStorage),
  isValue: (value): value is string => typeof value === 'string',
});
```

访问 `window.localStorage` 应放在浏览器生命周期内；浏览器禁用存储、配额不足等异常会向调用方传播。上面的包名导入用于本仓库自引用或接入构建器的应用，不能直接复制到未配置 import map 的裸 HTML 页面中。

## 命令

| 命令 | 用途 |
| --- | --- |
| `npm run typecheck` | 严格检查源码，不生成文件 |
| `npm run build` | 清理 dist，输出 ESM、声明文件与 source map |
| `npm run dev` | TypeScript watch，持续编译；不是 Web 服务 |
| `npm test` | 重新构建并运行公开 API 测试 |
| `npm run check` | 类型检查 + 构建 + 测试 |
| `npm run demo` | 构建并运行教学示例 |
| `npm run clean` | 只清理当前项目的 dist |

构建失败会返回非零退出码，没有安装后钩子、自动提交、推送或发布命令。CI 执行 `npm ci`、`npm run check` 和 `npm run demo`。

## 学习边界

仅保留一项开发依赖 TypeScript，运行时代码无第三方依赖；测试使用 Node 内置测试器。暂不引入 Monorepo、DI 容器、打包器、自动发版或 UI 框架，避免基础课程被工具配置淹没。

本项目输出现代 ESM，不提供旧 UMD、CommonJS 及 polyfill。LRU 的 `get` 会更新访问顺序，`has` 不会；缺失返回 undefined，可用 `has` 区分已存储的 undefined。缓存按访问时清理过期值，没有后台清扫或容量控制；它不是生产级分布式缓存。

缓存值必须能 JSON 序列化并通过运行时校验。Date、Map、循环引用及会被 JSON 丢弃的属性需要额外设计编解码；TypeScript 类型参数不能保证外部 JSON 数据安全。
