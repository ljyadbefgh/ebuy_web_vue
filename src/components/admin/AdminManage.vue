<template>
  <div>
    <el-card class="box-card" style="text-align:left;">
      <div slot="header" class="clearfix">
        <span>管理账户列表</span>
        <div style="float: right; " >
          <el-button type="text">操作方式：</el-button>
          <el-dropdown @command="handleOperator" trigger="click">
            <el-button type="primary">
              菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
<!--              :key="index"无意义，只是不加上去会控制台报错（但不影响运行）故此加上-->
              <el-dropdown-item v-for="(item,index) in operatorOptions" :command="item.value" :key="index">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="text item">
        <!--搜索栏-->
        <el-form :model="adminQuery"  :inline="true" style="text-align: left;" class="demo-form-inline">
          <el-form-item label="账户名" >
            <el-input v-model="adminQuery.username" placeholder="账户名"></el-input>
          </el-form-item>
          <el-form-item label="网名" >
            <el-input v-model="adminQuery.name" placeholder="网名"></el-input>
          </el-form-item>
          <el-select v-model="adminQuery.roleIds" @change="roleSelect" filterable  multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.nameZH"
              :value="item.id">
            </el-option>
          </el-select>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 表格插件-->
        <el-table
          @selection-change="handleSelectionChange"
          :data="tableData"
          stripe
          border
          style="width: 100%">
          <el-table-column type="selection" width="40" style="text-align: center;">
          </el-table-column>
          <el-table-column
            prop="username"
            label="账户名">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            :formatter="formatSex" >
          </el-table-column>
          <el-table-column
            prop="roleNumber"
            label="角色数量">
          </el-table-column>
          <el-table-column
            prop="saveProductNumber"
            label="发布产品数量">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="注册时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="unLocked"
            label="是否锁定"
            width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.unLocked"
                @change="unLockedChange($event,scope.row)"
                inactive-icon-class="el-icon-lock"
                active-icon-class="el-icon-unlock"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="250">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="primary" plain size="mini" icon="el-icon-user">角色分配</el-button>
              <el-button  @click="editAdmin(scope.row.id)" type="primary" plain  size="mini" icon="el-icon-edit">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页插件-->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            layout="prev,pager,next,total,sizes,jumper"
            :hide-on-single-page="hideOnSinglePage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :current-page="page"
            :total="total"
            :pager-count="11">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <!-- 管理员添加表单 -->
    <!--自定义方法（刷新表格数据）：@adminTableRefresh="getAdminList" ，用于将adminTableRefresh方法提供给子组件调用，子组件调用方法：this.$emit("adminTableRefresh")-->
    <!-- ref="adminAddForm",通过这个可以调用子组件相应的方法或属性 -->
    <AdminAdd
      ref="adminAddForm"
      @adminTableRefresh="getAdminList"
    />
    <AdminEdit
      ref="adminEditForm"
      @adminTableRefresh="getAdminList"
    />
  </div>
</template>

<script>
    export default {
        name: 'AdminManage',
        components: {
            AdminAdd: () => import("@/components/admin/AdminAdd.vue"),//引入管理员添加表单
            AdminEdit: () => import("@/components/admin/AdminEdit.vue")//引入管理员编辑表单
        },
        data() {
            return {
                tableData: [],//表格记录
                // 分页-传递到服务端的数值
                limit: 10,//每页的最大记录数
                page: 1,//当前页
                //分页-服务端返回的数值
                total:0,//总记录数
                hideOnSinglePage:false,//如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性。
                adminQuery:{//查询条件
                    'username': null,//账户名
                    'name': null,//姓名
                    'roleIds':[]//下拉框选择的角色集合
                },
                roles:[],//所有角色集合，用于从服务端获取，放到查询条件中展示
                operatorOptions: [{
                    value: 'add',
                    label: '添加管理账户'
                }, {
                    value: 'remove',
                    label: '批量删除管理账户'
                }, {
                    value: 'addRolesFordmin',
                    label: '批量赋予角色'
                }, {
                    value: 'removeRolesFromAdmin',
                    label: '批量移除角色'
                }],
                multipleSelection:[]//复选框选择的记录row
            }
        },
        methods: {
            handleClick(row) {
                console.log(row);
            },
            formatSex(row, column) {
                if(row.sex==1){
                    return '男';
                }else{
                    return '女';
                }
            },
            initRoleSelect(){//初始化角色下拉框
                this.$axios
                    .get("/api/backstage/rolemanage/all")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.roles = msg.data;
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
            },
            getAdminList() {//从服务端读取管理员列表
                this.$axios
                    .get("/api/backstage/adminmanage",{
                        params: {
                            page: this.page,
                            limit: this.limit,
                            username:this.adminQuery.username,
                            name:this.adminQuery.name,
                            roleIds:this.adminQuery.roleIds.toString()
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.tableData = msg.data;
                            this.total=msg.count;
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleCurrentChange(value) {//当分页插件的页码改变时触发，value表示前端分页点击的页码
                this.page = value;
                this.getAdminList();
            },
            handleSizeChange(value) {//当分页插件的每页显示数量改变时触发，value表示每页的分页数量
                this.limit = value;
                this.getAdminList();
            },
            roleSelect(value){//角色下拉框的值发生改变时触发
                this.getAdminList();
            },
            search(){//执行查询条件
                this.getAdminList();
            },
            unLockedChange(callback,row){//开关事件，针对管理员锁定滑块。callback为回调函数的值（开关的最新状态），id为管理账户的id属性值
               let admin={//封装属性到要传递的对象
                    id:row.id,
                    unLocked:callback
                }
                this.$axios//将更新后的值传到服务端保存
                    .put("/api/backstage/adminmanage",JSON.stringify(admin))
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {//如果修改成功
                            this.$message({
                                type: "success",
                                message: msg.msg
                            });
                        }else{//如果修改失败
                            this.$message.error(msg.msg);
                            row.unLocked=!callback;//让开关状态回到修改前
                        }
                    })
                    .catch(error => {
                        row.unLocked=!callback;//让开关状态回到修改前
                    });
            },
            handleOperator(command) {//点击更多菜单时的触发事件
                if(command=="remove"){
                    this.handleDelete();
                }else if(command=="add"){
                    this.$refs.adminAddForm.openDialog();
                }else{
                    this.$message('click on item ' + command);
                }
            },
            handleSelectionChange(value){//当选择项发生变化时会触发该事件，这里用于获取选择的记录（多选）.value可以获取所有选择了的行记录row
                this.multipleSelection=value;
            },
            checkSelection() {//判断是否选择了数据，用于批量操作前的验证
                if (this.multipleSelection && this.multipleSelection.length) {
                    return true
                } else {
                    this.$message.error('请先选择数据')
                }
            },
            handleDelete(){//批量删除管理账户
                if(this.checkSelection()){
                    let count=this.multipleSelection.length;
                    this.$confirm(" 确定要批量删除这"+count+"个账户吗？", "系统提示", {
                        confirmButtonText: "确定",//确定按钮的文本内容
                        cancelButtonText: "取消",//取消按钮的文本内容
                        type: "warning"
                    }).then(() => {//选择确认按钮后执行
                        var ids = [];//定义要批量删除的主键
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            ids.push(this.multipleSelection[i].id);
                        }
                        this.$axios
                            .delete("/api/backstage/adminmanage/deletes/"+ids.toString())
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {
                                    this.getAdminList();// 刷新表格数据
                                }else{
                                    this.$message.error(msg.msg);
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }).catch(error => {//选择取消按钮后执行
                        //console.error(error);
                    });
                }
            },
            editAdmin(id){//点击产品编辑按钮时出发，编辑相应的账户信息，id为账户的id
                this.$refs.adminEditForm.openDialog(id);//打开账户编辑窗口
            }
        },
        mounted() {
            this.initRoleSelect();//初始化角色下拉框
            this.getAdminList();// 获取表格数据
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
