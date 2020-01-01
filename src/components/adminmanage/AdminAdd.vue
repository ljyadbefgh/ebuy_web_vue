<template>
  <el-dialog title="管理员创建" :visible.sync="dialogFormVisible" width="500px" >
    <!--下面这个可以替换原始的dialog的标题样式-->  
   <!-- <div slot="title" class="header-title">
       <span>管理员创建</span>
       <el-divider></el-divider>
    </div>-->
    <el-form :model="adminForm" :rules="rules" ref="adminForm" label-width="80px">
      <el-form-item label="账户名" prop="username">
        <el-input v-model="adminForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="adminForm.password"></el-input>
      </el-form-item>
      <el-form-item label="网名" prop="name">
        <el-input v-model="adminForm.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" style="text-align: left;" prop="sex">
        <el-select v-model="adminForm.sex" placeholder="请选择">
          <el-option value="1" label="男"></el-option>
          <el-option value="2" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" align="left" prop="roleIds">
        <el-checkbox-group v-model="adminForm.roleIds">
          <el-checkbox v-for="role in roles" :label="role.id" :key="role.nameZH"  name="roleIds">{{role.nameZH}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('adminForm')">创建管理员</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "AdminAdd",
        data() {
            return {
                dialogFormVisible: false,
                adminForm: {
                    username: '',
                    password: '',
                    name: '',
                    sex:'',
                    roleIds:[]//已经选择的角色复选框的id集合，后端需要
                },
                roles:[],//从服务端获取的所有角色信息
                rules: {
                    username: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
                        { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
                    ],
                    password: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 6, max: 12, message: '长度在6到 12个字符', trigger: 'blur' },
                        { pattern: /\S$/, message: '不能出现空格', trigger: 'blur' }
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
            openDialog() {//打开对话框
                this.dialogFormVisible = true;
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            initRole(){//初始化角色列表
                this.$axios
                    .get("/api/backstage/rolemanage/all")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.roles = msg.data;
                            for(let i=0;i<this.roles.length;i++){//遍历角色集合
                                let role=this.roles[i];
                                if(role.defaultRole==true){//如果是默认角色
                                    this.adminForm.roleIds.push(role.id);//让复选框开始就选择默认角色
                                }
                            }
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$axios//将更新后的值传到服务端保存
                            .post("/api/backstage/adminmanage",JSON.stringify(this.adminForm))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.$refs[formName].resetFields();//重置表单
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
        },
        mounted() {
            this.initRole();
        }
    }
</script>

<style scoped>

</style>
