<template>
  <div class="index">
    <el-container style="height: 500px; border: 1px solid #eee">
      <!--左侧导航-->
      <el-aside width="200px" style="background-color: rgb(238, 241, 246);text-align: left;">
        <el-menu :default-openeds="['1']" default-active="1-1" router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>管理员模块</template>
            <el-menu-item index="1-1" route="/admin/PurviewList">权限列表</el-menu-item>
            <el-menu-item index="1-2" route="/admin/AdminManage">管理员列表</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
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
        <el-header style="text-align: right; font-size: 12px">
          <!--导航条-->
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              {{$store.getters.admin}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  command="admin_detail">个人资料</el-dropdown-item>
              <el-dropdown-item  command="admin_detail">基本信息编辑</el-dropdown-item>
              <el-dropdown-item  command="admin_detail">密码修改</el-dropdown-item>
              <el-dropdown-item command="admin_logout" divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <el-main>
          <!--<el-table :data="tableData">
            <el-table-column prop="date" label="日期" width="140">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
          </el-table>-->
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
            }
        }
    };
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  /*自定义样式*/
  html,body,#app,.index{
    height: 100%;
  }
  #app{
    margin-top:0px;
  }
  .el-container{
    height: 100% !important;
  }

</style>
