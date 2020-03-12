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

<style lang="scss">
#app {
  min-width: 1000px;
 /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;*/
}
body .el-table th.gutter{ /*解决2.13.0版本的element-ui的table表格控件表头与内容列不对齐问题，未来修复后可以取消该设置*/
  display: table-cell!important;
}
/*elementui 全局loading css,放在这里覆盖*/
.create-isLoading {
  .el-loading-spinner {
    top: 50%;
    left: 50%;
    margin-left: -55px;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 4px;
    width: auto;
    text-align: center;
    position: absolute;
    i { /*这个是图标颜色，对应spinner: 'el-icon-loading',*/
      color: #eee;
    }
    .el-loading-text { /*这个是文本颜色，对应text: "与服务器数据交互中..."*/
      color: #eee;
    }
  }
}
</style>
