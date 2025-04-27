function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
};

function map(n, start1, stop1, start2, stop2, withinBounds) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
};

function radians(deg) {
  return deg * Math.PI / 180
}

function random(num1OrArr, num2) {
  // if first is array
  if (Array.isArray(num1OrArr)) { //array element
    if (num1OrArr.length === 0) {
      console.log('%cПустой массив');
      return
    }
    return num1OrArr[Math.floor(Math.random() * num1OrArr.length)]
  } else if (typeof num1OrArr === 'number' && typeof num2 === 'number') { //min to max
    if (num1OrArr > num2) [num1OrArr, num2] = [num2, num1OrArr]
    return num1OrArr + Math.random() * (num2 - num1OrArr)
  } else if (typeof num1OrArr === 'number' && !num2) { //only 1 number
    return Math.random() * num1OrArr
  } else if (!num1OrArr && !num2) { //no arguments
    return Math.random()
  }
}
