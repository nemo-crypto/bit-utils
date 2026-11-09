# 从历史工具集合迁移到教学主线

## 本次范围

这次重构将仓库改为 private 教学 Demo，版本标记为 0.1.0。保留包名 bi-utils 方便展示包自引用，不代表原 npm 包已发布新版本，也不承诺旧 API 兼容。

| 历史内容 | 教学版处理 |
| --- | --- |
| src/js、src/class、src/utils | 移入 legacy/src，仅供参考 |
| Rollup、Babel、TypeDoc 配置 | 移入 legacy，主线仅使用 tsc |
| 发布、提交、标签和推送脚本 | 移入 legacy/scripts，主 package.json 不提供这些命令 |
| 手工页面与测试脚本 | 移入 legacy/test 和 legacy/src，新增 node:test |
| 旧 dist | 移除历史产物，主线每次构建重新生成 |
| 旧 workspace 声明 | 移入 legacy，当前为单包项目 |

旧代码可通过基线 `395602b393571f3b17092a348b7fd0d423cfca59` 查阅；源文件也保留在 legacy。该目录不保证独立可执行，历史路径仍以原项目为基础。

## 主要 API 差异

- 只保留命名导出，移除旧默认工具集合、version 及大量浏览器工具。
- 新 LRUCache 使用 `set`，不是旧 `put`；缺失返回 undefined，不是 null。泛型键和值显式约束数据，has 不刷新访问顺序。
- 新 CacheService 替代隐式使用 localStorage 的 CacheModel，必须注入存储与值校验器。TTL 使用毫秒，不是旧 API 的小时。
- 输出为现代 ESM 和类型声明，不再生成 UMD、CJS bundle 或注入 polyfill。旧 require、script 全局变量和 dist 深层路径不属于新入口。
- 当前不提供自动发布、变更日志或 Git hook。

若已有项目消费旧 bi-utils，请继续使用旧版本，逐项迁移 API 并验证业务行为；不要直接覆盖依赖。这里的主线以教学目标为准。
