<template>
  <el-dialog title="管理员修改" :visible.sync="dialogFormVisible"  v-loading="loading" width="500px" @opened="openDialogChecked" @closed="closeDailogClean">
    <!--下面这个可以替换原始的dialog的标题样式-->  
   <!-- <div slot="title" class="header-title">
       <span>管理员创建</span>
       <el-divider></el-divider>
    </div>-->
    <el-form :model="adminForm" :rules="rules" ref="adminForm" label-width="80px">
      <el-form-item label="账户名" prop="username">
        <el-input v-model="adminForm.username"></el-input>
      </el-form-item>
      <el-form-item label="网名" prop="name">
        <el-input v-model="adminForm.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" style="text-align: left;" prop="sex">
        <el-select v-model="adminForm.sex" placeholder="请选择">
          <el-option key="1" value="1" label="男"></el-option>
          <el-option key="2" value="2" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" align="left" prop="roleIds">
        <el-checkbox-group v-model="adminForm.roleIds" >
          <el-checkbox v-for="role in roles" :label="role.id" :key="role.nameZH" name="roleIds">{{role.nameZH}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('adminForm')">确认修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "AdminEdit",
        // 接受父组件的值
        props:{
            roles: {///取从父组件传递过来的所有角色信息集合。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Array,
                default () {
                    return [];
                }
            }
        },
        data() {
            return {
                id:'',//接收传递过来的id的值
                dialogFormVisible: false,
                loading:false,//对应Loadding组件
                adminForm:{
                    roleIds:[]//必须要先初始化，否则界面打开时虽然会正常显示但控制台会打印错误信息。原因是该组件打开时会首先根据roleIds初始化复选框已勾选的值，如果该属性不存在会打印错误；但随后通过远程访问会重新创建该属性并赋值，因此依旧能正常显示。
                },
                rules: {
                    username: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
                        { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
                    ],
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { max: 8, message: '长度不能超过8个字符', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    roleIds: [
                        { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
                    ]
                },
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
                    this.loading=true;
                    this.$axios
                        .get("api/backstage/adminmanage/"+this.id)
                        .then(response => {//获取返回数据/
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.adminForm = msg.data;
                                this.adminForm.roleIds=new Array();//创建已经选择的角色复选框的id集合，后端需要
                                for (let i = 0; i < this.adminForm.roles.length; i++) {//获取该账户拥有的角色集合
                                    this.adminForm.roleIds.push(this.adminForm.roles[i].id);
                                }
                                //本处Ljy被坑了：然后将服务端传递过来的性别的值改为字符串类型，只有这样才能正确初始化下拉框—。至于原因是初始化时只能识别字符串
                                this.adminForm.sex=String(this.adminForm.sex);
                                this.loading=false;
                            }else{
                                this.$message.error(msg.msg);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            },
            closeDailogClean() {//Dialog 关闭动画结束时的回调。这里是在关闭窗口时清空窗口的编辑信息
                this.$refs["adminForm"].resetFields();//重置表单，以免下次打开时还存在，导致让客户看到值变化的过程
            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$axios//将更新后的值传到服务端保存
                            .put("/api/backstage/adminmanage",JSON.stringify(this.adminForm))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.$emit("adminTableRefresh");//刷新父组件的表格
                                    this.closeDialog();//关闭对话框
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
        }
    }
</script>

<style scoped>

</style>
