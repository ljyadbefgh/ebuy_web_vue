<template>
  <el-dialog
    title="菜单管理"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :fullscreen="true"
    @opened="opened"
    @closed="closed"
    align="left">
    <div class="item">
      <!-- 表格插件-->
      <el-table
        ref="rolePurviewTable"
        @select="tableSelect"
        @select-all="tableSelectAll"
        :data="table.tableData"
        stripe
        border
        style="width: 100%">
        <el-table-column type="selection" width="40" align="center">
        </el-table-column>
        <!--  <el-table-column type="index" width="60" label="序号" align="center">
          </el-table-column>-->
        <el-table-column
          prop="role.nameZH"
          label="角色名">
        </el-table-column>
        <el-table-column
          prop="purview.name"
          label="权限名">
        </el-table-column>
        <el-table-column
          prop="purview.url"
          label="路径">
        </el-table-column>
        <el-table-column
          prop="purview.enabled"
          label="是否启用">
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.purview.enabled==true" type="success">是</el-tag>
            <el-tag size="medium" v-if="scope.row.purview.enabled==false" type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作权限"
          align="center"
          width="300">
          <template slot-scope="scope">
              <el-checkbox-button v-for="(item,index) in scope.row.permissions" :label="item.name" :key="item.id" v-model="item.selected" @change="permissionsChange($event,scope.row,item)">{{item.name}}</el-checkbox-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
      </el-table>
    </div>

  </el-dialog>
</template>

<script>
    export default {
        name: "RolePurviewManage",
        data() {
            return {
                dialogFormVisible: false,
                disabled:true,//用于批量删除和批量角色分配按钮的可用性属性，只有当选择了复选框时才可以操作
                roleId:'',//当前的角色id
                table:{// 记录表格数据
                    tableData: [],//表格记录
                    // 分页-传递到服务端的数值
                    limit: 10,//每页的最大记录数
                    page: 1,//当前页
                    //分页-服务端返回的数值
                    total:0,//总记录数
                    hideOnSinglePage:false//如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性
                },
                multipleSelection:[]//复选框选择的记录row
            }
        },
        methods: {
            openDialog(id) {//打开对话框
                this.dialogFormVisible = true;
                this.roleId=id;
                this.$nextTick(()=>{//防止窗口还没有显示就开始网络连接，导致全局Lodding覆盖不了该窗口
                    this.getRolePurviews();//从服务端读取该角色的所有权限关系
                });
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            opened(){//Dialog 打开动画结束时的回调

            },
            closed(){
                this.$emit("roleTableRefresh");//刷新父组件的表格
            },
            getRolePurviews(){//从服务端读取该角色的所有权限关系
                this.$axios
                    .get("/api/backstage/rolemanage/"+this.roleId+"/rolePurviewRelationManage")
                    .then(response => {//获取返回数据
                        let msg = response.data;
                        if (msg.code === 0) {
                            this.table.tableData = msg.data;
                            this.table.total = msg.count;
                            //将已经获取的权限勾选出来
                            //这里必须配合$nextTick使用，否则选择数据更新后并不会显示出来
                            this.$nextTick(function(){//$nextTick是在下一次dom更新循环结束之后执行延迟回调，在修改数据之后使用这个方法，立即更新dom.
                                this.table.tableData.forEach(row => {
                                    if(row.id!=null){//如果关系有主键，则说明在数据库中已经存在该关系
                                        this.$refs.rolePurviewTable.toggleRowSelection(row,true);
                                    }
                                });
                            });
                        }
                    });
            },
            tableSelect(selection, row){//当用户手动勾选数据行的 Checkbox 时触发的事件.selection表示当前选中的行（多个），row表示当前的行
                let selected = selection.length>0 && selection.indexOf(row) !== -1;// 获取当前的勾选状态
                if(selected){//如果该选项勾选了,则添加该关系
                    this.$axios
                        .post("/api/backstage/rolemanage/"+row.role.id+"/rolePurviewRelationManage/"+row.purview.id)
                        .then(response => {//获取返回数据
                            let msg = response.data;
                            if (msg.code === 0) {//如果操作成功
                                let rolePurview = msg.data;//获取添加后服务端存储的角色权限信息
                                this.$message({
                                    type: "success",
                                    message: "操作成功"
                                });
                                row=Object.assign(row, rolePurview);//合并对象的值（如果对象本身存在的属性会更新,不存在的属性会增加。注意根据业务场合，这里可以用），不能直接对象引用，否则无法更改表格原来的数据
                            } else {//如果操作失败，则取消当前行勾选的复选框
                                //取消勾选状态
                                this.$refs.rolePurviewTable.toggleRowSelection(row,!selected);
                            }
                        })
                        .catch(error => {
                            //取消勾选状态
                            this.$refs.rolePurviewTable.toggleRowSelection(row,!selected);
                        });
                }else{//如果取消了该行的勾选
                    this.$axios
                        .delete("/api/backstage/rolemanage/"+row.role.id+"/rolePurviewRelationManage/"+row.purview.id)
                        .then(response => {//获取返回数据
                            let msg = response.data;
                            if (msg.code === 0) {//如果操作成功
                                this.$message({
                                    type: "success",
                                    message: "操作成功"
                                });
                                let permissions=row.permissions;//对权限的动作进行处理
                                permissions.forEach(permission => {
                                    if(permission.selected==true){//如果动作是选中状态
                                        permission.selected=null;//取消选中状态
                                    }
                                });
                                row=Object.assign(row, { id: null}, { createTime: null },{permissions,permissions});//合并对象的值（注意根据业务场合，这里可以用），不能直接对象引用，否则无法更改表格原来的数据
                            } else {//如果操作失败，则取消当前行勾选的复选框
                                //取消勾选状态
                                this.$refs.rolePurviewTable.toggleRowSelection(row,!selected);
                            }
                        })
                        .catch(error => {
                            //取消勾选状态
                            this.$refs.rolePurviewTable.toggleRowSelection(row,!selected);
                        });
                }
            },
            permissionsChange(callback,row,item){//修改权限对应的动作。callback为回调函数的值（表示复选框是否勾选，row为当前行，item为当前点击的权限动作复选框（单个）
                if(callback){//如果是选中状态
                    //添加该关系
                    this.$axios
                        .post("/api/backstage/rolemanage/"+row.role.id+"/rolePurviewRelationManage/"+row.purview.id+"/rolePurviewMethod/"+item.id)
                        .then(response => {//获取返回数据
                            let msg = response.data;
                            if (msg.code === 0) {//如果操作成功
                                let rolePurview = msg.data;//获取添加后服务端存储的角色权限信息
                                this.$message({
                                    type: "success",
                                    message: "操作成功"
                                });
                            } else {//如果操作失败，则取消当前行勾选的复选框
                                //取消勾选状态
                                item.selected=!callback;
                            }
                        })
                        .catch(error => {
                            //取消勾选状态
                            item.selected=!callback;
                        });
                }else{//如果是取消状态
                    //添加该关系
                    this.$axios
                        .delete("/api/backstage/rolemanage/"+row.role.id+"/rolePurviewRelationManage/"+row.purview.id+"/rolePurviewMethod/"+item.id)
                        .then(response => {//获取返回数据
                            let msg = response.data;
                            if (msg.code === 0) {//如果操作成功
                                let rolePurview = msg.data;//获取添加后服务端存储的角色权限信息
                                this.$message({
                                    type: "success",
                                    message: "操作成功"
                                });
                            } else {//如果操作失败，则重新勾选当前取消的复选框
                                //重新勾选
                                item.selected=!callback;
                            }
                        })
                        .catch(error => {
                            //重新勾选
                            item.selected=!callback;
                        });
                }
            },
            tableSelectAll(selection){//当用户手动勾选全部.selection表示当前选中的行（多个）)
                if(selection.length==0){//表示勾选了：取消全选
                    //添加该关系
                    this.$axios
                        .delete("/api/backstage/rolemanage/"+this.roleId+"/rolePurviewRelationManage")
                        .then(response => {//获取返回数据
                            let msg = response.data;
                            if (msg.code === 0) {//如果操作成功
                                this.$message({
                                    type: "success",
                                    message: "成功移除所有角色关系"
                                });
                            }
                            this.getRolePurviews();// 从服务端读取该角色的所有权限关系
                        })
                        .catch(error => {
                            this.getRolePurviews();// 从服务端读取该角色的所有权限关系
                        });
                }else{// 表示勾选了：全选
                    //添加该关系
                    this.$axios
                        .post("/api/backstage/rolemanage/"+this.roleId+"/rolePurviewRelationManage")
                        .then(response => {//获取返回数据
                            let msg = response.data;
                            if (msg.code === 0) {//如果操作成功
                                this.$message({
                                    type: "success",
                                    message: "成功为角色赋予所有权限关系"
                                });
                            }
                            this.getRolePurviews();// 从服务端读取该角色的所有权限关系
                        })
                        .catch(error => {
                            this.getRolePurviews();// 从服务端读取该角色的所有权限关系
                        });
                }
            }

        }
    }
</script>

<style scoped>

</style>
