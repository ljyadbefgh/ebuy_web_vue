<template>
  <div>
    <div class="item">
      <!--搜索栏-->
      <el-form :model="customerQuery"  :inline="true" style="text-align: left;" class="demo-form-inline">
        <el-form-item label="账户名" >
          <el-input v-model="customerQuery.username" placeholder="账户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="$refs.customerSearchForm.openDialog()">高级查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="customerQuery={};getCustomers();">清空查询条件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格工具栏-->
    <div class="item" align="left" style="margin-bottom: 5px;">
      <el-button @click="$refs.customerAddForm.openDialog()" type="primary">添加</el-button>
      <el-button @click="handleDelete" type="primary"  :disabled="disabled">删除</el-button>
      <el-button @click="removeCustomersProfilePicture" type="primary"  :disabled="disabled">移除头像</el-button>
    </div>
    <!--表格-->
    <div class="item">
      <!-- 表格插件-->
      <el-table
        @selection-change="handleSelectionChange"
        :data="table.tableData"
        stripe
        border
        style="width: 100%">
        <el-table-column type="selection" width="40" align="center">
        </el-table-column>
        <!--  <el-table-column type="index" width="60" label="序号" align="center">
          </el-table-column>-->
        <el-table-column
          width="80"
          prop="picUrl"
          align="center"
          label="头像">
          <template  slot-scope="scope">
            <!--用div来限制el-image的高度，避免el-image会有部分高度超出——原因未明-->
            <div style="display: block;height:30px;">
              <el-image
                style="height:30px;"
                v-if="scope.row.picUrl!=null&&scope.row.picUrl!=''"
                fit="contain"
                :src="scope.row.picUrl"
                :preview-src-list="[scope.row.picUrl]"></el-image>
              <el-image
                v-else
                style="height:30px;"
                fit="contain"
                :src="myVariable.pic.noPicSrc"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="username"
          label="用户名">
        </el-table-column>
        <el-table-column
          width="85"
          align="center"
          prop="initialPasswordStatus"
          label="密码状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.initialPasswordStatus==true" type="danger">初始密码</el-tag>
            <el-tag v-if="scope.row.initialPasswordStatus==false" type="success">已变更</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="70"
          show-overflow-tooltip
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          width="50"
          align="center"
          prop="sex"
          label="性别">
          <template slot-scope="scope">
            <template v-if="scope.row.sex==1">男</template>
            <template v-else-if="scope.row.sex==2">女</template>
            <template v-else>未选择</template>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="tel"
          label="电话">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          width="70"
          show-overflow-tooltip
          align="center"
          prop="zip"
          label="邮编">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          width="60"
          align="center"
          show-overflow-tooltip
          prop="productOrderNumber"
          label="订单数">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="360">
          <template slot-scope="scope">
            <el-button  @click="edit(scope.row.id)" type="primary" plain  icon="el-icon-edit">编辑</el-button>
            <el-button @click="uploadPhoto(scope.row.id)" type="primary" plain  icon="el-icon-user">上传头像</el-button>
            <el-button @click="resetPassword(scope.row)" type="primary" plain  icon="el-icon-user">重置密码</el-button>
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
          :hide-on-single-page="table.hideOnSinglePage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="table.limit"
          :current-page="table.page"
          :total="table.total"
          :pager-count="11">
        </el-pagination>
      </div>
    </div>
    <!-- 客户添加表单 -->
    <CustomerAdd
      ref="customerAddForm"
      @customerTableRefresh="getCustomers"
    />
    <!-- 客户编辑表单 -->
    <CustomerEdit
      ref="customerEditForm"
      @customerTableRefresh="getCustomers"
    />
    <!-- 客户头像上传表单 -->
    <CustomerPhotoUpload
      ref="customerPhotoUpload"
      @customerTableRefresh="getCustomers"
    />
    <!-- 客户高级搜索 -->
    <CustomerSearch
      ref="customerSearchForm"
      :customerQuery="customerQuery"
      @customerTableRefresh="getCustomers"
    />
  </div>
</template>

<script>
    export default {
        name: "CustomerManage",
        components: {
            CustomerAdd: () => import("@/views/customermanage/CustomerAdd.vue"),//引入客户添加表单
            CustomerEdit: () => import("@/views/customermanage/CustomerEdit.vue"),//引入客户编辑表单
            CustomerPhotoUpload: () => import("@/views/customermanage/CustomerPhotoUpload.vue"),//引入客户头像上传表单
            CustomerSearch: () => import("@/views/customermanage/CustomerSearch.vue")//引入客户高级搜索表单
        },
        data() {
            return {
                disabled:true,//用于批量操作等按钮的可用性属性，只有当选择了复选框时才可以操作
                table:{// 记录表格数据
                    tableData: [],//表格记录
                    // 分页-传递到服务端的数值
                    limit: 10,//每页的最大记录数
                    page: 1,//当前页
                    //分页-服务端返回的数值
                    total:0,//总记录数
                    hideOnSinglePage:false,//如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性。
                },
                multipleSelection:[],//复选框选择的记录row
                customerQuery:{//查询条件
                    'username': null,//账户名
                    'name': null,//姓名
                    'sex':null,
                    'changeInitialPassword':'',
                    'uploadPhoto':null
                },
            }
        },
        methods:{
            getCustomers() {//从服务端读取客户列表
                this.$axios
                    .get("/api/backstage/customermanage",{
                        params: {
                            page: this.table.page,
                            limit: this.table.limit,
                            username:this.customerQuery.username,
                            name:this.customerQuery.name,
                            sex:this.customerQuery.sex,
                            changeInitialPassword:this.customerQuery.changeInitialPassword,
                            uploadPhoto:this.customerQuery.uploadPhoto
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.table.tableData = msg.data;
                            this.table.tableData.forEach(function(row) {
                                if(row.picUrl!=null&&row.picUrl!=''){
                                    row.picUrl=row.picUrl+"?"+Math.random();//重要：被坑了很久实验多次才成功，并且要这里设置（不能在图片里设置，否则会不断刷新影响效果）。重要：被坑了很久实验多次才成功，并且要这里设置。设置图片地址不缓存，因为如果头像有上传，地址都是一样的（服务端决定）。因此如果不加入，浏览器会因为图片地址不变化设置缓存，导致新上传的图片无法在浏览器显示
                                    //row.picUrl.join("?"+Math.random());
                                }
                            });
                            this.table.total=msg.count;
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleCurrentChange(value) {//当分页插件的页码改变时触发，value表示前端分页点击的页码
                this.table.page = value;
                this.getCustomers();
            },
            handleSizeChange(value) {//当分页插件的每页显示数量改变时触发，value表示每页的分页数量
                this.table.limit = value;
                this.getCustomers();
            },
            handleSelectionChange(value){//当选择项发生变化时会触发该事件，这里用于获取选择的记录（多选）.value可以获取所有选择了的行记录row
                this.multipleSelection=value;
                if(this.multipleSelection.length>0){//如果选择了记录
                    this.disabled=false;
                }else{//如果没有选择记录
                    this.disabled=true;
                }
            },
            checkSelection() {//判断是否选择了数据，用于批量操作前的验证
                if (this.multipleSelection.length>0) {
                    return true
                } else {
                    this.$message.error('请先选择数据')
                }
            },
            handleDelete(){//批量删除管理账户
                if(this.checkSelection()){
                    let count=this.multipleSelection.length;
                    this.$confirm(" 确定要批量删除这"+count+"个客户信息吗？", "系统提示", {
                        confirmButtonText: "确定",//确定按钮的文本内容
                        cancelButtonText: "取消",//取消按钮的文本内容
                        type: "warning"
                    }).then(() => {//选择确认按钮后执行
                        var ids = [];//定义要批量删除的主键
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            ids.push(this.multipleSelection[i].id);
                        }
                        this.$axios
                            .delete("/api/backstage/customermanage/"+ids.toString())
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {
                                    this.getCustomers();// 刷新表格数据
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
            removeCustomersProfilePicture(){//批量移除客户的头像
                if(this.checkSelection()){
                    let count=this.multipleSelection.length;
                    this.$confirm(" 确定要批量删除这"+count+"个账户的头像吗？移除后相关照片都将无法恢复！", "系统提示", {
                        confirmButtonText: "确定",//确定按钮的文本内容
                        cancelButtonText: "取消",//取消按钮的文本内容
                        type: "warning"
                    }).then(() => {//选择确认按钮后执行
                        let ids = [];//定义要批量删除的主键
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            ids.push(this.multipleSelection[i].id);
                        }
                        this.$axios
                            .delete("/api/backstage/customermanage/customersProfilePicture/"+ids.toString())
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {
                                    this.getCustomers();// 刷新表格数据
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
            edit(id){// 编辑账户
                this.$refs.customerEditForm.openDialog(id);
            },
            uploadPhoto(id){// 头像上传
                this.$refs.customerPhotoUpload.openDialog(id);
            },
            resetPassword(row){//重置密码
                this.$confirm("确定重置账户（" + row.username + "）的密码吗？", "系统提示", {
                    confirmButtonText: "确定",//确定按钮的文本内容
                    cancelButtonText: "取消",//取消按钮的文本内容
                    type: "warning"
                }).then(() => {//选择确认按钮后执行
                    this.$axios
                        .patch("/api/backstage/customermanage/resetPassword/"+row.id)
                        .then(response => {//获取返回数据
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.getCustomers();// 刷新表格数据
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
            },
            search(){//执行查询条件--简单查询
                let username=this.customerQuery.username;//保留账户名的查询条件
                this.customerQuery={username:username};//清空高级查询条件
                this.getCustomers();
            }
        },
        mounted() {
            this.getCustomers();// 获取表格数据
        }
    }
</script>

<style scoped>

</style>
