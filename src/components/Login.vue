<template>
    <div>
      <el-divider content-position="left">订餐系统后台登陆界面</el-divider>
      <el-form :model="loginForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户名" prop="username">
          <el-input type="username" v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入账户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '账户名长度必须在3-10个字符之间', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 12, message: '密码长度必须在6-12个字符之间', trigger: 'blur' }
                    ],
                }
            };

        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        let _this=this;//保留出发事件的this对象
                        this.$axios.get('/api/backstage/login',{
                            params:{
                                username:this.loginForm.username,
                                password:this.loginForm.password
                            }
                        })
                        //then获取成功；response成功后的返回值（对象）
                        .then(response=>{
                            let msg=response.data;//获取返回数据
                            if(msg.code==0){//如果登陆成功
                                _this.$store.commit("save_admin",_this.loginForm.username);//将账户信息存入
                                _this.$message({
                                        message:'登陆成功',
                                        type:'success'
                                    });
                                _this.$router.push('admin');
                            }else{
                                _this.$message.error(msg.msg);
                            }
                        })
                        //获取失败
                        .catch(error=>{
                            console.log(error);
                            console.log('网络错误，不能访问');
                        });
                    } else {//如果客户端验证失败
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
