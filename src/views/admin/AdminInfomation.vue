<template>
  <div class="index">
    <el-card class="box-card" style="text-align:left;">
      <div slot="header" class="clearfix">
        <span>默认后台管理页面首页-账户信息</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div class="text item">
        账户名:{{admin.username}}
      </div>
      <div class="text item">
        姓名:{{admin.name}}
      </div>
      <div class="text item">
        性别:
        <template v-if="admin.sex==1">
          男
        </template>
        <template v-else>
          女
        </template>
      </div>
      <div class="text item tag-group">
        角色数量:
        <!--<template v-for="role in admin.roles">
          <el-tag style="margin-right: 5px;">{{role.nameZH}}</el-tag>
        </template>-->
        <el-tag
          style="margin-right: 5px;"
          v-for="role in admin.roles"
          :key="role.id"
          type="primary"
          effect="dark">
          {{role.nameZH}}
        </el-tag>
      </div>
      <div class="text item">
        发布产品数量:{{admin.saveProductNumber}}
      </div>
      <div class="text item">
        注册时间:{{admin.createTime}}
      </div>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: 'AdminInfomation',
        data() {
            return {
                admin:''
            }
        },
        methods:{
            getMyAdmin() {//读取当前登陆的用户信息
                let _this=this;
                this.$axios
                    .get("/api/backstage/admin")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.admin = msg.data;
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
            },
        },
        mounted() {
            this.getMyAdmin();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
