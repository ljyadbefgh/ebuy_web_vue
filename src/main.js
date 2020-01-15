// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//导入element ui插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
//对element ui全局样式做改变，目前支持两个字段size用于改变组件的所有支持sezi组件的默认尺寸,设置弹框的初始 z-index（默认值：2000）
Vue.use(ElementUI, { size: 'mini', zIndex: 3000 });

//引入axios
import axios from "axios"

axios.defaults.headers ={
   "Content-Type":"application/json;charset=UTF-8",
   "Access-Control-Allow-Methods": "*"
}
//ljy特别说明：在和服务端交互时，服务端会返回客户端set-cookie那一行有path=/ebuy，说明这个cookie是有范围限制的，只能在/ebuy才会带上cookie
// 所以如果使用proxyTable代理要注意这个问题，虚拟目录必须和服务端项目的地址一致
axios.defaults.withCredentials=true;  // 跨域携带cookie

// import './styles/index.scss'

//挂在在vue的原型上
Vue.prototype.$axios = axios;


import store from "./vuex/store";




Vue.config.productionTip = false

// 调用自定义的公共函数
import myMethod from './api/my/my_common_methods'
Vue.prototype.myMethod=myMethod;// 组件中通过this.myCommon.method()调用



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
