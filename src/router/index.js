import Vue from 'vue'
import Router from 'vue-router'

//异步加载引入
const Login = () => import("@/views/Login")
const Index = () => import("@/views/Index")
const AdminInfomation = () => import("@/views/admin/AdminInfomation")//导入管理员详细信息组件

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
          path: 'AdminEdit',
          component: () => import("@/views/admin/AdminEdit")
        },
        {
          path: 'PasswordEdit',
          component: () => import("@/views/admin/PasswordEdit")
        },
        {
          path: 'AdminManage',
          component: () => import("@/views/adminmanage/AdminManage")
        },
        {
          path: 'MenuManage',
          component: () => import("@/views/menumanage/MenuManage")
        },
        {
          path: 'PurviewManage',
          component: () => import("@/views/purviewmanage/PurviewManage")
        },
        {
          path: 'RoleManage',
          component: () => import("@/views/rolemanage/RoleManage")
        }
      ]
    }
  ]
})
