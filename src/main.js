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

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts




import store from "./vuex/store";

//阻止显示生产模式的消息
Vue.config.productionTip = false

// import './styles/index.scss'

import {message} from "@/api/my/my_reset_element_message.js";
Vue.prototype.$message=message;//重写element ui的$message指令，让消息框只显示一次。

// 调用自定义的公共函数
import myMethod from './api/my/my_common_methods'
Vue.prototype.myMethod=myMethod;// 组件中通过this.myMethod.method()调用
///*ljy创建的用来存放公共变量*/
import myVariable from './api/my/my_variable.js'
Vue.prototype.myVariable=myVariable;// 组件中通过this.myVariable.variable调用


//引入axios
//import axios from "axios"//因为要进行全局配置，所以这里不引入，直接引入配置好的axios
import axios from "@/api/my/my_axios.js";//用自己的全局设置axios代替

//挂在在vue的原型上
Vue.prototype.$axios = axios;

/**
 * to:即将要进入的路由对象
 * Route: 当前导航正要离开的路由
 * next: 调用该方法，才能进入下一个路由钩子
 */
router.beforeEach((to, from, next) => {
  //读取服务器的JSESSIONID
  //console.log(to.fullPath);// 获取当前路由的完整路径
  store.commit("setRouteMatched",to.matched);//将路由节点信息存入vuex，to.matched获取当前路由的每个路由节点的完整信息
  next(); //调用该方法,才能进入下一个钩子
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
