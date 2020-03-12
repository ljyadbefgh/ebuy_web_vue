<template>
  <div>
    <div class="item" align="left" style="margin-bottom: 5px;">
      <el-button @click="$refs.menuAddForm.openDialog()" type="primary">添加</el-button>
    </div>
    <!--      default-expand-all-->
    <el-table
      :data="menuArray"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      height="550"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
     <!-- <el-table-column type="selection" width="40" align="center">
      </el-table-column>-->
      <el-table-column
        width="200"
        prop="name"
        label="菜单名"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="url"
        label="资源地址">
      </el-table-column>
      <el-table-column
        width="75"
        align="center"
        prop="enabled"
        label="是否可用">
        <template slot-scope="scope">
          <el-tag size="medium" v-if="scope.row.enabled==true" type="success">可用</el-tag>
          <el-tag size="medium" v-if="scope.row.enabled==false" type="info">废弃</el-tag>
        </template>
      </el-table-column>
        <el-table-column
          width="60"
          align="center"
          prop="orderNum"
          label="优先级">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="component"
        label="组件名称">
      </el-table-column>
      <el-table-column
        width="50"
        align="center"
        prop="iconCls"
        label="图片">
        <template slot-scope="scope">
          <i v-if="scope.row.iconCls" :class="scope.row.iconCls"></i>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="path"
        label="组件地址">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="route"
        label="路由地址">
      </el-table-column>
      <el-table-column
        width="70"
        align="center"
        prop="requireAuth"
        label="要求登陆">
        <template slot-scope="scope">
          <el-tag size="medium" v-if="scope.row.requireAuth==true" type="success">是</el-tag>
          <el-tag size="medium" v-if="scope.row.requireAuth==false" type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="60"
        align="center"
        prop="requireAuth"
        label="显示">
        <template slot-scope="scope">
          <el-tag size="medium" v-if="scope.row.display==true" type="success">是</el-tag>
          <el-tag size="medium" v-if="scope.row.display==false" type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="290">
        <template slot-scope="scope">
          <el-button type="primary" @click="addMenu(scope.row)">添加子菜单</el-button>
          <el-button type="primary" @click="editMenu(scope.row)">编辑</el-button>
          <el-button type="primary" @click="deleteMenu(scope.row)">删除</el-button>
          <!--<el-button @click="manageRoles(scope.row)" type="primary" plain size="mini">添加子菜单</el-button>
          <el-button  @click="editAdmin(scope.row.id)" type="primary" plain size="mini">编辑</el-button>
          <el-button  @click="editAdmin(scope.row.id)"  type="danger" plain size="mini">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <MenuAdd
      ref="menuAddForm"
      :menuArray="this.menuArray"
      @menuTableRefresh="getTreeMenu"
    />
    <menuEdit
      ref="menuEditForm"
      :menuArray="this.menuArray"
      @menuTableRefresh="getTreeMenu"
    />
  </div>
</template>

<script>

   /* import {getRootPathAtTreeByKey} from "@/api/my/menu";*/

    export default {
        name: "MenuManage",
        components: {
            MenuAdd: () => import("@/views/menumanage/menuAdd.vue"),//引入菜单添加表单
            menuEdit: () => import("@/views/menumanage/menuEdit.vue")//引入菜单编辑表单
        },
        data() {
            return {
                menuArray: [],//表格数据
                multipleSelection:[]//选择的表格数据
            }
        },
        methods:{
            getTreeMenu(){
                this.$axios
                    .get("/api/backstage/menumanage")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.myMethod.tree.setTreeNodeChildrenForUndefined(msg.data);
                            this.menuArray = msg.data;
                        }
                    });
            },
            handleSelectionChange(value){//当选择项发生变化时会触发该事件，这里用于获取选择的记录（多选）.value可以获取所有选择了的行记录row
                this.multipleSelection=value;
            },
            addMenu(row){
                this.$refs.menuAddForm.openDialog(row.id);
            },
            editMenu(row){
                this.$refs.menuEditForm.openDialog(row.id);
            },
            deleteMenu(row){
                this.$confirm("确定要批量删除菜单("+row.name+")吗？执行删除将删除该菜单及其所有子菜单和相关联的其他信息", "系统提示", {
                    confirmButtonText: "确定",//确定按钮的文本内容
                    cancelButtonText: "取消",//取消按钮的文本内容
                    type: "warning"
                }).then(() => {//选择确认按钮后执行
                    this.$prompt('删除后将无法还原，如果确认删除，请输入“DELETE”', '警告', {//再次弹出提示，要求输入口令
                        inputPattern: /^DELETE{1}$/,// 正则表达式，必须要输入delete才能删除
                        inputErrorMessage: '口令不正确',
                        confirmButtonText: '确定删除',
                        cancelButtonText: '取消'
                    }).then(({ value }) => {//点击了确定，value为输入的文本的值
                        this.$axios
                            .delete("/api/backstage/menumanage/"+row.id)
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {
                                    this.getTreeMenu();// 刷新表格数据
                                }
                            });
                    }).catch(() => { });
                }).catch(error => {//选择取消按钮后执行
                    //console.error(error);
                });
            }

        },
        mounted() {
            this.getTreeMenu();
        }
    }
</script>

<style scoped>

</style>
