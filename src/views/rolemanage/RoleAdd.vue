<template>
  <el-dialog title="角色创建" :visible.sync="dialogFormVisible" width="500px" @opened="opened" >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="英文名" prop="name" placeholder="必须以ROLE_开头">
        <el-input v-model="form.name" maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="中文名" prop="nameZH">
        <el-input v-model="form.nameZH" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="级别" prop="level"  placeholder="请输入级别，默认为100，数值越低级别越高">
        <el-input v-model.number="form.level"></el-input>
      </el-form-item>
      <el-form-item label="默认角色"  prop="defaultRole" align="left">
        <el-switch v-model="form.defaultRole"></el-switch>
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
      <el-button type="primary" @click="submitForm('form')">创建角色</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "RoleAdd",
        data() {
            return {
                dialogFormVisible: false,
                form: {
                    name: '',
                    nameZH: '',
                    name: '',
                    level:100,
                    enabled:true,
                    defaultRole:false,
                    description:''
                },
                rules: {
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 30, message: '长度在 3 到 30个字符', trigger: 'blur' }
                    ],
                    nameZH: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2到 20个字符', trigger: 'blur' },
                    ],
                    level: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值', trigger: 'blur'}
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

            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$axios//将更新后的值传到服务端保存
                            .post("/api/backstage/rolemanage",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.$refs[formName].resetFields();//重置表单
                                    this.$emit("roleTableRefresh");//刷新父组件的表格
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
