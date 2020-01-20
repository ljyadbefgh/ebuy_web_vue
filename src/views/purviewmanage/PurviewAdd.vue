<template>
  <el-dialog title="权限创建" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px" @opened="opened" >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="form.name" maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input v-model="form.url" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="优先级" prop="orderNum">
        <el-input v-model.number="form.orderNum"></el-input>
      </el-form-item>
      <el-form-item label="是否启用"  prop="enabled" align="left">
        <el-switch v-model="form.enabled"></el-switch>
      </el-form-item>
      <el-form-item label="描述" prop="description" >
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="form.description">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">创建权限</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "PurviewAdd",
        data() {
            return {
                dialogFormVisible: false,
                form: {
                    name: '',
                    url: '',
                    enabled:true,
                    description:''
                },
                rules: {
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 30, message: '长度在 2 到 30个字符', trigger: 'blur' }
                    ],
                    url: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 200, message: '长度在 2到 200个字符', trigger: 'blur' },
                    ],
                    orderNum: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值', trigger: 'blur'}
                    ],
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

            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$axios//将更新后的值传到服务端保存
                            .post("/api/backstage/purviewmanage",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.$refs[formName].resetFields();//重置表单
                                    this.$emit("purviewTableRefresh");//刷新父组件的表格
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
