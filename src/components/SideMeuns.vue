<template>
  <div class="">
      <!-- 遍历路由表，生成左侧菜单 -->
      <template v-for="(item,index) in menus" v-if="item.display">
        <!-- 一级菜单的情况（或是在递归下，指没有子菜单的情况-即最后一级菜单） -->
        <template v-if="item.children!=null&&item.children.length==0">
        <el-menu-item :index="item.route">
          <template slot="title">
            <!-- 设置icon -->
            <i v-if="item.iconCls" :class="item.iconCls"></i>
            <!-- 菜单名称 -->
            {{item.name}}
          </template>
        </el-menu-item>
        </template>
        <!-- 一级菜单的情况 end-->
        <!-- 多级菜单的情况 -->
        <template v-else>
          <el-submenu :index="'index'+item.id.toString()" :route="item.route">
            <template slot="title">
              <!-- 设置icon -->
              <i v-if="item.iconCls" :class="item.iconCls"></i>
              <!-- 菜单名称 -->
              {{item.name}}
            </template>
            <side-Meuns :menus="item.children"></side-Meuns>
          </el-submenu>
        </template>
        <!-- 多级菜单 end-->
      </template>



  </div>
</template>

<script>
  //本组件用于递归树形菜单，例如左侧菜单
    export default {
        name: "SideMeuns",
        props: {
            menus: {
                type: Array,
                default: () => []
            }
        }
    }
</script>

<style scoped>

</style>
