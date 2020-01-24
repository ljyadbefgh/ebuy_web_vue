import Vue from 'vue'
import Vuex from 'vuex'

//注册vuex
Vue.use(Vuex)

//状态
const state={
  admin:sessionStorage.getItem("admin"),//保存登陆的管理账户信息
  routeMatched:[] //当前路由匹配的完整路径，用于面包屑组件
}

const getters={
  admin(state) {
    return state.admin;
  },
  routeMatched(state){
    return state.routeMatched;
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
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations
})
