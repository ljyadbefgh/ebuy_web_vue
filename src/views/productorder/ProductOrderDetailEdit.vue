<template>
  <el-dialog title="订单变更" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :append-to-body='true' width="500px" @opened="opened" >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="商品名">
        <el-input v-if="productOrderDetail" v-model="productOrderDetail.product.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="产品现价" prop="price">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="productNumber"  placeholder="请输入级别，默认为100，数值越低级别越高">
        <el-input v-model.number="form.productNumber"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "ProductOrderDetailEdit",
        props:{
            productOrderDetail: {//获取从父组件传递过来的子订单记录
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data() {
            return {
                dialogFormVisible: false,
                form: {
                    price:'',
                    productNumber:0
                },
                rules: {
                    price: [
                        { validator: this.myMethod.elementRules.validateFloat, required: true},//自定义正浮点数的验证
                    ],
                    productNumber: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值', trigger: 'blur'}
                    ]
                }
            }

        },
        methods: {
            openDialog() {//打开对话框
                this.dialogFormVisible = true;
                //初始化要修改的信息，注意不能直接等于对象，否则会直接修改对象的值
                if(this.productOrderDetail!=null){
                    this.form.id=this.productOrderDetail.id;
                    this.form.productNumber=this.productOrderDetail.productNumber;
                    this.form.price=this.productOrderDetail.price;
                }
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
                            .put("/api/backstage/productorder/detail",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: "子订单已经成功修改"
                                    });
                                    //对表格的数据进行变更
                                    this.productOrderDetail.productNumber= this.form.productNumber;
                                    this.productOrderDetail.price=this.form.price;
                                    this.productOrderDetail.priceTotal=this.form.price*this.form.productNumber;//这里可能会出现浮点数计算不准确，未来可以考虑直接在服务端获取计算结果
                                    this.$refs[formName].resetFields();//重置表单
                                    this.$emit("freshProductOrderTotalPrice");//调用父组件的方法，实现本订单（非子订单）总价的变化
                                    this.closeDialog();//关闭对话框
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
