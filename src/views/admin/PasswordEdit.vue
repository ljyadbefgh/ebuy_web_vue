<template>
  <div>
    <el-form :model="form" :rules="rules"  ref="form" label-width="80px">
      <el-form-item label="原密码" prop="password" align="left" >
        <el-input  show-password v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input  show-password v-model="form.newPass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePass">
        <el-input  show-password v-model="form.rePass"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('form')">修改密码</el-button>
    </el-form>

  </div>
</template>

<script>
    export default {
        name: "PasswordEdit",
        data() {
            let validatePassword = (rule, value, callback) => {//验证密码的规则
                if (value.indexOf(" ")!=-1) {//如果包含空格
                    callback(new Error('密码不能包含空格'));
                }else{
                    callback();//如果没有出错，则也必须返回 callback()。否则如果有后续异常判断，将无法继续执行
                }
            };
            let validateRePass = (rule, value, callback) => {//验证确认密码的规则
                if (value !== this.form.newPass) {//如果确认密码不等于新密码
                    callback(new Error('新密码和确认密码不一致'));
                }else{
                    callback();//如果没有出错，则也必须返回 callback()。否则如果有后续异常判断，将无法继续执行
                }
            };
            return {
                form:{},
                rules: {
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { validator: validatePassword, trigger: 'blur' },
                        { min: 6, max: 12, message: '密码必须6到12位', trigger: 'blur' }
                    ],
                    newPass: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { validator: validatePassword, trigger: 'blur' },
                        { min: 6, max: 12, message: '新密码必须6到12位', trigger: 'blur' }
                    ],
                    rePass: [
                        { required: true, message: '请输入确认密码', trigger: 'blur' },
                        { validator: validateRePass, trigger: 'blur' },
                    ]
                }
            }

        },
        methods: {
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$axios//将更新后的值传到服务端保存
                            .patch("/api/backstage/admin/password",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
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
