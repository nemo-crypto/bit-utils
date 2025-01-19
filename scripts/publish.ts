import { execSync } from 'child_process';

import pkg from '../package.json';
import { chalkERROR, chalkSUCCESS } from './utils';

const command = 'npm publish';

// git push
execSync(`git push origin v${pkg.version}`, { stdio: 'inherit' });
execSync(`git push`, { stdio: 'inherit' });

try {
  execSync(command, {
    stdio: 'inherit',
  });
  console.log(chalkSUCCESS(`发布${pkg.name}@${pkg.version}成功！`));
} catch (error) {
  console.log(error);
  console.log(chalkERROR(`发布${pkg.name}@${pkg.version}失败！`));
}
