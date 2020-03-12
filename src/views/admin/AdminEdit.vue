<template>
  <div>

    <el-form :model="form" :rules="rules"  ref="form" label-width="80px">
      <el-form-item label="账户名" prop="username" align="left" >
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="网名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" style="text-align: left;" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option key="1" value="1" label="男"></el-option>
          <el-option key="2" value="2" label="女"></el-option>
        </el-select>
      </el-form-item>
      <div style="text-align: center;">
        <el-button type="primary" @click="submitForm('form')" :loading="loading">修改</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
    export default {
        name: "AdminEdit",
        data() {
            return {
                loading:false,
                form:{},
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
                    ]
                }
            }

        },
        methods: {
            getMyAdmin() {//读取当前登陆的用户信息
                this.$axios
                    .get("/api/backstage/admin")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.form = msg.data;
                            //本处Ljy被坑了：然后将服务端传递过来的性别的值改为字符串类型，只有这样才能正确初始化下拉框—。至于原因是初始化时只能识别字符串
                            this.form.sex=String(this.form.sex);
                        }
                    })
            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.loading=true;
                        this.$axios//将更新后的值传到服务端保存
                            .put("/api/backstage/admin",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                }
                                this.loading=false;
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
            this.getMyAdmin();
        }
    }
</script>

<style scoped>

</style>
