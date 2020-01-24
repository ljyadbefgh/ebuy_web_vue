<template>
  <div style="background-color: #f8f8f8;box-sizing: border-box;">
    <el-breadcrumb separator-class="el-icon-arrow-right"   style="line-height: 50px;padding-left: 20px;">
      <el-breadcrumb-item v-for="(item, index) in routeMatched" :key="index" :to="{path: item.path}">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
    //自定义面包屑组件，用于获取路由
    export default {
        name: "MyBreadcrumb",
        computed: {
            routeMatched() {
                return this.$store.getters.routeMatched;
            }
        }
    }
</script>

<style scoped>

</style>
