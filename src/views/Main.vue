<template>
  <!--style="background-color: #f0f2f5;"-->
  <div class="index">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <AdminCount/>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <CustomerCount/>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <ProductCount/>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <ProductOrderCount/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="14">
        <ProductMaxSalesVolumeChart/>
      </el-col>
      <el-col :span="10">
        <ProductTypeSaleVolumeChart/>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="14">
        <ProductMaxSaleChart/>
      </el-col>
      <el-col :span="10">
        <ProductTypeSaleChart/>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <ProductTypeSalesVolumeOfRecentlyEveryDayChart/>
      </el-col>
    </el-row>



  </div>
</template>

<script>
    export default {
        name: 'Main',
        components: {
            AdminCount: () => import("@/views/main/AdminCount.vue"), //引入管理账户的统计组件
            CustomerCount: () => import("@/views/main/CustomerCount.vue"), //引入客户账户的统计组件
            ProductCount: () => import("@/views/main/ProductCount.vue"), //引入产品的统计组件
            ProductOrderCount: () => import("@/views/main/ProductOrderCount.vue"), //引入产品订单的统计组件
            ProductMaxSalesVolumeChart: () => import("@/views/main/ProductMaxSalesVolumeChart.vue"), //引入产品最大销量图表
            ProductMaxSaleChart: () => import("@/views/main/ProductMaxSaleChart.vue"), //引入产品最大销售额图表
            ProductTypeSaleChart: () => import("@/views/main/ProductTypeSaleChart.vue"), //引入产品最大销售额图表
            ProductTypeSalesVolumeOfRecentlyEveryDayChart: () => import("@/views/main/ProductTypeSalesVolumeOfRecentlyEveryDayChart.vue"), //引入产品订单图表
            ProductTypeSaleVolumeChart: () => import("@/views/main/ProductTypeSaleVolumeChart.vue") //引入各类型产品销售图表
        },
        data() {
            return {
                admin:{}
            }
        },
        methods:{

        },
        mounted() {

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
