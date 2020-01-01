<template>
  <el-dialog title="角色关系管理" :visible.sync="dialogFormVisible"  width="100%" @opened="openDialogChecked">
    <el-table
      :data="tableData"
      @selection-change="clickCheckBox"
      stripe
      border
      style="width: 100%">
      <el-table-column type="selection" width="40" style="text-align: center;" >
      </el-table-column>
      <el-table-column
        prop="admin.username"
        label="账户名">
      </el-table-column>
      <el-table-column
        prop="role.nameZH"
        label="角色中文名">
      </el-table-column>
      <el-table-column
        prop="role.name"
        label="角色英文名">
      </el-table-column>
      <el-table-column
        prop="role.level"
        label="级别">
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
    </el-table>
  </el-dialog>
</template>

<script>
    export default {
        name: "AdminRoleRelationManage",
        // 接受父组件的值
        /*props: {
            id: String
        },*/
        data() {
            return {
                id:'',//接收传递过来的id的值
                dialogFormVisible: false,
                //roleIds:[],//必须要先初始化，否则界面打开时虽然会正常显示但控制台会打印错误信息。原因是该组件打开时会首先根据roleIds初始化复选框已勾选的值，如果该属性不存在会打印错误；但随后通过远程访问会重新创建该属性并赋值，因此依旧能正常显示。
                tableData:[]//从服务端获取的所有角色关系信息
            }

        },
        methods: {
            openDialog(id) {//打开对话框
                this.dialogFormVisible = true;
                this.id=id;
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            openDialogChecked(){//Dialog 打开的回调，检查父组件是否传递了id过来
                if(this.id==''){//如果没有接收到父窗口传递过来的值
                    this.closeDialog();//关闭窗口
                    this.$message.error("没有接收到要编辑的账户信息");
                }else{//如果有id,读取账户信息
                    this.$axios
                        .get("api/backstage/adminmanage/"+this.id+"/adminRoleRelationManage")
                        .then(response => {//获取返回数据/
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.tableData = msg.data;
                                /*this.adminForm.roleIds=new Array();//创建已经选择的角色复选框的id集合，后端需要
                                for (let i = 0; i < this.adminForm.roles.length; i++) {//获取该账户拥有的角色集合
                                    this.adminForm.roleIds.push(this.adminForm.roles[i].id);
                                }
                                //本处Ljy被坑了：然后将服务端传递过来的性别的值改为字符串类型，只有这样才能正确初始化下拉框—。至于原因是初始化时只能识别字符串
                                this.adminForm.sex=String(this.adminForm.sex);*/
                            }else{
                                this.$message.error(msg.msg);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            },
            clickCheckBox(val,val2) {//点击表格中的复选框出发，用于添加或取消角色关系
                console.log("点击1",val);
                console.log("点击2",val2);
                console.log("点击3");
            }
        },
    }
</script>

<style scoped>

</style>
