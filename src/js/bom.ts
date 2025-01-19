/** 判断是否是ipad */
export const isIPad = () => {
  const ua = navigator.userAgent.toLowerCase();
  // iOS13以前navigator.platform返回"iPhone"或"iPad"；iOS13以后的iPad，navigator.platform返回"MacIntel"
  const res = ua.match(/iPad/i);
  if (res?.length) {
    return true;
  }
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }
  return false;
};

/**
 * @description 判断是否是移动端（判断比较粗糙）
 * @return {*}
 */
export const isMobile = () => {
  // iOS13以前navigator.platform返回"iPhone"或"iPad"；iOS13以后的iPad，navigator.platform返回"MacIntel"
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }
  return /android|ios|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  );
};

/**
 * @description 判断是否是微信浏览器
 * @return {*}
 */
export const isWechat = () => {
  return /MicroMessenger/i.test(window.navigator.userAgent);
};

/**
 * @description 判断设备类型
 * @return {*}
 */
export const judgeDevice = () => {
  const ua = navigator.userAgent;
  const isAndroid = /(Android)/i.test(ua);
  const isIphone = /(iPhone|iPad|iPod|iOS)/i.test(ua);
  const isIPadRes = isIPad();

  return { isAndroid, isIphone, isIPad: isIPadRes };
};

/**
 * @description 判断是否是浏览器环境
 * @param {*} boolean
 * @return {*}
 */
export const isBrowser = () =>
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

/**
 * @description 判断是否是Safari浏览器
 * @return {*}
 */
export const isSafari = () => {
  // mac下的Chrome浏览器的navigator.userAgent既有Safari也有Chrome，因此得排除mac下的Chrome浏览器
  return (
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  );
};

/**
 * @description 判断是否是ie浏览器
 * @return {*}
 */
export const isIe = () => {
  return (
    navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.userAgent.indexOf('Trident') !== -1
  );
};
/**
 * @description 判断是否是Firefox浏览器
 * @return {*}
 */
export const isFirefox = () => {
  return navigator.userAgent.indexOf('Firefox') !== -1;
};

/**
 * @description 判断是否是支持webp
 * @return {*}
 */
export const isSupportWebp = () => {
  return (
    document
      .createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0
  );
};
