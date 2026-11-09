export const debugLog = (type: 'log' | 'warn' | 'error', ...data) => {
  console[type]('bi-utils', ...data);
};
