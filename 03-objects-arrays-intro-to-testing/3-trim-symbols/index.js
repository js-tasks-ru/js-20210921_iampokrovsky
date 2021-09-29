/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) return string;

  const strArr = string.split('');

  let currentLetter;
  let currentCount;

  return strArr.filter((item) => {
    if (item === currentLetter) {
      currentCount++;
    } else {
      currentLetter = item;
      currentCount = 0;
    }

    return currentCount < size;
  }).join('');
}
