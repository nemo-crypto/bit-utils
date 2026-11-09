# 从零搭建：六节实践课

每节都按“阅读 → 修改 → 验证”的顺序学习。完整通关命令为 `npm run check && npm run demo`。

## 1. 建立工程与公共入口

阅读 package.json、tsconfig.json、src/index.ts。理解 private、exports、NodeNext、strict、declaration 各自解决什么问题。

执行 `npm ci && npm run build`，查看 dist 中的 JS 与声明文件。练习故意制造一个类型错误：构建应以非零状态退出。修正后再构建，不把失败当成功。

## 2. 编写可测试的纯函数

阅读 core/clamp.ts、core/chunk.ts 和 tests/core.test.mjs。观察参数边界、readonly 输入与新数组返回值。

练习增加 `unique<T>(items: readonly T[]): T[]`，要求保持首次出现顺序且不修改输入。先写空数组、重复数据、对象引用身份三组测试，再实现并加入公共入口。

## 3. 管理有状态的数据结构

阅读 collections/lru-cache.ts。画出 set(a)、set(b)、get(a)、set(c) 后 Map 的顺序，解释为什么 b 被淘汰。

运行 `npm test`。练习增加不刷新访问顺序的 `peek`，用行为测试证明它与 get 的差别。不要让测试直接读私有 Map。

## 4. 用接口隔离运行环境

从 ports/storage.ts 开始，阅读 MemoryStorage 和 CacheService。将实例注入构造函数，观察服务没有 import 具体存储类。

练习写一个会记录读写次数的 StoragePort 实现。接入同一个 CacheService，验证不修改服务也能替换存储；计数逻辑不应反向进入缓存规则。

## 5. 处理时间和外部数据

阅读 tests/cache.test.mjs。关注到期前 1ms、到期时刻、非法 JSON、错误值类型和配额异常。

练习缓存 `{ name: string }` 对象，编写完整类型守卫。测试 `{ name: 42 }` 被拒绝，不要用 `as T` 绕过校验。使用注入时钟推进时间，禁止依赖真实等待。

## 6. 从消费者视角验证交付

阅读 examples/demo.mjs 和 tests/exports.test.mjs。它们从包名导入构建结果，不绕过入口直接加载 src。

执行 `npm run demo`，解释每行输出。再阅读 CI 文件，确认 CI 与本地使用相同命令。扩展练习是引入一个小型真实消费应用，而不是立刻增加发版、容器或多包架构。

## 验收标准

- 能解释模块依赖方向以及为何使用 StoragePort。
- 新模块有明确的公开 API、边界测试与消费示例。
- 不通过关闭 strict、使用 any 或吞掉异常让检查通过。
- 新克隆的项目可以按 README 安装、构建、测试和运行。
- 能区分编译期类型安全、运行时数据校验与真实环境集成测试。
