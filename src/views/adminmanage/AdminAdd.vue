<template>
  <el-dialog
    title="管理员创建"
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    :close-on-press-escape="loading==false"
    :show-close="loading==false"
    width="500px"
    @opened="opened" >
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
        <el-radio-group v-model="adminForm.sex">
          <el-radio-button label="1">男</el-radio-button>
          <el-radio-button label="2">女</el-radio-button>
        </el-radio-group>
        <!--<el-select v-model="adminForm.sex" placeholder="请选择">
          <el-option value="1" label="男"></el-option>
          <el-option value="2" label="女"></el-option>
        </el-select>-->
      </el-form-item>
      <el-form-item label="角色" align="left" prop="roleIds">
        <el-checkbox-group v-model="adminForm.roleIds">
          <el-checkbox v-for="role in roles" :label="role.id" :key="role.nameZH"  name="roleIds">{{role.nameZH}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submitForm('adminForm')" :loading="loading">创建管理员</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "AdminAdd",
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
                loading:false,
                dialogFormVisible: false,
                adminForm: {
                    username: '',
                    password: '',
                    name: '',
                    sex:'',
                    roleIds:[]//已经选择的角色复选框的id集合，后端需要
                },
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
            opened(){//Dialog 打开动画结束时的回调
                for(let i=0;i<this.roles.length;i++){//遍历角色集合
                    let role=this.roles[i];
                    if(role.defaultRole==true){//如果是默认角色
                        this.adminForm.roleIds.push(role.id);//让复选框开始就选择默认角色
                    }
                }
            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.loading=true;
                        this.$axios//将更新后的值传到服务端保存
                            .post("/api/backstage/adminmanage",JSON.stringify(this.adminForm))
                            .then(response => {//获取返回数据
                                this.loading=false;
                                let msg=response.data;
                                if (msg.code === 0) {//如果提交成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.$refs[formName].resetFields();//重置表单
                                    this.$emit("adminTableRefresh");//刷新父组件的表格
                                }
                            })
                            .catch(error => {
                                this.loading=false;
                            });
                    } else {//如果验证不通过
                        return false;
                    }
                });
            },
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
