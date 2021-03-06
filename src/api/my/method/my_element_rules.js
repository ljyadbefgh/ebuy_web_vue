/**
 * 说明：本js文件主要用于element表单常规验证的公共方法
 */

/**
 * 验证两位数的正浮点数
 * 说明：
 * 1.如果required为true，则不能为空
 * 2.如果不为空，则必须为数字或浮点数，且小数点位数不能超过两位
 * 3.不能为附属
 */
const validateFloat= (rule, value, callback) => {//小数的验证的验证规则
  let reg = /^[+-]?(0|([1-9]\d*))(\.\d{0,2})?$/g;
  if (value == ''||value==null) {//如果值为空
    if(rule.required) {//如果规则要求必填
      callback(new Error('不能为空'));
    }else{
      callback();
    }
  }else if (!reg.test(value)) {//如果不为空，对数字格式进行验证
    callback(new Error('必须为数字，且小数点位数不能超过两位'));
  } else {
    let floatValue = parseFloat(value);//转换为浮点数
    if (floatValue < 0) {
      callback(new Error('不能为负数'));
    } else {
      callback();
    }
  }
};


export default {
  validateFloat
}
