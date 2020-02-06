<template>
  <!--搜索栏-->
  <el-form :model="productQuery"  :inline="true" style="text-align: left;" class="demo-form-inline">
    <el-form-item >
      <el-input v-model="productQuery.name" placeholder="产品名称"></el-input>
    </el-form-item>
    <el-form-item  style="text-align: left;">
      <el-select-producttype v-model="productQuery.productTypeId"></el-select-producttype>
    </el-form-item>
    <el-form-item style="text-align: left;">
      <el-select-orderNum v-model="productQuery.orderNum" :orderNumOptions="orderNumOptions"></el-select-orderNum>
    </el-form-item>
    <el-form-item style="text-align: left;">
      <el-select v-model="productQuery.onSale" clearable  placeholder="请选择上架状态">
        <el-option value="true" label="上架"></el-option>
        <el-option value="false" label="下架"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="text-align: left;">
      <el-select-orderType v-model="productQuery.orderType"></el-select-orderType>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="$emit('tableRefresh')">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="$emit('clearQuery');$emit('tableRefresh');">清空查询条件</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    export default {
        name: "ProductSearch",
        props:{
            productQuery: {//获取从父组件传递过来的查询条件对象。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Object,
                default () {
                    return {};
                }
            },
            orderNumOptions: {//获取从父组件传递过来的优先级map对象集合。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
               /* type: Array,因为这个传递的是map集合，所以去掉这个检查，否则会被vue警告*/
                default () {
                    return [];
                }
            }
        },
        components: {
            'el-select-producttype': () => import("@/views/product/el-select-producttype.vue"), //引入产品分类下拉框组件
            'el-select-orderNum': () => import("@/views/product/el-select-orderNum.vue"), //引入优先级下拉框组件
            'el-select-orderType': () => import("@/views/product/el-select-orderType.vue") //引入排序规则下拉框组件
        }
    }
</script>

<style scoped>

</style>
