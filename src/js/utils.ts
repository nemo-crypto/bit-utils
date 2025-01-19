import { debugLog } from '../utils/index';

/**
 * @description: 字符串编码
 * @param {string} str
 * @return {*}
 */
export function strBtoa(str: string) {
  return window.btoa(window.encodeURIComponent(str));
}

/**
 * @description: 字符串解码
 * @param {string} str
 * @return {*}
 */
export function strAtob(str: string) {
  return window.decodeURIComponent(window.atob(str));
}

/**
 * @description: 异步更新
 * @param {*} fn
 * @return {*}
 */
export const asyncUpdate = (fn, delay?) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = fn();
      resolve(res);
    }, delay || 0);
  });
};

/**
 * @description: 模拟ajax请求
 * @param {*} param1
 * @return {*}
 */
export const mockAjax = ({ flag = true, delay = 500 }) => {
  return new Promise<{ code: number; data: { id: number }; msg: string }>(
    (resolve, reject) => {
      setTimeout(() => {
        if (flag) {
          resolve({
            code: 200,
            data: {
              id: 1,
            },
            msg: '请求成功',
          });
        } else {
          reject({
            code: 400,
            msg: '请求失败',
          });
        }
      }, delay);
    }
  );
};

/**
 * @description: 将里面盒子等比例适配外层盒子
 * 如果里层盒子的宽或高有一边大于外层盒子的宽或高，可不设置minWidth和minHeight，
 * 如果里层盒子的宽和高都小于外层盒子的宽和高需要设置maxWidth和minWidth一致，maxHeight和minHeight一致
 * @param width           里面的盒子宽度
 * @param height          里面的盒子高度
 * @param maxWidth        外面的盒子最大宽度
 * @param maxHeight       外面的盒子最大高度
 * @param minWidth        外面的盒子最小宽度
 * @param minHeight       外面的盒子最小高度
 * @returns {{width: number, height: number}} 返回适配好的盒子宽高
 */
export function computeBox({
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
}) {
  // w = h / ratio, h = w * ratio
  const ratio = height / width;
  // eslint-disable-next-line
  const _minWidth = minWidth ? minWidth : 0;
  // eslint-disable-next-line
  const _minHeight = minHeight ? minHeight : 0;
  // eslint-disable-next-line
  let _width = width;
  // eslint-disable-next-line
  let _height = height;

  if (_width < _minWidth) {
    _width = _minWidth;
    _height = _minWidth * ratio;
  }
  if (_height < _minHeight) {
    _width = _minHeight / ratio;
    _height = _minHeight;
  }

  if (_width > maxWidth) {
    _width = maxWidth;
    _height = maxWidth * ratio;
  }
  if (_height > maxHeight) {
    _width = maxHeight / ratio;
    _height = maxHeight;
  }

  return {
    width: _width,
    height: _height,
  };
}

/**
 * @description: 下载图片
 * @param {string} src
 * @param {string} name
 * @return {*}
 */
export const downloadImg = (src: string, name: string) => {
  const imgEl = new Image();
  imgEl.src = src;
  imgEl.setAttribute('crossOrigin', 'anonymous'); // 跨域
  imgEl.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;

    const context = canvas.getContext('2d');
    context!.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);
    const url = canvas.toDataURL('image/png');

    // 生成一个a元素
    const a = document.createElement('a');
    // 创建一个单击事件
    const event = new MouseEvent('click');

    a.download = name || '下载图片名称';
    // 将生成的URL设置为a.href属性
    a.href = url;
    // 触发a的单击事件
    a.dispatchEvent(event);
  };
  imgEl.onerror = function (e) {
    debugLog('error', '下载图片出错', e);
  };
};

/**
 * @description: 跳转(window.location.href)
 * @param {array} arg
 * @return {*}
 */
export const hrefToTarget = (url: string) => {
  window.location.href = url;
};

/**
 * @description: 跳转(window.open)
 * @param {array} arg
 * @return {*}
 */
export const openToTarget = (...arg) => {
  window.open(...arg);
};

/**
 * @description: 刷新页面(window.location.reload)
 */
export const windowReload = () => {
  window.location.reload();
};

/**
 * @description: 获取文件后缀
 * @param {string} filename
 * @return {*}
 */
export const getFileExt = (filename: string) => {
  const arr = filename.split('.');
  const ext = arr[arr.length - 1];
  return ext;
};

/**
 * @description: 生成style标签，并挂载到head
 * @example: generateStyle({ '.a': { color: 'red' }, '#b': { color: 'blue' } });
 * 最终会将<style type="text/css">.a{color:red;}#b{color:blue;}</style>挂载到head里
 * @param {number} styleObj
 * @return {*}
 */
export const generateStyle = (styleObj: Record<string, any>) => {
  const styleEle = document.createElement('style');
  styleEle.type = 'text/css';
  let textContent = '';
  function getStyleVal(obj: string) {
    let str = '';
    Object.keys(obj).forEach((key: string) => {
      // eslint-disable-next-line
      str += `${key}:${obj[key]};`;
    });
    return str;
  }
  Object.keys(styleObj).forEach((key) => {
    textContent += `${key}{`;
    textContent += getStyleVal(styleObj[key]);
    textContent += '}';
  });
  styleEle.textContent = textContent;
  document.head.appendChild(styleEle);
};

/**
 * @description: 图片预加载
 * @example: imgPrereload(['aaa.com/a.webp', 'aaa.com/b.webp']);
 * @param {string} imgList
 * @return {*}
 */
export const imgPrereload = (imgList: string[]) => {
  return imgList.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve({ url });
      img.onerror = (error) => reject({ url, error });
    });
  });
};

/**
 * @description: 是否支持0.5px
 * @return {*}
 */
export const supportHairlines = () => {
  const fakeBody = document.createElement('body');
  const testElement = document.createElement('div');
  testElement.style.border = '.5px solid transparent';
  fakeBody.appendChild(testElement);
  document.documentElement.appendChild(fakeBody);
  if (testElement.offsetHeight === 1) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description: 让系统卡死一段时间
 * @param {*} duration
 * @return {*}
 */
export const sleep = (duration = 1000) => {
  const oldTime = +new Date();
  // eslint-disable-next-line
  for (; +new Date() - oldTime < duration;) { }
};

/**
 * @description: 按屏幕375为基准,生成对应的px值,默认返回单位(px)
 * @param {number} val
 * @param {*} flag
 * @return {*}
 */
export const pxToDesignPx = (val: number, flag = true) => {
  // window.screen.availWidth，值是固定的，怎么跳转浏览器大小，值都是屏幕的大小
  // window.document.documentElement.clientWidth，值是不定的，根据文档宽度决定
  // window.screen和window.document兼容性一致，兼容ie6及以上，不兼容安卓4.3及以下，其余基本没有兼容性问题。
  const px = window.document.documentElement.clientWidth * (val / 375);
  return flag ? `${px}px` : px;
};

/**
 * @description: 按屏幕375为基准,生成对应的vw值,默认返回单位(vw)
 * @param {number} val
 * @param {*} flag
 * @return {*}
 */
export const pxToDesignVw = (val: number, flag = true) => {
  const vw = ((val / 375) * 100).toFixed(5);
  return flag ? `${vw}vw` : vw;
};

/**
 * @description: 删除对象中值为: null, undefined, NaN, ''的属性
 * @param {any} obj
 * @return {*}
 */
export const deleteUseLessObjectKey = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if ([null, undefined, NaN, ''].includes(obj[key])) {
      delete obj[key];
    }
  });
  return obj;
};

/**
 * @description: 替换占位符
 * @example: replaceKeyFromValue('Hello {name}',{name:'Word'}) => Hello Word
 * @param {string} str
 * @param {object} obj
 * @return {*}
 */
export const replaceKeyFromValue = (str: string, obj: Record<string, any>) => {
  let res = str;
  Object.keys(obj).forEach((v) => {
    res = res.replace(new RegExp(`{${v}}`, 'ig'), obj[v]);
  });
  return res;
};

/**
 * @description: 判断数据类型
 * @return {*}
 */
export const judgeType = (
  obj: any
):
  | 'boolean'
  | 'number'
  | 'string'
  | 'function'
  | 'array'
  | 'date'
  | 'regExp'
  | 'undefined'
  | 'null'
  | 'object' => {
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  };
  return map[Object.prototype.toString.call(obj)];
};

/**
 * @description: myName或者MyName转化为my-name
 * @copy https://github.com/vueComponent/ant-design-vue/blob/HEAD/antd-tools/generator-types/src/utils.ts
 * @param {string} input
 * @return {*}
 */
export const toKebabCase = (input: string): string =>
  input.replace(
    /[A-Z]/g,
    (val, index) => (index === 0 ? '' : '-') + val.toLowerCase()
  );

/**
 * @description: myName或者MyName转化为my_name
 * @param {string} input
 * @return {*}
 */
export const toKebabCase2 = (input: string) =>
  input.replace(
    /[A-Z]/g,
    (val, index) => (index === 0 ? '' : '_') + val.toLowerCase()
  );

/**
 * @description: my-name转化为myName
 * @param {string} input
 * @return {*}
 */
export const toCamelCased = (input: string) =>
  input.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });

/**
 * @description: my_name转化为myName
 * @param {string} input
 * @return {*}
 */
export const toCamelCased2 = (input: string) =>
  input.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });

/**
 * @description: my-name转化为MyName
 * @param {string} input
 * @return {*}
 */
export const toPascalCase = (input: string) => {
  const res = input.replace(input[0], input[0].toUpperCase());
  return res.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};

/**
 * @description: my_name转化为MyName
 * @param {string} input
 * @return {*}
 */
export const toPascalCase2 = (input: string) => {
  const res = input.replace(input[0], input[0].toUpperCase());
  return res.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};

/**
 * @description: 使用json进行深克隆
 * @param {*} obj
 * @return {*}
 */
export const deepCloneByJson = <T>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

/**
 * @description: 手写深拷贝，解决循环引用
 * @param {*} object
 * @return {*}
 */
export const deepClone = <T>(object: T): T => {
  function clone(obj: any, hash: any) {
    const newobj: any = Array.isArray(obj) ? [] : {};
    // eslint-disable-next-line
    hash = hash || new WeakMap();
    if (hash.has(obj)) {
      return hash.get(obj);
    }
    hash.set(obj, newobj);

    Object.keys(obj).forEach((i) => {
      if (obj[i] instanceof Object) {
        newobj[i] = clone(obj[i], hash);
      } else {
        newobj[i] = obj[i];
      }
    });
    return newobj;
  }
  return clone(object, undefined);
};

/**
 * @description: 防抖函数（Promise）
 * @param {Function} fn 函数
 * @param {number} delay 延迟时间
 * @param {boolean} leading 首次立即执行
 * @return {Promise}
 */
export const debounce = (fn: any, delay: number, leading = false) => {
  let timer;
  const debounceFn = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    return new Promise((resolve) => {
      if (leading) {
        let isFirst = false;
        if (!timer) {
          // @ts-ignore
          resolve(fn.apply(this, args));
          isFirst = true;
        }
        timer = setTimeout(() => {
          timer = null;
          if (!isFirst) {
            // @ts-ignore
            resolve(fn.apply(this, args));
          }
        }, delay);
      } else {
        timer = setTimeout(() => {
          // @ts-ignore
          resolve(fn.apply(this, args));
        }, delay);
      }
    });
  };

  debounceFn.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };
  return debounceFn;
};

/**
 * @description: 节流函数（Promise）
 * @param {Function} fn 函数
 * @param {number} interval 间隔
 * @param {boolean} trailing 最后一次执行
 * @return {Promise}
 */
export const throttle = (fn: any, interval: number, trailing = false) => {
  let lastTime = 0;
  let timer;
  return function (...args) {
    const newTime = new Date().getTime();
    if (timer) {
      clearTimeout(timer);
    }

    let result;
    return new Promise((resolve) => {
      if (newTime - lastTime > interval) {
        // @ts-ignore
        result = fn.apply(this, args);
        resolve(result);
        lastTime = newTime;
      } else if (trailing) {
        timer = setTimeout(() => {
          // @ts-ignore
          result = fn.apply(this, args);
          resolve(result);
        }, interval);
      }
    });
  };
};

/**
 * @description: 生成uuid（16位）
 * @example: generate() ===> 9d24f135-3e33-46b7-b51f-dc5b8121d60a
 * @return {*}
 */
export const generateUuid = () => {
  const uuid = URL.createObjectURL(new Blob()); // blob:null/9d24f135-3e33-46b7-b51f-dc5b8121d60a
  URL.revokeObjectURL(uuid); // 在使用完对象 URL 后调用此方法，让浏览器知道不再保留对该文件的引用。
  return uuid.split('/')[1].length;
};
