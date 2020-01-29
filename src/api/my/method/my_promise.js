/**
 * 说明：本js文件主要用于Promise执行异步顺序的公共方法
 */

/**
 * 说明：通过Promise构建异步顺序队列（特别说明：每个函数只考虑resolve的情况）
 * 调用方法
 * 步骤一：创建Promise对象对象
 let a= function () {
                return new Promise(function (resolve, reject) {
                    ……//代码，可以放异步代码
                    resolve();//本方法只针对resolve()，必须调用该方法
                })
            }
 let b= function () {
                return new Promise(function (resolve, reject) {
                    ……//代码，可以放异步代码
                    resolve();//本方法只针对resolve()，必须调用该方法
                })
            }
 * 步骤二：通过函数调用，即可执行。
 queuePromiseOfResolve([a, b]);
 * @param array Promise对象的数组
 * @returns {Promise<void>}
 */
const queuePromiseOfResolve=(array) => {
  let sequence = Promise.resolve();
  array.forEach(function (item) {
    sequence = sequence.then(item)
  })
  return sequence;
}

export default {
  queuePromiseOfResolve //通过Promise构建异步顺序队列
}
