<template>
  <el-dialog title="为选择的账户赋予相应的角色" :visible.sync="dialogFormVisible" width="600">
    <!--下面这个可以替换原始的dialog的标题样式-->  
   <!-- <div slot="title" class="header-title">
       <span>管理员创建</span>
       <el-divider></el-divider>
    </div>-->
    <el-form :model="adminForm" :rules="rules" ref="adminForm" label-width="80px">
      <el-form-item label="账户名" prop="adminIds" align="left">
        <el-checkbox-group v-model="adminForm.adminIds" >
          <el-checkbox v-for="admin in adminRows" :label="admin.id" :key="admin.username" name="adminIds">{{admin.username}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="角色" align="left" prop="roleIds">
        <el-checkbox-group v-model="adminForm.roleIds" >
          <el-checkbox v-for="role in roles" :label="role.id" :key="role.nameZH" :disabled="role.enabled==false" name="roleIds">{{role.nameZH}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
<!--      <el-button @click="dialogFormVisible = false">取 消</el-button>-->
      <el-button type="primary" @click="addRolesToAdmins('adminForm')">批量赋予角色</el-button>
      <el-button type="danger" @click="removeRolesFromAdmins('adminForm')" >批量移除角色</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "AdminRoleBatchOperation",
        props:{
            adminRows: {//获取从父组件传递过来的账户信息集合。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Array,
                default () {
                    return [];
                }
            },
            roles: {///取从父组件传递过来的所有角色信息集合。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Array,
                default () {
                    return [];
                }
            }
        },
        data() {
            return {
                dialogFormVisible: false,
                adminForm: {
                    adminIds: [],//已经选择的账户复选框的id集合
                    roleIds:[]//已经选择的角色复选框的id集合，后端需要
                },
                rules: {
                    adminIds: [
                        { type: 'array', required: true, message: '请至少选择一个账户', trigger: 'change' }
                    ],
                    roleIds: [
                        { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
                    ]
                },
            }

        },
        methods: {
            openDialog() {//打开对话框
                // 清空角色中上一次勾选的值，避免第二次打开还会存在
                //特别强调，this.adminForm.roleIds.length=0虽然可以清空数组，但是在checkbox插件里面不会自动刷新界面（实际已经清空）。只有 this.adminForm.roleIds=[]可以清空
                this.adminForm.roleIds=[];//特重要：清空角色中上一次勾选的值，避免第二次打开还会存在，不仅影响显示效果，还会让整个数组添加重复的值。（每次打开窗口都会累加之前的）
                this.adminForm.adminIds=[];//特重要：清空账户中上一次勾选的值，避免第二次打开还会存在，导致将多次打开窗口的值进行记录，导致账户值错误（每次打开窗口都会累加之前的）
                this.dialogFormVisible = true;
                for (let i = 0; i < this.adminRows.length; i++) {//获取父组件传递过来的账户集合
                    this.adminForm.adminIds.push(this.adminRows[i].id);//提取出Id绑定，这里是为了账户列表复选框默认为勾选状态设计
                }
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            addRolesToAdmins(formName) {//将角色批量赋予多个账户
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$axios//将更新后的值传到服务端保存
                            .post("/api/backstage/adminmanage/adminRoleRelationManage/addRolesForAdmins",JSON.stringify(this.adminForm))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: "操作成功"
                                    });
                                    this.closeDialog();//关闭窗口
                                    this.$emit("adminTableRefresh");//刷新父组件的表格
                                }else{//如果修改失败
                                    this.$message.error(msg.msg);
                                }
                            })
                            .catch(error => {

                            });
                    } else {//如果验证不通过
                        return false;
                    }
                });
            },
            removeRolesFromAdmins(formName) {//将角色批量从多个账户中删除
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$axios//将更新后的值传到服务端保存
                            .delete("/api/backstage/adminmanage/adminRoleRelationManage/removeRolesFromAdmins",{data: this.adminForm})
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: "操作成功"
                                    });
                                    this.closeDialog();//关闭窗口
                                    this.$emit("adminTableRefresh");//刷新父组件的表格
                                }else{//如果修改失败
                                    this.$message.error(msg.msg);
                                }
                            })
                            .catch(error => {

                            });
                    } else {//如果验证不通过
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
