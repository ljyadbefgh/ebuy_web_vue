<template>
  <div>
    <!--搜索栏-->
    <el-form :model="productOrderDetailQuery"  :inline="true" style="text-align: left;" class="demo-form-inline">
      <el-form-item  label="订单编号" align="left">
        <el-input v-model="productOrderDetailQuery.orderNo" placeholder="订单编号"></el-input>
      </el-form-item>
      <el-form-item label="产品" align="left">
        <el-select-product v-model="productOrderDetailQuery.productId"></el-select-product>
      </el-form-item>
      <el-form-item label="付款状态" align="left">
        <el-select v-model="productOrderDetailQuery.paymentStatus" clearable  placeholder="请选择">
          <el-option value="0" label="未付款"></el-option>
          <el-option value="1" label="已付款"></el-option>
          <el-option value="2" label="已退款"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" align="left">
        <el-date-picker-between
          :begin="productOrderDetailQuery.createTimeQueryOfBegin"
          :end="productOrderDetailQuery.createTimeQueryOfEnd"
          @begin-change="createTimeQueryBeginChange"
          @end-change="createTimeQueryEndChange"
        />
      </el-form-item>
      <el-form-item label="订单状态" align="left">
        <el-select v-model="productOrderDetailQuery.tag" clearable  placeholder="请选择">
          <el-option
            v-for="(value, key) in myVariable.orderTagMap"
            :key="key"
            :label="value"
            :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('tableRefresh')">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearQuery">清空查询条件</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        name: "ProductOrderDetailSearch",
        components: {
            'el-select-product': () => import("@/components/el-select-product.vue"), //引入产品下拉框组件
            'el-date-picker-between': () => import("@/components/el-date-picker-between.vue") //引入自定义日期插件（含两个日期）
        },
        props:{
            productOrderDetailQuery: {//获取从父组件传递过来的查询条件对象。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data() {
            return {
                dialogFormVisible: false,
            }
        },
        methods: {
            clearQuery(){// 清空查询条件
                this.$emit("initQuery");//调用父类方法清空查询条件
                this.$emit('tableRefresh');//刷新表格
            },
            createTimeQueryBeginChange(value){//value是自定义组件的开始日期当前的值
                //this.productOrderQuery.createTimeQueryOfBegin=value;
                this.$set(this.productOrderDetailQuery,'createTimeQueryOfBegin',value);

            },
            createTimeQueryEndChange(value){//value是自定义组件的截止日期当前的值
                //this.productOrderQuery.createTimeQueryOfEnd=value;
                this.$set(this.productOrderDetailQuery,'createTimeQueryOfEnd',value);
            },
        }
    }
</script>

<style scoped>

</style>
