/**
 * @description 获取随机整数
 * @example: getRandomInt(4) ===> 3251
 */
const getRandomInt = (length) => {
  if (length > 16 || length < 1) throw new Error('length的范围:[1,16]');
  let num = +`${Math.random()}`.slice(2, 2 + length);
  if (String(num).length !== length) {
    num = getRandomInt(length);
  }
  console.log(num);
  return num;
};

const getRandomOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRangeRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getFileExt = (filename) => {
  const arr = filename.split('.');
  const ext = arr[arr.length - 1];
  return ext;
};

const generateStyle = (styleObj) => {
  // const styleEle = document.createElement('style');
  // styleEle.type = 'text/css';
  let textContent = '';
  function getStyleVal(obj) {
    let str = '';
    Object.keys(obj).forEach((key) => {
      // eslint-disable-next-line
      str += `${key}:${obj[key]};`;
    });
    return str;
  }
  Object.keys(styleObj).forEach((key) => {
    console.log(key, 333, getStyleVal(styleObj[key]));
    textContent += `${key}{`;
    textContent += getStyleVal(styleObj[key]);
    textContent += '}';
  });
  console.log(textContent, 222);
  // styleEle.textContent = textContent;
  // document.head.appendChild(styleEle);
};

const generateUuid = () => {
  const tempUrl = URL.createObjectURL(new Blob());
  const uuid = tempUrl.toString(); // blob:null/9d24f135-3e33-46b7-b51f-dc5b8121d60a
  URL.revokeObjectURL(tempUrl);
  console.log(uuid.split('/')[1]);
  return uuid.split('/')[1];
};

// my-name转化为MyName
const toPascalCase = (input) => {
  const res = input.replace(input[0], input[0].toUpperCase());
  return res.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};

console.log(toPascalCase('bi-utils'));
console.log(generateUuid());

// generateStyle({ backgroundImage: `url('sss')` });
generateStyle({ '.a': { color: 'red' }, '#b': { color: 'blue' } });
// console.log(getFileExt('aaa/dsaads.as.jpg'));

// for (let i = 0; i < 100; i++) {
//   console.log(getRangeRandom(1, 100));
// }
