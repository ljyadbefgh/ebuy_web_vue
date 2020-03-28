<template>
  <el-dialog title="高级查询" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px" @opened="opened" @closed="closed">
    <el-form :model="productOrderQuery" ref="form" label-width="90px">
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
        <el-select-customer v-model="productOrderQuery.customerId"></el-select-customer>
      </el-form-item>
      <el-form-item label="收货人姓名" align="left">
        <el-input v-model="productOrderQuery.sendName" placeholder="请输入收货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="下单时间" align="left">
        <el-date-picker-between
        :begin="productOrderQuery.createTimeQueryOfBegin"
        :end="productOrderQuery.createTimeQueryOfEnd"
        @begin-change="createTimeQueryBeginChange"
        @end-change="createTimeQueryEndChange"
        />
      </el-form-item>
      <el-form-item label="交易时间" align="left">
        <el-date-picker-between
          :begin="productOrderQuery.dealTimeQueryOfBegin"
          :end="productOrderQuery.dealTimeQueryOfEnd"
          @begin-change="dealTimeQueryOfBeginChange"
          @end-change="dealTimeQueryOfEndChange"
        />
      </el-form-item>
      <el-form-item label="发货时间" align="left">
        <el-date-picker-between
          :begin="productOrderQuery.sendTimeQueryOfBegin"
          :end="productOrderQuery.sendTimeQueryOfEnd"
          @begin-change="sendTimeQueryOfBeginChange"
          @end-change="sendTimeQueryOfEndChange"
        />
      </el-form-item>
      <el-form-item label="收货时间" align="left">
        <el-date-picker-between
          :begin="productOrderQuery.receiveTimeQueryOfBegin"
          :end="productOrderQuery.receiveTimeQueryOfEnd"
          @begin-change="receiveTimeQueryOfBeginChange"
          @end-change="receiveTimeQueryOfEndChange"
        />
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
        name: "ProductOrderSearch",
        components: {
            'el-select-customer': () => import("@/components/el-select-customer.vue"), //引入客户下拉框组件
            'el-date-picker-between': () => import("@/components/el-date-picker-between.vue") //引入自定义日期插件（含两个日期）
        },
        props:{
            productOrderQuery: {//获取从父组件传递过来的查询条件对象。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Object,
                default () {
                    return {};
                }
            }
        },
        computed:{

        },
        data() {
            return {
                dialogFormVisible: false,
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
            },
            createTimeQueryBeginChange(value){//value是自定义组件的开始日期当前的值
                //this.productOrderQuery.createTimeQueryOfBegin=value;
                this.$set(this.productOrderQuery,'createTimeQueryOfBegin',value);

            },
            createTimeQueryEndChange(value){//value是自定义组件的截止日期当前的值
                //this.productOrderQuery.createTimeQueryOfEnd=value;
                this.$set(this.productOrderQuery,'createTimeQueryOfEnd',value);
            },
            dealTimeQueryOfBeginChange(value){//value是自定义组件的开始日期当前的值
                this.$set(this.productOrderQuery,'dealTimeQueryOfBegin',value);

            },
            dealTimeQueryOfEndChange(value){//value是自定义组件的截止日期当前的值
                this.$set(this.productOrderQuery,'dealTimeQueryOfEnd',value);
            },
            sendTimeQueryOfBeginChange(value){//value是自定义组件的开始日期当前的值
                this.$set(this.productOrderQuery,'sendTimeQueryOfBegin',value);

            },
            sendTimeQueryOfEndChange(value){//value是自定义组件的截止日期当前的值
                this.$set(this.productOrderQuery,'sendTimeQueryOfEnd',value);
            },
            receiveTimeQueryOfBeginChange(value){//value是自定义组件的开始日期当前的值
                this.$set(this.productOrderQuery,'receiveTimeQueryOfBegin',value);

            },
            receiveTimeQueryOfEndChange(value){//value是自定义组件的截止日期当前的值
                this.$set(this.productOrderQuery,'receiveTimeQueryOfEnd',value);
            }
        }
    }
</script>

<style scoped>

</style>
