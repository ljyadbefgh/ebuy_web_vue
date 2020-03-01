import Vue from 'vue'
import Router from 'vue-router'

//异步加载引入
const Login = () => import("@/views/Login")
const Index = () => import("@/views/Index")
const MyLayer = () => import("@/components/Layer") // 提供给有children的路由组件（并且没有要展示视图的容器展示）。特别说明：如果没有，则该路由组件的子路由将无法展示
const MyBreadcrumb =() => import("@/components/MyBreadcrumb") //自定义面包屑组件，用于展示当前路由的路径
Vue.component('MyBreadcrumb',MyBreadcrumb)// 注册为全局组件
const MyUeditor =() => import("@/components/MyUeditor.vue") //自定义Ueditor组件
Vue.component('MyUeditor',MyUeditor)// 注册为全局组件

Vue.use(Router)

export default new Router({
 /* mode:'history',*/
  base:'ebuy_web_vue',
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
      path: '/chart',
      name: 'chart',
      component:  () => import("@/views/Chart")
    },
    {
      path: '/admin',
      name:'后台管理系统',
      component: Index,
      children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
        {
          path: '',//默认子组件首页
          name:'后台主界面',
          component: () => import("@/views/Main")
        },
        {//二级
          path: 'admin',//个人账户管理
          name:'个人模块',
          redirect:'/admin/admin/AdminInfomation',
          component: MyLayer,
          children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
            {
              path: 'AdminInfomation',
              name:'管理账户详细信息',
              component: () => import("@/views/admin/AdminInfomation") //导入管理员详细信息组件
            },
            {
              path: 'AdminEdit',
              name:'基本信息修改',
              component: () => import("@/views/admin/AdminEdit")
            },
            {
              path: 'PasswordEdit',
              name:'密码修改',
              component: () => import("@/views/admin/PasswordEdit")
            }
          ]
        },
        {//二级
          path: 'adminmanage',//账户管理
          name:'管理员模块',
          redirect:'/admin/adminmanage/AdminManage',
          component: MyLayer,
          children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
            {
              path: 'AdminManage',
              name:'账户管理',
              component: () => import("@/views/adminmanage/AdminManage")
            },
            {
              path: 'MenuManage',
              name:'菜单管理',
              component: () => import("@/views/menumanage/MenuManage")
            },
            {
              path: 'PurviewManage',
              name:'权限管理',
              component: () => import("@/views/purviewmanage/PurviewManage")
            },
            {
              path: 'RoleManage',
              name:'角色管理',
              component: () => import("@/views/rolemanage/RoleManage")
            }
          ]
        },
        {//二级
          path: 'customermanage',//客户管理
          name:'客户模块',
          redirect:'/admin/customermanage/CustomerManage',
          component: MyLayer,
          children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
            {
              path: 'CustomerManage',
              name:'客户管理',
              component: () => import("@/views/customermanage/CustomerManage")
            }
          ]
        },
        {//二级
          path: 'product',
          name:'产品模块',
          redirect:'/admin/product/ProductTypeManage',
          component: MyLayer,
          children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
            {
              path: 'ProductTypeManage',
              name:'产品栏目管理',
              component: () => import("@/views/producttype/ProductTypeManage.vue")
            },
            {
              path: 'ProductManage',
              name:'产品管理',
              component: () => import("@/views/product/ProductManage.vue")
            }
          ]
        },
        {//二级
          path: 'productorder',
          name:'订单模块',
          redirect:'/admin/productorder/ProductOrderManage',
          component: MyLayer,
          children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
            {
              path: 'ProductOrderManage',
              name:'订单管理',
              component: () => import("@/views/productorder/ProductOrderManage.vue")
            },
            {
              path: 'ProductOrderDetailManage',
              name:'订单管理',
              component: () => import("@/views/productorderdetail/ProductOrderDetailManage.vue")
            }
          ]
        },
        {//二级
          path: 'webconfig',//客户管理
          name:'系统设置',
          redirect:'/admin/webconfig/ConfigEdit',
          component: MyLayer,
          children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
            {
              path: 'WebConfigEdit',
              name:'基础信息设置',
              component: () => import("@/views/webconfig/WebConfigEdit.vue")
            },
            {
              path: 'LogManage',
              name:'日志管理',
              redirect:'/admin/webconfig/LogManage/LogOfAdminLoginManage',
              component: MyLayer,
              children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
                {
                  path: 'LogOfCustomerLoginManage',
                  name:'客户登陆日志',
                  component: () => import("@/views/log/LogOfCustomerLoginManage.vue")
                },
                {
                  path: 'LogOfAdminLoginManage',
                  name:'管理员登陆日志',
                  component: () => import("@/views/log/LogOfAdminLoginManage.vue")
                }
                ]
            }
          ]
        },
        {//二级
          path: 'error',//错误页面
          name:'错误页面',
          redirect:'/admin/error/CustomerManage',
          component: MyLayer,
          children:[ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
            {
              path: '404',
              name:'404',
              component: () => import('@/views/404.vue'),
            }
          ]
        }
      ]// 二级route
    },
    {path:'*',redirect:'/admin/error/404'},//如果要跳转的路由不存在，则跳转到404页面
  ] // 一级route
})
