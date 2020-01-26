<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body .el-table th.gutter{ /*解决2.13.0版本的element-ui的table表格控件表头与内容列不对齐问题，未来修复后可以取消该设置*/
  display: table-cell!important;
}
</style>
