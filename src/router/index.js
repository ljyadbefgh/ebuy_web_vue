import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import Login from "../components/Login";
// import Index from "../components/Index";

//异步加载引入
const Login = () => import("@/components/Login")
const Index = () => import("@/components/Index")
const AdminManage = () => import("@/components/admin/AdminManage")
const Main = () => import("@/components/Main")
const PurviewList = () => import("@/components/PurviewList")

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      component: Index,
      children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
        {
          path: '',//默认子组件首页
          component: Main
        },
        {
          path: 'AdminManage',
          component: AdminManage
        },
        {
          path: 'PurviewList',
          component: PurviewList
        }
      ]
    }
  ]
})
