<template>
  <el-dialog title="高级查询" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px" @opened="opened" @closed="closed">
    <el-form :model="productOrderQuery" ref="form" label-width="80px">
      <el-form-item label="订单编号" align="left">
        <el-input v-model="productOrderQuery.orderNo" placeholder="订单编号"></el-input>
      </el-form-item>
      <el-form-item label="付款方式" align="left">
        <el-select v-model="productOrderQuery.paymentType" clearable  placeholder="请选择">
          <el-option value="1" label="网上支付"></el-option>
          <el-option value="2" label="货到付款"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款状态" align="left">
        <el-select v-model="productOrderQuery.paymentStatus" clearable  placeholder="请选择">
          <el-option value="0" label="未付款"></el-option>
          <el-option value="1" label="已付款"></el-option>
          <el-option value="2" label="已退款"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" align="left">
        <el-select v-model="productOrderQuery.tag" clearable  placeholder="请选择">
          <el-option
            v-for="(value, key) in myVariable.orderTagMap"
            :key="key"
            :label="value"
            :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户" align="left">
        <el-input placeholder="请输入客户名字"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关闭</el-button>
      <el-button type="primary" @click="$emit('tableRefresh')">查询</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "ProductOrderSearchDialog",
        props:{
            productOrderQuery: {//获取从父组件传递过来的查询条件对象。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data() {
            return {
                dialogFormVisible: false
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
            closed(){
                this.$refs["form"].resetFields();//重置表单
            }
        }
    }
</script>

<style scoped>

</style>
