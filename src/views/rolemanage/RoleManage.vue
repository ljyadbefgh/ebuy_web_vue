<template>
  <div>
    <div class="item" align="left" style="margin-bottom: 5px;">
      <el-button @click="$refs.roleAddForm.openDialog()" type="primary"  size="mini">添加</el-button>
      <el-button @click="handleDelete" type="primary"  size="mini" :disabled="disabled">删除</el-button>
    </div>
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
          prop="nameZH"
          label="中文名">
        </el-table-column>
        <el-table-column
          prop="name"
          label="英文名">
        </el-table-column>
        <el-table-column
          width="50"
          align="center"
          prop="level"
          label="级别">
        </el-table-column>
        <el-table-column
          width="70"
          align="center"
          prop="defaultRole"
          label="默认角色">
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.defaultRole==true" type="success">是</el-tag>
            <el-tag size="medium" v-if="scope.row.defaultRole==false" type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="70"
          align="center"
          prop="enabled"
          label="是否启用">
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.enabled==true" type="success">是</el-tag>
            <el-tag size="medium" v-if="scope.row.enabled==false" type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="description"
          label="角色描述">
        </el-table-column>
        <el-table-column
          width="60"
          align="center"
          prop="adminNumber"
          label="账户数">
        </el-table-column>
        <el-table-column
          width="60"
          align="center"
          prop="purviewNumber"
          label="权限数">
        </el-table-column>
        <el-table-column
          width="60"
          align="center"
          prop="menuNumber"
          label="菜单数">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="350">
          <template slot-scope="scope">
            <el-button  @click="editRole(scope.row.id)" type="primary" plain  icon="el-icon-edit">编辑</el-button>
            <el-button @click="menuManage(scope.row.id)" type="primary" plain  icon="el-icon-user">菜单分配</el-button>
            <el-button @click="purviewManage(scope.row.id)" type="primary" plain  icon="el-icon-user">权限分配</el-button>
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


    <!-- 角色添加表单 -->
    <RoleAdd
      ref="roleAddForm"
      @roleTableRefresh="getRoles"
    />
    <!-- 角色编辑表单 -->
    <RoleEdit
      ref="roleEditForm"
      @roleTableRefresh="getRoles"
    />
    <!-- 角色菜单管理表单 -->
    <RoleMenuManage
      ref="roleMenuManageForm"
      @roleTableRefresh="getRoles"
    />
    <!-- 角色权限管理表单 -->
    <RolePurviewManage
      ref="rolePurviewManageForm"
      @roleTableRefresh="getRoles"
    />
  </div>
</template>

<script>
    export default {
        name: "RoleManage",
        components: {
            RoleAdd: () => import("@/views/rolemanage/RoleAdd.vue"),//引入角色添加表单
            RoleEdit: () => import("@/views/rolemanage/RoleEdit.vue"),//引入角色编辑表单
            RoleMenuManage: () => import("@/views/rolemanage/RoleMenuManage.vue"),//引入角色菜单管理表单
            RolePurviewManage: () => import("@/views/rolemanage/RolePurviewManage.vue")//引入角色权限管理表单
        },
        data() {
            return {
                disabled:true,//用于批量删除和批量角色分配按钮的可用性属性，只有当选择了复选框时才可以操作
                table:{// 记录表格数据
                    tableData: [],//表格记录
                    // 分页-传递到服务端的数值
                    limit: 20,//每页的最大记录数
                    page: 1,//当前页
                    //分页-服务端返回的数值
                    total:0,//总记录数
                    hideOnSinglePage:false,//如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性。
                },
                multipleSelection:[]//复选框选择的记录row
            }
        },
        methods:{
            getRoles() {//从服务端读取角色列表
                this.$axios
                    .get("/api/backstage/rolemanage",{
                        params: {
                            page: this.table.page,
                            limit: this.table.limit,
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.table.tableData = msg.data;
                            this.table.total=msg.count;
                        }
                    });
            },
            handleCurrentChange(value) {//当分页插件的页码改变时触发，value表示前端分页点击的页码
                this.table.page = value;
                this.getRoles();
            },
            handleSizeChange(value) {//当分页插件的每页显示数量改变时触发，value表示每页的分页数量
                this.table.limit = value;
                this.getRoles();
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
                    this.$confirm(" 确定要批量删除这"+count+"个角色吗？", "系统提示", {
                        confirmButtonText: "确定",//确定按钮的文本内容
                        cancelButtonText: "取消",//取消按钮的文本内容
                        type: "warning"
                    }).then(() => {//选择确认按钮后执行
                        var ids = [];//定义要批量删除的主键
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            ids.push(this.multipleSelection[i].id);
                        }
                        this.$axios
                            .delete("/api/backstage/rolemanage/"+ids.toString())
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {
                                    this.getRoles();// 刷新表格数据
                                }
                            });
                    }).catch(error => {//选择取消按钮后执行
                        //console.error(error);
                    });
                }
            },
            editRole(id){
                this.$refs.roleEditForm.openDialog(id);
            },
            menuManage(id){
                this.$refs.roleMenuManageForm.openDialog(id);
            },
            purviewManage(id){
                this.$refs.rolePurviewManageForm.openDialog(id);
            }
        },
        mounted() {
            this.getRoles();// 获取表格数据
        }
    }
</script>

<style scoped>

</style>
