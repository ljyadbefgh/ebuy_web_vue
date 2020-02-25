<template>
  <div>
    <el-form :model="form" :rules="rules"  ref="form" label-width="150px">
      <el-form-item label="客户邀请码" prop="inviteCodeOfCustomer" align="left" >
        <el-input v-model="form.inviteCodeOfCustomer"></el-input>
      </el-form-item>
      <el-form-item label="禁止客户注册"  prop="closeRegOfCustomer" align="left">
        <el-switch v-model="form.closeRegOfCustomer"></el-switch>
      </el-form-item>
      <el-form-item label="禁止客户登陆"  prop="closeLoginOfCustomer" align="left">
      <el-switch v-model="form.closeLoginOfCustomer"></el-switch>
      </el-form-item>
      <div style="text-align: center;">
        <el-button type="primary" round style="width: 90%;"  @click="submitForm('form')">修改</el-button>
      </div>

    </el-form>

  </div>
</template>

<script>
    export default {
        name: "ConfigEdit",
        data() {
            return {
                form:{},
                rules: {
                    /*username: [
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
                    ]*/
                }
            }

        },
        methods: {
            getWebConfig() {//读取当前登陆的用户信息
                let _this=this;
                this.$axios
                    .get("/api/backstage/webconfig")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.form = msg.data;
                            //本处Ljy被坑了：然后将服务端传递过来的性别的值改为字符串类型，只有这样才能正确初始化下拉框—。至于原因是初始化时只能识别字符串
                            //this.form.sex=String(this.form.sex);
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$axios//将更新后的值传到服务端保存
                            .put("/api/backstage/webconfig",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: '修改成功'
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
        },
        mounted() {
            this.getWebConfig();
        }
    }
</script>

<style scoped>

</style>
