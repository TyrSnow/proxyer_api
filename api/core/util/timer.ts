/**
 * 包装记录一个函数的执行时间
 */
function timer(target) {
  return function (...args) {
    const startTime = new Date().valueOf();
    const result = target.apply(this, args);
    const endTime = new Date().valueOf();
    console.log(target.name, 'cost: ', endTime - startTime);
    return result;
  }
}

export default timer;
