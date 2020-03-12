<template>
  <el-dialog
    title="菜单预览"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="loading==false"
    :show-close="loading==false"
    width="500px"
    @opened="opened"
    @closed="closed">
    <el-tree
      ref="menuTree"
      v-loading="loading"
      element-loading-text="与服务器交互中，请稍后……"
      :data="menus"
      :props="optionProps"
      node-key="id"
      check-strictly
      default-expand-all
      highlight-current></el-tree>

   <!-- <el-form :model="form" :rules="rules" ref="form" label-width="80px">

    </el-form>-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false" :loading="loading">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "AdminMenuManage",
        data(){
            return{
                loading:false,//对应Loadding组件
                dialogFormVisible: false,
                adminId:'',// 当前操作的账户Id
                menus:[],//所有树形菜单集合
                optionProps: {//用于格式化里的菜单属性
                    value: 'id',
                    label: 'name',
                    /*                    disabled:'enabled',*/
                    children: 'children'
                    //checkStrictly:true //true之后可以选择任意一级选项
                },
            }
        },
        methods: {
            openDialog(id) {//打开对话框
                this.loading=true;
                this.adminId=id;
                this.dialogFormVisible = true;
                this.$axios
                    .get("api/backstage/adminmanage/"+id+"/treeMenu")
                    .then(response => {//获取返回数据
                        this.loading=false;
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.menus = msg.data;
                        }
                    })
                    .catch(error => {
                        this.loading=false;
                    });
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            opened(){

            },
            closed(){
                this.adminId=null;
            }
        }
    }
</script>

<style scoped>

</style>
