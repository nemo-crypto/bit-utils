<h1 align="center">
  Bi-Utils
</h1>

<p align="center">
  基于rollup + pnpm + esbuild搭建的Bi-Utils
</p>

# 简介

积累常用的 js 方法

# 安装

```sh
npm install bi-utils
```

# 使用

```ts
import { isBrowser } from 'bi-utils';

console.log(isBrowser());
```

# 本地调试

> 本地调试不会构建 umd

```sh
pnpm run dev
```

# 本地构建

```sh
pnpm run build
```

# 生成文档

> 使用 [typedoc](https://typedoc.org/) 生成，文档会生成在项目根目录的 doc 目录

```sh
pnpm run doc
```

# 发版

## 0.确保 git 工作区干净

即确保本地的修改已全部提交（git status 的时候会显示：`nothing to commit, working tree clean` ），否则会导致执行 `release:local` 脚本失败

## 1.执行本地发版脚本

```sh
pnpm run release:local
```

> 该脚本内部会做以下事情：

1. 根据用户选择的版本，更新 package.json 的 version
2. 开始构建
3. 对比当前版本与上个版本的差异，生成 changelog日志
4. 提交暂存区到本地仓库：git commit -m 'chore(release): v 当前版本'
5. 生成当前版本 tag：git tag v 当前版本

## 2.执行线上发版脚本

```sh
pnpm run release:online
```

> 该脚本内部会做以下事情：

1. 提交当前版本：git push
2. 提交当前版本 tag：git push origin v 当前版本
3. 发布到 npm
