/**
 * @description 格式化内存大小(要求传入的数字以byte为单位)
 * @param {number} val
 * @param {*} num 显示几位小数,默认2
 * @return {*}
 */
export const formatMemorySize = (val: number, num = 2) => {
  const oneByte = 1;
  const oneKb = oneByte * 1024;
  const oneMb = oneKb * 1024;
  const oneGb = oneMb * 1024;
  const oneTb = oneGb * 1024;
  const format = (v: number) => v.toFixed(num);

  if (val < oneKb) {
    return `${format(val / oneByte)}byte`;
  }
  if (val < oneMb) {
    return `${format(val / oneKb)}kb`;
  }
  if (val < oneGb) {
    return `${format(val / oneMb)}mb`;
  }
  if (val < oneTb) {
    return `${format(val / oneGb)}gb`;
  }
  return `${format(val / oneTb)}tb`;
};

/**
 * @description 格式化时间
 * @param {number} timetamp
 */
export const formatDate = (timetamp: number) => {
  function addDateZero(num: number) {
    return num < 10 ? `0${num}` : num;
  }
  const date = new Date(timetamp);
  return {
    year: date.getFullYear(),
    month: addDateZero(date.getMonth() + 1),
    day: addDateZero(date.getDate()),
    hour: addDateZero(date.getHours()),
    minutes: addDateZero(date.getMinutes()),
    seconds: addDateZero(date.getSeconds()),
  };
};
