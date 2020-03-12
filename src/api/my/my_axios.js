import axios from "axios";
import Vue from 'vue'
import {message} from "@/api/my/my_reset_element_message.js";//重写element ui的$message指令，让消息框只显示一次。
import myVariable from '@/api/my/my_variable.js'
import router from '@/router'

const http = axios.create({
  //ljy特别说明：在和服务端交互时，服务端会返回客户端set-cookie那一行有path=/ebuy，说明这个cookie是有范围限制的，只能在/ebuy才会带上cookie
// 所以如果使用proxyTable代理要注意这个问题，虚拟目录必须和服务端项目的地址一致
// 给axios设置baseURL，用于开发模式调用
  baseURL: myVariable.baseUrl, //设置初始URL
  timeout: 60000,//超时时间
  headers: {
    "Content-Type":"application/json;charset=UTF-8",
    "Access-Control-Allow-Methods": "*"
  },
  withCredentials: true // 跨域携带cookie
});

// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading;
function startLoading() {
  loading = Vue.prototype.$loading({
    lock: true,
    spinner: 'el-icon-loading',
    customClass:'create-isLoading', // 自定义加载样式，写在app.vue里面
    background: 'rgba(0, 0, 0, 0.7)',
    text: "与服务器数据交互中..."
    //target: document.querySelector('.loading-area')//设置加载动画区域，这个类本人设置在Index的 <el-main class="loading-area">组件里面
  });
}
function endLoading() {
  loading.close();
}

//声明一个对象用于存储请求个数
let needLoadingRequestCount = 0;
function showFullScreenLoading() {
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


// 添加请求拦截器，调用时间比组件调用axios的早
http.interceptors.request.use(
  function (config) {
    const path=router.currentRoute.fullPath;//获取当前路由的路径
    if(path!='/login' && path!='/admin/adminmanage/AdminManage'){//登陆页面和管理员模块都用了专门的加载处理，不用全局Loading
      showFullScreenLoading();
    }
    return config;
  },
  function (error) {
    tryHideFullScreenLoading();
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器，调用时间比组件调用axios的早
http.interceptors.response.use(
  function (response) {
    tryHideFullScreenLoading();
    const msg=response.data;
    // 对响应数据做点什么
    if (msg.code != 0) {//如果服务端返回的是错误数据
      if(msg.code==-9){//如果是没有登陆的请求
        router.push("/login");
        //window.location.reload();
      }
      if(msg.msg!=null && msg.msg!=''){//如果有返回错误信息
        message.error(msg.msg);
      }
    }
    return response;
  },
  function (error) {
    tryHideFullScreenLoading();
    message.error("response网络连接错误"+error);
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default http;
