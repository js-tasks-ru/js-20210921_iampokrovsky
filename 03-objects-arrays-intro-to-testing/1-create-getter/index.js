/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  let i = 0;
  const pathArr = path.split('.');

  return function rec(obj) {
    if (!obj.hasOwnProperty(pathArr[i])) return undefined;
    return (i < pathArr.length - 1) ? rec(obj[pathArr[i++]]) : obj[pathArr[i]];
  };
}
