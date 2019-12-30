// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//导入element ui插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//引入axios
import axios from "axios"

axios.defaults.headers ={
   "Content-Type":"application/json;charset=UTF-8",
   "Access-Control-Allow-Methods": "*"
}
//ljy特别说明：在和服务端交互时，服务端会返回客户端set-cookie那一行有path=/ebuy，说明这个cookie是有范围限制的，只能在/ebuy才会带上cookie
// 所以如果使用proxyTable代理要注意这个问题，虚拟目录必须和服务端项目的地址一致
axios.defaults.withCredentials=true;  // 跨域携带cookie

//挂在在vue的原型上
Vue.prototype.$axios = axios;






import store from "./vuex/store";

Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
