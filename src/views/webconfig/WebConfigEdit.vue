<template>
  <div>
    <el-form :model="form" :rules="rules"  ref="form" label-width="300px">
      <el-divider content-position="center">管理员模块设置</el-divider>
      <el-form-item label="允许管理员一天内连续输入错误密码次数"  prop="maxLoginErrorNumberOfAdmin" align="left">
        <el-input v-model.number="form.maxLoginErrorNumberOfAdmin" placeholder="0表示不限制登陆次数"></el-input>
      </el-form-item>

      <el-divider content-position="center">客户模块设置</el-divider>
      <el-form-item label="客户邀请码" prop="inviteCodeOfCustomer" align="left" >
        <el-input v-model="form.inviteCodeOfCustomer" placeholder="如果为空表示不需要邀请码"></el-input>
      </el-form-item>
      <el-form-item label="禁止客户注册"  prop="closeRegOfCustomer" align="left">
        <el-switch v-model="form.closeRegOfCustomer"></el-switch>
      </el-form-item>
      <el-form-item label="禁止客户登陆"  prop="closeLoginOfCustomer" align="left">
      <el-switch v-model="form.closeLoginOfCustomer"></el-switch>
      </el-form-item>
      <el-form-item label="允许客户一天内连续输入错误密码次数"  prop="maxLoginErrorNumberOfCustomer" align="left">
        <el-input v-model.number="form.maxLoginErrorNumberOfCustomer" placeholder="0表示不限制登陆次数"></el-input>
      </el-form-item>

      <el-divider content-position="center">购物模块设置</el-divider>
      <el-form-item label="单个商品最大购买数量" prop="maxSingleProductNumberByBuy" align="left" >
        <el-input v-model.number="form.maxSingleProductNumberByBuy" placeholder="0表示不限制"></el-input>
      </el-form-item>
      <el-form-item label="购物车中商品种类的最大数量" prop="maxProductNumberInCart" align="left" >
        <el-input v-model.number="form.maxProductNumberInCart" placeholder="0表示不限制"></el-input>
      </el-form-item>
      <el-form-item label="客户每天允许下单的最大次数" prop="maxProductOrderNumberInToday" align="left" >
        <el-input v-model.number="form.maxProductOrderNumberInToday" placeholder="0表示不限制"></el-input>
      </el-form-item>

      <el-divider content-position="center">机器人设置</el-divider>
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
                    maxLoginErrorNumberOfAdmin: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    maxLoginErrorNumberOfCustomer: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    maxSingleProductNumberByBuy: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    maxProductNumberInCart: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    maxProductOrderNumberInToday: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ]
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
                                }
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
