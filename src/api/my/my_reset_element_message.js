/**
 * 解决重复点击按钮或多个请求同时报错时弹出多个message弹框，让弹框只出现一次
 *
 */
/**重置message，防止重复点击重复弹出message弹框 */
import {
  Message
} from 'element-ui';

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
