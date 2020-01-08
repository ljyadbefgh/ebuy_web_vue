<template>
  <div>
    <!--      default-expand-all-->
    <el-table
      :data="menuArray"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border

      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
     <!-- <el-table-column type="selection" width="40" align="center">
      </el-table-column>-->
      <el-table-column
        prop="name"
        label="菜单名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="菜单地址">
      </el-table-column>
      <el-table-column
        prop="enabled"
        label="是否可用">
      </el-table-column>
        <el-table-column
          prop="orderNum"
          label="优先级">
      </el-table-column>
      <el-table-column
        prop="component"
        label="组件名称">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-link type="primary">添加子菜单</el-link>
          <el-link type="primary">编辑</el-link>
          <el-link type="primary">删除</el-link>
          <!--<el-button @click="manageRoles(scope.row)" type="primary" plain size="mini">添加子菜单</el-button>
          <el-button  @click="editAdmin(scope.row.id)" type="primary" plain size="mini">编辑</el-button>
          <el-button  @click="editAdmin(scope.row.id)"  type="danger" plain size="mini">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
        name: "MenuManage",
        data() {
            return {
                menuArray: [],//表格数据
                multipleSelection:[]//选择的数据
            }
        },
        methods:{
            getTreeMenu(){
                this.$axios
                    .get("/api/backstage/menumanage")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.menuArray = msg.data;
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleSelectionChange(value){//当选择项发生变化时会触发该事件，这里用于获取选择的记录（多选）.value可以获取所有选择了的行记录row
                this.multipleSelection=value;
                console.log(this.multipleSelection);
            },
        },
        mounted() {
            this.getTreeMenu();
        }
    }
</script>

<style scoped>

</style>
