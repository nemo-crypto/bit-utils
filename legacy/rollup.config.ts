import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import dtsPlugin from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

import type { RollupOptions } from 'rollup';
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild';

console.log(`读取了: ${__filename.slice(__dirname.length + 1)}`);

const babelRuntimeVersion = pkg.dependencies['@babel/runtime-corejs3'].replace(
  /^[^0-9]*/,
  ''
);

const allDep = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
].map((name) => RegExp(`^${name}($|/)`)); // 在打包esm和cjs的时候，排除所有依赖，让上层应用去处理（如果不排除就会有重复的polyfill）

const esbuildPlugin = (options?: ESBuildOptions) =>
  esbuild({
    minify: false,
    // sourceMap: true, // 默认就是true
    ...options,
  });

// my-name转化为MyName
export const toPascalCase = (input: string) => {
  const res = input.replace(input[0], input[0].toUpperCase());
  return res.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};

const umdConfig = (prod = false): RollupOptions => ({
  input: './src/index.ts',
  output: {
    format: 'umd',
    file: prod ? 'dist/index.min.js' : 'dist/index.js',
    name: toPascalCase(pkg.name),
    /**
     * exports默认值是auto，可选：default、none。https://rollupjs.org/guide/zh/#exports
     * 如果我们源代码默认导出和具名导出一起使用，编译的时候会报警告(!) Mixing named and default exports
     * 设置exports: 'named'就不会报警告了（实际上只是不会报警告了，设不设置named对实际打包的结果都没影响）
     * 如果我们源代码没有默认导出和具名导出一起使用，但是设置了exports: 'named'，会生成：exports["default"] = BilldUtils;
     * 别人通过cjs导入的话，就得const BilldUtils = require("billd-utils").default;才能拿到默认导出；如果不使用exports: 'named'，
     * 默认会生成：module.exports = BilldUtils;别人通过cjs导入的话，就正常的const BilldUtils = require("billd-utils");即可
     */
    exports: 'named', // babel-utils默认导出和具名导出混用了，因此需要设置exports: 'named'
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    esbuildPlugin({ minify: prod ? true : false }),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码，最好加上它，否则打包umd可能会报错
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
      // 这里面的plugins如果和babel.config.js里的plugins冲突，
      // 会执行这里的plugins，不会执行babel.config.js里的plugins
      plugins: [
        [
          /**
           * @babel/plugin-transform-runtime
           * useBuiltIns和polyfill选项在 v7 中被删除，只是将其设为默认值。
           */
          '@babel/plugin-transform-runtime',
          {
            // absoluteRuntime: false, // boolean或者string，默认为false。
            /**
             * corejs:false, 2,3或{ version: 2 | 3, proposals: boolean }, 默认为false
             * 设置对应值需要安装对应的包：
             * false	npm install --save @babel/runtime
             * 2	npm install --save @babel/runtime-corejs2
             * 3	npm install --save @babel/runtime-corejs3
             */
            corejs: 3,
            /**
             * helpers: boolean, 默认true。在纯babel的情况下：
             * 如果是true，就会把需要他runtime包给引进来，如：import _defineProperty from "@babel/runtime/helpers/defineProperty"
             * 如果是false，就会把需要的runtime包里面的代码给嵌进bundle里，如function _defineProperty(){}
             * 设置false的话，会导致同一个runtime包里面的代码被很多文件设置，产生冗余的代码。而且因为虽然是同一
             * 份runtime包里面的代码，但是他们在不同的文件（模块）里面，都有自己的作用域，因此在使用类似webpack之类的
             * 打包工具打包的时候，不会做优化。因此推荐设置true，这样可以通过静态分析的手段进行打包，减少打包后的代码体积。
             */
            // helpers: true, // 当helpers设置true的时候，babelHelpers需要设置为runtime
            helpers: false, // 当helpers设置false的时候，babelHelpers需要设置为bundled
            // regenerator: true, // 切换生成器函数是否转换为使用不污染全局范围的再生器运行时。默认为true
            version: babelRuntimeVersion,
          },
        ],
      ],
      /**
       * babelHelpers,建议显式配置此选项（即使使用其默认值）
       * runtime: 您应该使用此功能，尤其是在使用汇总构建库时，它结合external使用
       * bundled: 如果您希望生成的捆绑包包含这些帮助程序（每个最多一份），您应该使用它。特别是在捆绑应用程序代码时很有用
       * 如果babelHelpers设置成bundled，@babel/plugin-transform-runtime的helpers得设置false！
       * 如果babelHelpers设置成runtime，@babel/plugin-transform-runtime的helpers得设置true！
       * 在打包esm和cjs时,使用runtime,并且配合external;在打包umd时,使用bundled,并且不要用external,如果打包umd时使
       * 用了runtime但是没有配置external，会导致打包重复的polyfill，虽然打包的时候不报错，但是引入包使用的时候会报错
       */
      babelHelpers: 'bundled', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
      // babelHelpers: 'runtime', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
    }),
    json(),
    prod && terser(),
  ].filter(Boolean),
});

export default defineConfig([
  // esm
  {
    input: './src/index.ts',
    output: {
      format: 'esm',
      file: 'dist/index.esm.js',
    },
    external: allDep,
    plugins: [
      /**
       * @rollup/plugin-commonjs插件主要是将commonjs转换为esm
       * @rollup/plugin-commonjs一般和@rollup/plugin-node-resolve一起使用
       * @babel/plugin-transform-runtime使用corejs:3（即@babel/runtime-corejs3），
       * 而@babel/runtime-corejs3源码是使用commonjs规范写的，因此需要添加@rollup/plugin-commonjs插件
       * 让rollup支持commonjs 规范，识别 commonjs 规范的依赖。
       * 打包esm和cjs时，当前的billd-monorepo里面的源码基本都没有依赖第三方的包，并且排除了所有外部依赖，因此
       * 这里其实不需要用@rollup/plugin-commonjs插件
       * @rollup/plugin-commonjs和@rollup/plugin-babel一起用的使用，先使用@rollup/plugin-commonjs,再用@rollup/plugin-babel
       * https://github.com/rollup/plugins/blob/master/packages/babel/README.md#using-with-rollupplugin-commonjs
       */
      commonjs(),
      /**
       * @rollup/plugin-node-resolve只对引入node_modules包的代码起作用
       * 不使用@rollup/plugin-node-resolve插件的话,import { ref } from 'vue';就不会把node_modules包
       * 里的vue的ref的代码引进来，而是会原封不动的把import { ref } from 'vue';放到打包的代码里面;
       * 使用@rollup/plugin-node-resolve插件的话,会将node_modules包里的vue的ref的代码都引进来
       * 打包esm和cjs时，当前的billd-monorepo里面的源码基本都没有依赖第三方的包，并且排除了所有外部依赖，因此
       * 这里其实不需要用@rollup/plugin-node-resolve插件
       */
      nodeResolve(),
      esbuildPlugin(),
      json(),
      babel({
        exclude: 'node_modules/**', // 只编译我们的源代码，最好加上它，否则打包umd可能会报错
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
        // 这里面的plugins如果和babel.config.js里的plugins冲突，
        // 会执行这里的plugins，不会执行babel.config.js里的plugins
        plugins: [
          [
            /**
             * @babel/plugin-transform-runtime
             * useBuiltIns和polyfill选项在 v7 中被删除，只是将其设为默认值。
             */
            '@babel/plugin-transform-runtime',
            {
              // absoluteRuntime: false, // boolean或者string，默认为false。
              /**
               * corejs:false, 2,3或{ version: 2 | 3, proposals: boolean }, 默认为false
               * 设置对应值需要安装对应的包：
               * false	npm install --save @babel/runtime
               * 2	npm install --save @babel/runtime-corejs2
               * 3	npm install --save @babel/runtime-corejs3
               */
              corejs: 3,
              /**
               * helpers: boolean, 默认true。在纯babel的情况下：
               * 如果是true，就会把需要他runtime包给引进来，如：import _defineProperty from "@babel/runtime/helpers/defineProperty"
               * 如果是false，就会把需要的runtime包里面的代码给嵌进bundle里，如function _defineProperty(){}
               * 设置false的话，会导致同一个runtime包里面的代码被很多文件设置，产生冗余的代码。而且因为虽然是同一
               * 份runtime包里面的代码，但是他们在不同的文件（模块）里面，都有自己的作用域，因此在使用类似webpack之类的
               * 打包工具打包的时候，不会做优化。因此推荐设置true，这样可以通过静态分析的手段进行打包，减少打包后的代码体积。
               */
              helpers: true, // 当helpers设置true的时候，babelHelpers需要设置为runtime
              // helpers: false, // 当helpers设置false的时候，babelHelpers需要设置为bundled
              // regenerator: true, // 切换生成器函数是否转换为使用不污染全局范围的再生器运行时。默认为true
              version: babelRuntimeVersion,
            },
          ],
        ],
        /**
         * babelHelpers,建议显式配置此选项（即使使用其默认值）
         * runtime: 您应该使用此功能，尤其是在使用汇总构建库时，它结合external使用
         * bundled: 如果您希望生成的捆绑包包含这些帮助程序（每个最多一份），您应该使用它。特别是在捆绑应用程序代码时很有用
         * 如果babelHelpers设置成bundled，@babel/plugin-transform-runtime的helpers得设置false！
         * 如果babelHelpers设置成runtime，@babel/plugin-transform-runtime的helpers得设置true！
         * 在打包esm和cjs时,使用runtime,并且配合external;在打包umd时,使用bundled,并且不要用external,如果打包umd时使
         * 用了runtime但是没有配置external，会导致打包重复的polyfill，虽然打包的时候不报错，但是引入包使用的时候会报错
         */
        // babelHelpers: 'bundled', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
        babelHelpers: 'runtime', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
      }),
    ],
  },
  // cjs
  {
    input: './src/index.ts',
    output: {
      format: 'cjs',
      file: 'dist/index.cjs.js',
      /**
       * exports默认值是auto，可选：default、none。https://rollupjs.org/guide/zh/#exports
       * 如果我们源代码默认导出和具名导出一起使用，编译的时候会报警告(!) Mixing named and default exports
       * 设置exports: 'named'就不会报警告了（实际上只是不会报警告了，设不设置named对实际打包的结果都没影响）
       * 如果我们源代码没有默认导出和具名导出一起使用，但是设置了exports: 'named'，会生成：exports["default"] = BilldUtils;
       * 别人通过cjs导入的话，就得const BilldUtils = require("billd-utils").default;才能拿到默认导出；如果不使用exports: 'named'，
       * 默认会生成：module.exports = BilldUtils;别人通过cjs导入的话，就正常的const BilldUtils = require("billd-utils");即可
       */
      exports: 'named', // babel-utils默认导出和具名导出混用了，因此需要设置exports: 'named'
    },
    external: allDep,
    plugins: [
      /**
       * @rollup/plugin-commonjs插件主要是将commonjs转换为esm
       * @rollup/plugin-commonjs一般和@rollup/plugin-node-resolve一起使用
       * @babel/plugin-transform-runtime使用corejs:3（即@babel/runtime-corejs3），
       * 而@babel/runtime-corejs3源码是使用commonjs规范写的，因此需要添加@rollup/plugin-commonjs插件
       * 让rollup支持commonjs 规范，识别 commonjs 规范的依赖。
       * 打包esm和cjs时，当前的billd-monorepo里面的源码基本都没有依赖第三方的包，并且排除了所有外部依赖，因此
       * 这里其实不需要用@rollup/plugin-commonjs插件
       * @rollup/plugin-commonjs和@rollup/plugin-babel一起用的使用，先使用@rollup/plugin-commonjs,再用@rollup/plugin-babel
       * https://github.com/rollup/plugins/blob/master/packages/babel/README.md#using-with-rollupplugin-commonjs
       */
      commonjs(),
      /**
       * @rollup/plugin-node-resolve只对引入node_modules包的代码起作用
       * 不使用@rollup/plugin-node-resolve插件的话,import { ref } from 'vue';就不会把node_modules包
       * 里的vue的ref的代码引进来，而是会原封不动的把import { ref } from 'vue';放到打包的代码里面;
       * 使用@rollup/plugin-node-resolve插件的话,会将node_modules包里的vue的ref的代码都引进来
       * 打包esm和cjs时，当前的billd-monorepo里面的源码基本都没有依赖第三方的包，并且排除了所有外部依赖，因此
       * 这里其实不需要用@rollup/plugin-node-resolve插件
       */
      nodeResolve(),
      esbuildPlugin(),
      json(),
      babel({
        exclude: 'node_modules/**', // 只编译我们的源代码，最好加上它，否则打包umd可能会报错
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
        // 这里面的plugins如果和babel.config.js里的plugins冲突，
        // 会执行这里的plugins，不会执行babel.config.js里的plugins
        plugins: [
          [
            /**
             * @babel/plugin-transform-runtime
             * useBuiltIns和polyfill选项在 v7 中被删除，只是将其设为默认值。
             */
            '@babel/plugin-transform-runtime',
            {
              // absoluteRuntime: false, // boolean或者string，默认为false。
              /**
               * corejs:false, 2,3或{ version: 2 | 3, proposals: boolean }, 默认为false
               * 设置对应值需要安装对应的包：
               * false	npm install --save @babel/runtime
               * 2	npm install --save @babel/runtime-corejs2
               * 3	npm install --save @babel/runtime-corejs3
               */
              corejs: 3,
              /**
               * helpers: boolean, 默认true。在纯babel的情况下：
               * 如果是true，就会把需要他runtime包给引进来，如：import _defineProperty from "@babel/runtime/helpers/defineProperty"
               * 如果是false，就会把需要的runtime包里面的代码给嵌进bundle里，如function _defineProperty(){}
               * 设置false的话，会导致同一个runtime包里面的代码被很多文件设置，产生冗余的代码。而且因为虽然是同一
               * 份runtime包里面的代码，但是他们在不同的文件（模块）里面，都有自己的作用域，因此在使用类似webpack之类的
               * 打包工具打包的时候，不会做优化。因此推荐设置true，这样可以通过静态分析的手段进行打包，减少打包后的代码体积。
               */
              helpers: true, // 当helpers设置true的时候，babelHelpers需要设置为runtime
              // helpers: false, // 当helpers设置false的时候，babelHelpers需要设置为bundled
              // regenerator: true, // 切换生成器函数是否转换为使用不污染全局范围的再生器运行时。默认为true
              version: babelRuntimeVersion,
            },
          ],
        ],
        /**
         * babelHelpers,建议显式配置此选项（即使使用其默认值）
         * runtime: 您应该使用此功能，尤其是在使用汇总构建库时，它结合external使用
         * bundled: 如果您希望生成的捆绑包包含这些帮助程序（每个最多一份），您应该使用它。特别是在捆绑应用程序代码时很有用
         * 如果babelHelpers设置成bundled，@babel/plugin-transform-runtime的helpers得设置false！
         * 如果babelHelpers设置成runtime，@babel/plugin-transform-runtime的helpers得设置true！
         * 在打包esm和cjs时,使用runtime,并且配合external;在打包umd时,使用bundled,并且不要用external,如果打包umd时使
         * 用了runtime但是没有配置external，会导致打包重复的polyfill，虽然打包的时候不报错，但是引入包使用的时候会报错
         */
        // babelHelpers: 'bundled', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
        babelHelpers: 'runtime', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
      }),
    ],
  },
  // .d.ts
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.d.ts',
      name: pkg.name,
    },
    plugins: [dtsPlugin()],
  },
  // umd
  umdConfig(),
  // umd prod
  umdConfig(true),
]);
