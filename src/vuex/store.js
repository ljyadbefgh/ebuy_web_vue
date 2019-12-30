import Vue from 'vue'
import Vuex from 'vuex'

//注册vuex
Vue.use(Vuex)

//状态
const state={
  admin:sessionStorage.getItem("admin")
}

const getters={
  admin(state) {
    return state.admin;
  }
}

//mutations用来操作状态
const mutations={
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
