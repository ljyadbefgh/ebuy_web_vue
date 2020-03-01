<template>
  <el-dialog title="客户创建" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px" @opened="opened" >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="账户名" prop="username">
        <el-input v-model="form.username" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="性别" style="text-align: left;" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio-button label="1">男</el-radio-button>
          <el-radio-button label="2">女</el-radio-button>
        </el-radio-group>
<!--        <el-select v-model="form.sex" placeholder="请选择">
          <el-option value="1" label="男"></el-option>
          <el-option value="2" label="女"></el-option>
        </el-select>-->
      </el-form-item>
      <el-form-item label="手机号码" prop="tel">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="邮编" prop="zip">
        <el-input v-model="form.zip"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="个人简介" prop="intro" >
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="form.intro">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "CustomerAdd",
        data() {
            return {
                dialogFormVisible: false,
                form: {
                    username:'',
                    name: '',
                    sex: '',
                    tel:'',
                    address:'',
                    zip:'',
                    email:'',
                    intro:''
                },
                rules: {
                    username: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 30, message: '长度在 3 到 30个字符', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        {  max: 10, message: '不能超过10个字符', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    tel:[
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码'},
                    ],
                    address: [
                        { required: true, message: '请输入地址（用于送货）', trigger: 'blur' },
                        {  max: 50, message: '不能超过50个字符', trigger: 'blur' }
                    ],
                    zip: [
                        { required: true, message: '请输入邮编（用于送货）', trigger: 'blur' },
                        { pattern: /^[0-9]{6}$/, message: '请输入正确的邮编格式' }
                    ],
                    email: [
                        { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: '请输入正确的电子邮箱'}
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
                            .post("/api/backstage/customermanage",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.$refs[formName].resetFields();//重置表单
                                    this.$emit("customerTableRefresh");//刷新父组件的表格
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
