<template>
  <div class="index">
    <el-container class="main" style="height: 500px; border: 1px solid #eee">
      <!--左侧导航-->
      <el-aside width="200px" align="left">
        <el-menu :default-openeds="['1']"
                 router
                 background-color="#304156"
                 text-color="#fff"
                 active-text-color="#409eff">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-user-solid"></i>管理员模块</template>
            <el-menu-item index="1-1" route="/admin/MenuManage">菜单管理</el-menu-item>
            <el-menu-item index="1-1" route="/admin/RoleManage">角色管理</el-menu-item>
            <el-menu-item index="1-2" route="/admin/AdminManage">管理员管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主界面-->
      <el-container>
        <!--右侧界面的头部导航条-->
        <el-header style="text-align: right; font-size: 12px">
          <!--导航条-->
          <el-menu
            :default-active="activeIndex2"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            router
           >
            <el-menu-item index="1" route="/admin">首页</el-menu-item>
            <el-submenu index="2">
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
              <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项1</el-menu-item>
                <el-menu-item index="2-4-2">选项2</el-menu-item>
                <el-menu-item index="2-4-3">选项3</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item><a href="http://120.76.118.101:8081/swagger-ui.html" target="_blank">订餐系统后端API文档</a></el-menu-item>
            <el-badge :value="2" class="item" style="margin-right: 10px;">
              <el-button size="small">系统消息</el-button>
            </el-badge>
            <el-dropdown @command="handleCommand" size="small" style="line-height: 60px;">
              <el-button icon="el-icon-user-solid" size="small">{{$store.getters.admin}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu>
                <el-dropdown-item  command="admin_detail">个人资料</el-dropdown-item>
                <el-dropdown-item  command="admin_detail">基本信息编辑</el-dropdown-item>
                <el-dropdown-item  command="admin_detail">密码修改</el-dropdown-item>
                <el-dropdown-item command="admin_logout" divided>退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu>


        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
    export default {
        name: "Index",
        data() {
            return {
                activeIndex2: '1'
            }
        },
        methods: {
            handleCommand(command) {
                if(command=="admin_detail"){
                    if(this.$route.path!="/admin"){//只有当前不在该路由才进行跳转。否则会出错
                        this.$router.push("/admin");
                    }
                }else if(command=="admin_logout"){
                    this.$store.commit("logout_admin");//将账户信息注销
                    this.$router.push("/login");
                }
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    };
</script>

<style>

  /*自定义样式*/
  html, body, #app, .index {
    height: 100%;
    padding: 0;
    margin: 0;
  }

  #app .el-container {
    height: 100% !important;
  }

  #app .el-header {/*右侧界面的头部导航条，高度默认是60*/
   /* line-height: 60px;*/
    padding:0; /*去掉自带的内边距*/
  }

  #app .el-aside { /*左侧菜单样式的最外层容器*/
    width: 205px;
  }

  #app .el-menu { /*左侧菜单样式第二层容器*/
    height: 100%; /*将左侧菜单栏高度拉升到100%*/
  }

  #app .el-aside {
    left: 0;
    bottom: 0;
    overflow-y: auto;
  }


</style>
