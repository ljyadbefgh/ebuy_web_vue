<template>
  <div>
      <div class="item">
        <!--搜索栏-->
        <el-form :model="adminQuery"  :inline="true" style="text-align: left;" class="demo-form-inline">
          <el-form-item label="账户名" >
            <el-input v-model="adminQuery.username" placeholder="账户名"></el-input>
          </el-form-item>
          <el-form-item label="网名" >
            <el-input v-model="adminQuery.name" placeholder="网名"></el-input>
          </el-form-item>
          <el-form-item label="角色" >
          <el-select v-model="adminQuery.roleIds" @change="roleSelect"  filterable  multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.nameZH"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="注册时间" >
            <el-date-picker
              v-model="adminQuery.createTimeQueryOfBegin"
              :picker-options="createTimeQueryOfBeginPickerOption"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          -
            <el-date-picker
              v-model="adminQuery.createTimeQueryOfEnd"
              :picker-options="createTimeQueryOfEndPickerOption"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAdminList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="adminQuery={};getAdminList();">清空查询条件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="item" align="left" style="margin-bottom: 5px;">
          <el-button @click="$refs.adminAddForm.openDialog()" type="primary"  size="mini">添加</el-button>
          <el-button @click="handleDelete" type="primary"  size="mini" :disabled="disabled">删除</el-button>
          <el-button @click="batchOperatorRoles" type="primary"  size="mini" :disabled="disabled">角色批量分配</el-button>
      </div>
      <div class="item">
        <!-- 表格插件-->
        <el-table
          @selection-change="handleSelectionChange"
          v-loading="tableLoading"
          element-loading-text="表格加载中，请稍后……"
          :data="tableData"
          stripe
          border
          style="width: 100%">
          <el-table-column type="selection" width="40" align="center">
          </el-table-column>
        <!--  <el-table-column type="index" width="60" label="序号" align="center">
          </el-table-column>-->
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
            width="50"
            align="center"
            prop="sex"
            label="性别"
            :formatter="formatSex" >
          </el-table-column>
          <el-table-column
            align="center"
            prop="roleNumber"
            label="角色数量">
            <template slot-scope="scope">
              <template v-if="scope.row.roleNumber>0">
                <el-popover  placement="top" effect="light" trigger="click">
                  <el-table :data="scope.row.roles">
                    <el-table-column width="150" property="name" label="角色中文名"></el-table-column>
                    <el-table-column width="150" property="nameZH" label="角色英文名"></el-table-column>
                    <el-table-column width="100" property="level" label="级别"></el-table-column>
                  </el-table>
                  <el-link type="primary" slot="reference">{{scope.row.roleNumber}}</el-link>
                </el-popover>
              </template>
              <template v-else>{{scope.row.roleNumber}}</template>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="menuNumber"
            label="菜单数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="saveProductNumber"
            label="发布产品数">
          </el-table-column>
          <el-table-column
            align="center"
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
            align="center"
            width="330">
            <template slot-scope="scope">
              <el-button  @click="editAdmin(scope.row.id)" type="primary" plain  size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button @click="manageRoles(scope.row)" type="primary" plain size="mini" icon="el-icon-user">角色分配</el-button>
              <el-button @click="readMenus(scope.row)" type="primary" plain size="mini" icon="el-icon-user">菜单预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <div class="text item">
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
    <!-- 管理员添加表单 -->
    <!--自定义方法（刷新表格数据）：@adminTableRefresh="getAdminList" ，用于将adminTableRefresh方法提供给子组件调用，子组件调用方法：this.$emit("adminTableRefresh")-->
    <!-- ref="adminAddForm",通过这个可以调用子组件相应的方法或属性 -->
    <AdminAdd
      ref="adminAddForm"
      @adminTableRefresh="getAdminList"
      :roles="this.roles"
    />
    <!-- 管理员编辑表单 -->
    <AdminEdit
      ref="adminEditForm"
      @adminTableRefresh="getAdminList"
      :roles="this.roles"
    />
    <!-- 管理员角色关系管理表单 -->
    <AdminRoleRelationManage
      ref="AdminRoleRelationManage"
      @adminTableRefresh="getAdminList"
    />
    <!-- 管理员角色批量添加/移除关系管理表单 -->
    <AdminRoleBatchOperation
      ref="AdminRoleBatchOperation"
      @adminTableRefresh="getAdminList"
      :adminRows="this.multipleSelection"
      :roles="this.roles"
    />
    <!-- 管理员角色批量添加/移除关系管理表单 -->
    <AdminMenuManage
      ref="adminMenuManage"
    />
  </div>
</template>

<script>
    export default {
        name: 'AdminManage',
        components: {
            AdminAdd: () => import("@/views/adminmanage/AdminAdd.vue"),//引入管理员添加表单
            AdminEdit: () => import("@/views/adminmanage/AdminEdit.vue"),//引入管理员编辑表单
            AdminRoleRelationManage: () => import("@/views/adminmanage/AdminRoleRelationManage.vue"),//引入管理员角色管理列表
            AdminRoleBatchOperation: () => import("@/views/adminmanage/AdminRoleBatchOperation.vue"),//引入批量将角色赋予多个管理员的组件
            AdminMenuManage:() => import("@/views/adminmanage/AdminMenuManage.vue")
        },
        data() {
            return {
                disabled:true,//用于批量删除和批量角色分配按钮的可用性属性，只有当选择了复选框时才可以操作
                tableLoading:false, //用于表格是否在加载中
                tableData: [],//表格记录
                // 分页-传递到服务端的数值
                limit: 20,//每页的最大记录数
                page: 1,//当前页
                //分页-服务端返回的数值
                total:0,//总记录数
                hideOnSinglePage:false,//如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性。
                createTimeQueryOfBeginPickerOption: {//日期插件-开始日期的设置
                    disabledDate: time => {
                        if (this.adminQuery.createTimeQueryOfEnd) {
                            // 让开始日期比结束日期少一天，86400000L=1天=24小时*60分钟*60秒*1000毫秒。
                            return time.getTime() > new Date(this.adminQuery.createTimeQueryOfEnd).getTime()-86400000;
                        }
                    }
                },
                createTimeQueryOfEndPickerOption: {//日期插件-截止日期的设置
                    disabledDate: time => {
                        if (this.adminQuery.createTimeQueryOfBegin) {
                            // 让结束日期比开始日期多一天，86400000L=1天=24小时*60分钟*60秒*1000毫秒。
                            return time.getTime() < new Date(this.adminQuery.createTimeQueryOfBegin).getTime()+86400000;
                        }
                    }
                },
                adminQuery:{//查询条件
                    'username': '',//账户名
                    'name': '',//姓名
                    'roleIds':[],//下拉框选择的角色集合
                    'createTimeQueryOfBegin':'',//注册日期范围-开始
                    'createTimeQueryOfEnd':''//注册日期范围-截止
                },
                roles:[],//所有角色集合，用于从服务端获取，放到查询条件中展示
                operatorOptions: [{
                    value: 'add',
                    label: '添加管理账户'
                }, {
                    value: 'remove',
                    label: '批量删除管理账户'
                }, {
                    value: 'batchOperatorRoles',
                    label: '批量赋予/取消角色'
                }],
                multipleSelection:[]//复选框选择的记录row
            }
        },
        methods: {
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
                        }
                    })
            },
            getAdminList() {//从服务端读取管理员列表
                let roleIdsString=null;
                if(this.adminQuery.roleIds!=null){//必须要角色集合有值才进行toString()转换，否则会出异常
                    roleIdsString=this.adminQuery.roleIds.toString();
                }
                this.tableLoading=true;
                this.$axios
                    .get("/api/backstage/adminmanage",{
                        params: {
                            page: this.page,
                            limit: this.limit,
                            username:this.adminQuery.username,
                            name:this.adminQuery.name,
                            roleIds:roleIdsString,
                            createTimeQueryOfBegin:this.adminQuery.createTimeQueryOfBegin,
                            createTimeQueryOfEnd:this.adminQuery.createTimeQueryOfEnd
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        this.tableLoading=false;
                        if (msg.code === 0) {
                            this.tableData = msg.data;
                            this.total=msg.count;
                        }
                    })
                    .catch(error => {
                        this.tableLoading=false;
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
                };
                this.tableLoading=true;
                this.$axios//将更新后的值传到服务端保存
                    .put("/api/backstage/adminmanage",JSON.stringify(admin))
                    .then(response => {//获取返回数据
                        this.tableLoading=false;
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
                        this.tableLoading=false;
                        row.unLocked=!callback;//让开关状态回到修改前
                    });
            },
            handleSelectionChange(selection){//当选择项发生变化时会触发该事件，这里用于获取选择的记录（多选）.value可以获取所有选择了的行记录row
                this.multipleSelection=selection;
                if(this.multipleSelection.length>0){//如果选择了记录
                    this.disabled=false;
                }else{//如果没有选择记录
                    this.disabled=true;
                }
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
                                }
                            })
                    }).catch(error => {//选择取消按钮后执行
                        //console.error(error);
                    });
                }
            },
            batchOperatorRoles(){//处理批量添加角色给多个账户的请求
                if(this.checkSelection()){//选择了记录才打开窗口
                    this.$refs.AdminRoleBatchOperation.openDialog();//打开相应窗口
                }
            },
            editAdmin(id){//点击编辑按钮时出发，编辑相应的账户信息，id为账户的id
                this.$refs.adminEditForm.openDialog(id);//打开账户编辑窗口
            },
            manageRoles(row){
                this.$refs.AdminRoleRelationManage.openDialog(row.id,row.username);//打开角色关系管理窗口
            },
            readMenus(row){//打开菜单预览
                this.$refs.adminMenuManage.openDialog(row.id);//打开菜单预览管理窗口
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

</style>
