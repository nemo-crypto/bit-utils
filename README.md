# Bi-Utils · JavaScript / TypeScript 工具库

积累浏览器、DOM、数组、格式化、随机、URL和通用工具，并提供Cache、LRU缓存与队列等数据结构。包名称是 `bi-utils`，目录名称是bit-utils；消费时使用包名。

## 代码与导出

| 入口 | 内容 |
|---|---|
| [src/index.ts](src/index.ts) | 命名导出、默认工具集合和version |
| [src/js/index.ts](src/js/index.ts) | 工具分类汇总 |
| `src/js/` | array、bom、dom、format、random、reg、url、utils |
| `src/class/` | Cache、LRUCache、Queue实现 |
| `scripts/` | 构建、版本与发布脚本 |
| `test/` | 手工演示脚本与页面，未配置统一测试运行器 |

包入口声明为 `dist/index.cjs.js`、`dist/index.esm.js` 和 `dist/index.d.ts`，由Rollup构建。发布包的消费示例：

```ts
import { isBrowser, version } from 'bi-utils';

console.log(isBrowser(), version);
```

浏览器相关函数依赖实际window/document环境，Node场景需按具体实现核对，不能将整个工具集合视为SSR安全。

## 本地准备与已知缺口

构建脚本内部调用pnpm，开发依赖包括TypeScript、ts-node、Rollup与TypeDoc。当前没有锁定文件和Node engines约束，环境版本需由实际验证确定。

**package.json的postinstall和files都引用了根目录postinstall.js，但该文件当前缺失。** 首次检查可暂时跳过生命周期脚本安装依赖，再审查缺失文件与husky配置；这不代表安装问题已经修复。

```bash
pnpm install --ignore-scripts
pnpm run build
```

构建入口的异常处理当前只打印错误，核验时需同时检查终端日志和dist产物，不能仅以退出状态认定构建成功。

## 开发与文档

```bash
pnpm run dev
pnpm run doc
pnpm run lint
```

TypeDoc输出到doc目录。没有test脚本，`test/test.js` 是手工演示代码，不应作为自动化测试通过依据。新增工具需同步入口导出、类型与实际使用示例。

## 发版边界

`release:local` 会修改版本、构建、生成日志、提交并创建tag；`release:online` 会推送并发布npm包。它们属于发布流程，本轮未执行。原始流程记录见 [历史发版说明](docs/original-release-notes.md)，运行前应核对脚本和目标仓库。

本轮完成源码、入口和脚本静态检查，未安装依赖、构建产物或核实公共包发布状态。
