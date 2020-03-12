<template>
    <div>
      <el-form :model="loginForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="login-container" label-position="left">
        <h3 class="login_title">订餐系统后台登陆</h3>
        <el-form-item label="账户名" prop="username">
          <el-input  v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input  show-password v-model="loginForm.password" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingButton">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loadingButton:false,
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
                        this.loadingButton=true;
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
                                this.$store.commit("save_admin",this.loginForm.username);//将账户信息存入
                                // _this.$store.commit("setUeditorServerUrlWithCredentials",msg.data);//客户端的session对象保存下来
                                this.$message({
                                        message:'登陆成功',
                                        type:'success'
                                    });
                                this.$router.push('admin');
                            }else{//如果登陆失败
                                this.loadingButton=false;
                            }
                        })
                        //获取失败
                        .catch(error=>{
                            this.loadingButton=false;
                        });
                    } else {//如果客户端验证失败
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
  /*设置表单样式*/
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;/*背景绘制在衬距方框内（剪切成衬距方框）。*/
    margin: 180px auto;/*让登陆界面居中*/
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
