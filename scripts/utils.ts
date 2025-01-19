import nodeChalk from 'chalk';

export const chalk = nodeChalk;
export const chalkINFO = (v) =>
  `${chalk.bgBlueBright.black(' INFO ')} ${chalk.blueBright(v)}`;
export const chalkSUCCESS = (v) =>
  `${chalk.bgGreenBright.black(' SUCCESS ')} ${chalk.greenBright(v)}`;
export const chalkERROR = (v) =>
  `${chalk.bgRedBright.black(' ERROR ')} ${chalk.redBright(v)}`;
export const chalkWARN = (v) =>
  `${chalk.bgHex('#FFA500').black(' WARN ')} ${chalk.hex('#FFA500')(v)}`;
