<template>
  <el-dialog title="订单变更" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :append-to-body='true' width="500px" @opened="opened" >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="订单编号">
        <el-input  v-model="form.orderNo" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="收货人">
        <el-input  v-model="form.sendName"></el-input>
      </el-form-item>
      <el-form-item label="收货地址">
        <el-input  v-model="form.sendAddress"></el-input>
      </el-form-item>
      <el-form-item label="邮编">
        <el-input  v-model="form.sendZip"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input  v-model="form.sendTel"></el-input>
      </el-form-item>
      <el-form-item label="总价">
        <el-input  v-model="form.totalPrice" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="成交价格" prop="strikePrice">
        <el-input v-model="form.strikePrice"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="submitForm('form')">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "ProductOrderEdit",
        props:{
            productOrder: {//获取从父组件传递过来的子订单记录
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
                    orderNo:'',
                    sendName:'',
                    sendAddress:'',
                    sendZip:'',
                    sendTel:'',
                    totalPrice:'',
                    strikePrice:''
                },
                rules: {
                    strikePrice: [
                        { validator: this.myMethod.elementRules.validateFloat},//自定义正浮点数的验证
                    ]
                }
            }

        },
        methods: {
            openDialog() {//打开对话框
                this.dialogFormVisible = true;
                //初始化要修改的信息，注意不能直接等于对象，否则会直接修改对象的值
                if(this.productOrder!=null){
                    this.form=Object.assign(this.form,  this.productOrder);//简化，直接拷贝值，注意，不能直接this.form=this.productOrder，造成引用地址的变化
                   /* this.form.orderNo=this.productOrder.orderNo;
                    this.form.sendName=this.productOrder.sendName;
                    this.form.sendAddress=this.productOrder.sendAddress;
                    this.form.sendZip=this.productOrder.sendZip;
                    this.form.sendTel=this.productOrder.sendTel;
                    this.form.totalPrice=this.productOrder.totalPrice;
                    this.form.strikePrice=this.productOrder.strikePrice;*/
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
                            .put("/api/backstage/productorder",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: "订单已经成功修改"
                                    });
                                    //对表格的数据进行不刷新变更
                                    this.productOrder=Object.assign(this.productOrder,  this.form);//简化，直接拷贝值，注意，不能直接this.productOrder=this.form，
                                    //this.productOrder.strikePrice=this.form.strikePrice;//设置当前订单成交价
                                    this.$refs[formName].resetFields();//重置表单
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
