import Vue from 'vue'
import Vuex from 'vuex'

//注册vuex
Vue.use(Vuex)

///*ljy创建的用来存放公共变量*/
import myVariable from '@/api/my/my_variable.js'

//状态
const state={
  admin:sessionStorage.getItem("admin"),//保存登陆的管理账户信息
  ueditorServerUrlWithCredentials:'',// 保存ueditor访问服务器的地址，要求携带jsessionId。因为它不是通过axios调用的，不会自己跨域保存session信息
  routeMatched:[] //当前路由匹配的完整路径，用于面包屑组件
}

const getters={
  admin(state) {
    return state.admin;
  },
  routeMatched(state){
    return state.routeMatched;
  },
  ueditorServerUrlWithCredentials:(state) => () =>{//必须通过方法级别读取（如：this.$store.getters.ueditorServerUrlWithCredentials()）读取，否则vuex会读取缓存，而不会执行该方法
    return myVariable.ueditorServerUrl+";jsessionid="+sessionStorage.getItem("JSESSIONID")+"?";
  }
}

//mutations用来操作状态
const mutations={
  setRouteMatched(state,value){//赋值面包屑组件,value值是路由收尾的to.matched，即获取当前路由的每个路由节点的完整信息
    state.routeMatched=value;
    /*state.routeMatchedName=[];//重置数组
    value.forEach(matched => {
      state.routeMatchedName.push(matched.name); // 将路由名称记录
    });*/
  },
  //保存管理账户信息
  save_admin(state,admin){
    sessionStorage.setItem("admin",admin);//将账户信息存入本地，否则刷新后会丢失
    state.admin=admin;
  },
  //注销管理账户信息
  logout_admin(state){
    sessionStorage.removeItem("admin");//将账户信息存入本地，否则刷新后会丢失
    state.admin=null;
  },
  setUeditorServerUrlWithCredentials(state,JSESSIONID){//JSESSIONID是服务端返回的值
    sessionStorage.setItem("JSESSIONID",JSESSIONID);//将客户端的session对象保存下来，只用于ueditor
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations
})
