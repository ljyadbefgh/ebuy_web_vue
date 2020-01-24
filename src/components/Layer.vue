<template>
  <div>
    <!--如果没有 <router-view></router-view>，则该组件的children的路由组件都将无法展示-->
    <router-view></router-view>
  </div>
</template>

<script>
     //提供给有children的路由组件（并且没有要展示视图的容器展示）。特别说明：如果没有，则该路由组件的子路由将无法展示
    export default {
        name: "Layer"
    }
</script>

<style scoped>

</style>
