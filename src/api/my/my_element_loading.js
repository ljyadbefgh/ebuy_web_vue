/**
 * 用于定义本站的loadding
 *
 */
import Vue from 'vue'
// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading;
function startLoading() {
  loading = Vue.prototype.$loading({
    lock: true,
    text: "与服务器数据交互中...",
    target: document.querySelector('.loading-area')//设置加载动画区域，这个类本人设置在Index的 <el-main class="loading-area">组件里面
  });
}
function endLoading() {
  loading.close();
}

//声明一个对象用于存储请求个数
let needLoadingRequestCount = 0;
const showFullScreenLoading= ()=>{
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
};
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};



let messageInstance = null;
const resetMessage = (options) => {
    if(messageInstance) {
      messageInstance.close();
    }
    messageInstance = Message(options);
  }
;['error','success','info','warning'].forEach(type => {
  resetMessage[type] = options => {
    if(typeof options === 'string') {
      options = {
        message:options
      }
    }
    options.type = type;
    return resetMessage(options);
  }
})
export const message = resetMessage
