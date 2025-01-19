import { exec, execSync } from 'child_process';
import path from 'path';

import { readJSONSync, writeJSONSync } from 'fs-extra';
import inquirer from 'inquirer';
import semver from 'semver';

import { chalkERROR, chalkINFO, chalkSUCCESS } from './utils';

const { version: currentVersion } = readJSONSync('package.json'); // 项目根目录的package.json

export const DIR_ROOT = path.resolve(__dirname, '..');
export const DIR_PACKAGES = path.resolve(__dirname, '../packages');

const preId =
  semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0];

const versionChoices = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
];

const inc = (i: string): string => semver.inc(currentVersion, i, preId);
let targetVersion: string;

const selectReleaseVersion = async () => {
  const { release } = await inquirer.prompt([
    {
      type: 'list',
      name: 'release',
      message: 'Select release type',
      choices: versionChoices.map((i) => `${i} (${inc(i)})`),
    },
  ]);
  const pkg = readJSONSync(path.resolve(__dirname, '../package.json')); // 项目根目录的package.json
  targetVersion = release.match(/\((.*)\)/)[1];

  const { confirmRelease } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmRelease',
      default: false,
      message: `Confirm release v${targetVersion}?`,
    },
  ]);

  if (confirmRelease) {
    console.log(chalkINFO(`开始本地发布v${targetVersion}...`));

    // 更新根目录的package.json版本号
    writeJSONSync(
      'package.json',
      { ...pkg, version: targetVersion },
      { spaces: 2 }
    );

    // pnpm run build
    execSync(`pnpm run build`, { stdio: 'inherit' });

    // 生成changelog
    execSync(`pnpm run changelog`, { stdio: 'inherit' });

    // git commit
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m 'chore(release): v${targetVersion}'`, {
      stdio: 'inherit',
    });

    // git tag
    execSync(`git tag v${targetVersion}`, { stdio: 'inherit' });
  } else {
    console.log(chalkERROR(`取消本地发布！`));
  }
};

function gitIsClean() {
  return new Promise((resolve, reject) => {
    exec('git status -s', (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
      }
      if (stdout.length) {
        reject('请确保本地代码已经提交git');
      } else {
        resolve('ok');
      }
    });
  });
}

(async () => {
  await gitIsClean();
  await selectReleaseVersion();
})().then(
  () => {
    console.log(chalkSUCCESS(`本地发布v${targetVersion}成功！`));
  },
  (rej) => {
    console.log(rej);
    console.log(chalkERROR(`！！！本地发布v${targetVersion}失败！！！`));
  }
);
