import Vue from 'vue'
import Router from 'vue-router'
// import Login from "../components/Login";
// import Index from "../components/Index";

//异步加载引入
const Login = () => import("@/views/Login")
const Index = () => import("@/views/Index")
const AdminManage = () => import("@/views/adminmanage/AdminManage")//导入管理员管理组件
const AdminInfomation = () => import("@/views/admin/AdminInfomation")//导入管理员详细信息组件
const MenuManage = () => import("@/views/menumanage/MenuManage")//导入菜单管理组件

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
          component: AdminInfomation
        },
        {
          path: 'AdminManage',
          component: AdminManage
        },
        {
          path: 'MenuManage',
          component: MenuManage
        }
      ]
    }
  ]
})
