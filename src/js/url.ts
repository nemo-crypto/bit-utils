/**
 * @description 获取地址栏参数(注意:请确保url是http://aaa.com/ds/?aa=1&bb=323这样子的)
 * @return {*}
 */
export const getUrlParams = (key?: string) => {
  const url = decodeURIComponent(window.location.href);
  const str = url.split('?')[1];
  const obj = {};
  if (str) {
    const keys = str.split('&');
    keys.forEach((item) => {
      const arr = item.split('=');
      obj[arr[0]] = arr[1];
    });
  }
  return key ? obj[key] : obj;
};
