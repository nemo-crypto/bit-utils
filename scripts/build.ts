import { execSync } from 'child_process';

import { chalkERROR } from './utils';

const watch = process.argv.includes('--watch');

// rollup打包
const rollupBuild = () => {
  execSync(`pnpm run build:rollup${watch ? ' --watch' : ''}`, {
    stdio: 'inherit',
  });
};

(() => {
  try {
    rollupBuild();
    // npm publish默认会带上根目录的LICENSE、README.md、package.json
    // copyFile();
  } catch (error) {
    console.log(chalkERROR(`！！！本地构建失败！！！`));
    console.log(error);
    console.log(chalkERROR(`！！！本地构建失败！！！`));
  }
})();
