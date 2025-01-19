var version$1 = "0.0.01";

const arrayUnique = arr => {
  return [...new Set(arr)];
};

const isIPad = () => {
  const ua = navigator.userAgent.toLowerCase();
  const res = ua.match(/iPad/i);
  if (res?.length) {
    return true;
  }
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
    return true;
  }
  return false;
};

const copyToClipBoard = text => {
  const oInput = document.createElement("input");
  oInput.value = text;
  document.body.appendChild(oInput);
  oInput.select();
  document.execCommand("Copy");
  oInput.parentElement?.removeChild(oInput);
};

const formatDate = timetamp => {
  function addDateZero(num) {
    return num < 10 ? `0${num}` : num;
  }
  const date = new Date(timetamp);
  return {
    year: date.getFullYear(),
    month: addDateZero(date.getMonth() + 1),
    day: addDateZero(date.getDate()),
    hour: addDateZero(date.getHours()),
    minutes: addDateZero(date.getMinutes()),
    seconds: addDateZero(date.getSeconds())
  };
};

const getRangeRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomOne = arr => arr[Math.floor(Math.random() * arr.length)];
const getRandomString = length => {
  const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let res = "";
  for (let i = 0; i < length; i += 1) {
    res += str.charAt(getRangeRandom(0, str.length - 1));
  }
  return res;
};
const getRandomInt = length => {
  if (length > 16 || length < 1) throw new Error("length\u7684\u8303\u56F4:[1,16]");
  let num = +`${Math.random()}`.slice(2, 2 + length);
  if (String(num).length !== length) {
    num = getRandomInt(length);
  }
  return num;
};

const debugLog = function (type) {
  for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    data[_key - 1] = arguments[_key];
  }
  console[type]("bi-utils", ...data);
};

function isPureNumber(str) {
  const regex = /^\d+$/;
  return regex.test(str);
}
const regVerify = (str, type) => {
  try {
    switch (type) {
      case "email":
        return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(str);
      case "phone":
        return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(str);
    }
  } catch (error) {
    debugLog("error", error);
    return false;
  }
};
const judgeStringSpace = value => {
  const reg1 = /^\s+/g;
  const reg2 = /\s+$/g;
  if (reg1.test(value) || reg2.test(value)) {
    return true;
  }
  return false;
};

const getUrlParams = key => {
  const url = decodeURIComponent(window.location.href);
  const str = url.split("?")[1];
  const obj = {};
  if (str) {
    const keys = str.split("&");
    keys.forEach(item => {
      const arr = item.split("=");
      obj[arr[0]] = arr[1];
    });
  }
  return key ? obj[key] : obj;
};

function strBtoa(str) {
  return window.btoa(window.encodeURIComponent(str));
}

class CacheModel {
  prefix = "";
  constructor(prefix) {
    this.prefix = prefix;
  }
  handlePrefix = key => {
    if (this.prefix === "") {
      return key;
    } else {
      return `${this.prefix}${key}`;
    }
  };
  getItem = key => {
    return localStorage.getItem(this.handlePrefix(key));
  };
  setItem = (key, value) => {
    return localStorage.setItem(this.handlePrefix(key), value);
  };
  removeItem = key => {
    return localStorage.removeItem(this.handlePrefix(key));
  };
  getStorage = key => {
    try {
      const res = this.getItem(key);
      if (res) {
        const data = JSON.parse(res);
        if (!data.createTime) {
          this.clearStorage(key);
          return null;
        } else {
          return data.value;
        }
      }
      return null;
    } catch (error) {
      debugLog("error", error);
      this.clearStorage(key);
      return null;
    }
  };
  setStorage = (key, value) => {
    try {
      const createTime = +new Date();
      this.setItem(key, JSON.stringify({
        value,
        createTime
      }));
    } catch (error) {
      debugLog("error", error);
      this.clearStorage(key);
    }
  };
  clearStorage = key => {
    try {
      this.removeItem(key);
    } catch (error) {
      debugLog("error", error);
    }
  };
  getStorageExp = key => {
    try {
      const res = this.getItem(key);
      if (res) {
        const data = JSON.parse(res);
        const expireTime = data.expireTime;
        const isExpired = expireTime < +new Date();
        if (!expireTime || isExpired) {
          this.clearStorage(key);
          return null;
        } else {
          return data.value;
        }
      }
      return null;
    } catch (error) {
      debugLog("error", error);
      this.clearStorage(key);
      return null;
    }
  };
  setStorageExp = (key, value, expires) => {
    try {
      if ([key, value, expires].includes(void 0)) {
        debugLog("error", "\u8BF7\u68C0\u67E5\u4F20\u5165\u7684\u53C2\u6570\uFF01");
        return;
      }
      const createTime = +new Date();
      const expireTime = createTime + expires * 60 * 60 * 1e3;
      this.setItem(key, JSON.stringify({
        value,
        createTime,
        expireTime
      }));
    } catch (error) {
      debugLog("error", error);
      this.clearStorage(key);
    }
  };
}

class LRUCache {
  capacity;
  data = /* @__PURE__ */new Map();
  constructor(capacity) {
    if (capacity < 1) throw new Error("capacity\u5FC5\u987B\u5927\u4E8E1\uFF01");
    this.capacity = capacity;
  }
  get(key) {
    const data = this.data;
    const value = data.get(key);
    if (!data.has(key)) return null;
    data.delete(key);
    data.set(key, value);
    return value;
  }
  put(key, value) {
    const data = this.data;
    if (data.has(key)) {
      data.delete(key);
    }
    data.set(key, value);
    if (data.size > this.capacity) {
      data.delete(data.keys().next().value);
    }
  }
}

class ConcurrentPoll {
  tasks = [];
  max = 0;
  total = 0;
  delay = 0;
  done;
  constructor(_ref) {
    let {
      max = 5,
      done,
      delay = 0
    } = _ref;
    this.tasks = [];
    this.total = 0;
    this.max = max;
    this.done = done;
    this.delay = delay;
    setTimeout(() => {
      this.run();
    }, 0);
  }
  addTask(task) {
    this.tasks.push(task);
    this.total += 1;
  }
  run() {
    if (this.tasks.length === 0) {
      return Promise.resolve("");
    }
    const min = Math.min(this.tasks.length, this.max);
    for (let i = 0; i < min; i += 1) {
      this.max -= 1;
      const task = this.tasks.shift();
      task().then(() => {}).catch(error => {
        debugLog("error", error);
      }).finally(() => {
        setTimeout(() => {
          this.max += 1;
          this.total -= 1;
          this.run();
          if (this.total === 0) {
            this.done?.();
          }
        }, this.delay);
      });
    }
  }
}

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  arrayUnique: arrayUnique,
  isIPad: isIPad,
  copyToClipBoard: copyToClipBoard,
  formatDate: formatDate,
  getRangeRandom: getRangeRandom,
  getRandomOne: getRandomOne,
  getRandomString: getRandomString,
  getRandomInt: getRandomInt,
  isPureNumber: isPureNumber,
  regVerify: regVerify,
  judgeStringSpace: judgeStringSpace,
  getUrlParams: getUrlParams,
  strBtoa: strBtoa,
  CacheModel: CacheModel,
  LRUCache: LRUCache,
  ConcurrentPoll: ConcurrentPoll
});

const version = version$1;

export { CacheModel, ConcurrentPoll, LRUCache, arrayUnique, copyToClipBoard, utils as default, formatDate, getRandomInt, getRandomOne, getRandomString, getRangeRandom, getUrlParams, isIPad, isPureNumber, judgeStringSpace, regVerify, strBtoa, version };
