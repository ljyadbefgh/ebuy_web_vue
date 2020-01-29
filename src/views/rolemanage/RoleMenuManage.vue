<template>
  <el-dialog title="菜单管理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px" @opened="opened" @closed="closed" align="left">
    <el-checkbox v-model="checkAll" @change="handleCheckAllChange" >全选</el-checkbox>
    <el-tree
      ref="menuTree"
      :data="menus"
      :props="optionProps"
      node-key="id"
      show-checkbox
      :check-strictly="checkStrictly"
      default-expand-all
      highlight-current
      @check-change="handleCheckChange"></el-tree>

   <!-- <el-form :model="form" :rules="rules" ref="form" label-width="80px">

    </el-form>-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确定修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "RoleMenuManage",
        data(){
            return{
                checkAll:false,// 是否全选
                checkStrictly:true,//是否为严格模式，严格模式下，父菜单和子菜单没有关联关系。
                dialogFormVisible: false,
                roleId:'',// 当前操作的角色Id
                menus:[],//所有树形菜单集合
                menuIds:[],// 选择的菜单集合
                menuNodeNumber:0,// 获取树形菜单的所有节点数量（递归）。这里用于保存计算的结果，避免每次都要计算
                optionProps: {//用于格式化里的菜单属性
                    value: 'id',
                    label: 'name',
                    /*                    disabled:'enabled',*/
                    children: 'children',
                    checkStrictly:true //true之后可以选择任意一级选项
                },
            }
        },
        methods: {
            openDialog(id) {//打开对话框
                this.roleId=id;
                this.dialogFormVisible = true;
                this.$axios
                    .get("api/backstage/rolemanage/menu/"+id)
                    .then(response => {//获取返回数据/
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.menus = msg.data.treeMenu;
                            this.menuIds=msg.data.menusId;
                            this.menuNodeNumber=this.myMethod.tree.getNodeNumberFromTreeNode(this.menus);// 获取树节点的总数（递归）
                            if(this.menuNodeNumber==this.menuIds.length){//如果已勾选的菜单和总菜单的数量一致
                                this.checkAll=true;//设置全选复选框为勾选状态
                            }else{//如果不是
                                this.checkAll=false;//设置全选复选框为未勾选状态
                            }
                            this.$refs.menuTree.setCheckedKeys(this.menuIds);//设置默认选择菜单
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            opened(){

            },
            closed(){
                this.roleId=null;
            },
            handleCheckAllChange(val) {//点击全选事件
                let _this=this;
                if (this.checkAll) {//如果全选
                    this.checkStrictly=false;//先取消严格模式，让父菜单和菜单关联
                    setTimeout(function(){//设定顺序（这里没有用远程交互去异步处理，故可以采用该方法。否则建议用promise实现），让父菜单所有一级目录选择，通过关联（this.checkStrictly=false），实现所有菜单自选
                        _this.$refs.menuTree.setCheckedNodes(_this.menus);
                    }, 0);
                    setTimeout(function(){//父菜单执行完后，再实现严格模式
                        _this.checkStrictly=true;
                    }, 0);
                } else {
                    this.$refs.menuTree.setCheckedKeys([]);
                }
            },
            handleCheckChange() {//当树的父节点发生变化时触发，用于处理全选按钮状态
                this.menuIds=this.$refs.menuTree.getCheckedKeys();//获取所选择的Key
                if(this.menuNodeNumber==this.menuIds.length){//如果已勾选的菜单和总菜单的数量一致
                    this.checkAll=true;//设置全选复选框为勾选状态
                }else{//如果不是
                    this.checkAll=false;//设置全选复选框为未勾选状态
                }
            },
            submitForm() {//提交表单事件
                this.menuIds=this.$refs.menuTree.getCheckedKeys();//获取所选择的Key
                this.$axios//将更新后的值传到服务端保存
                    .put("/api/backstage/rolemanage/menu/"+this.roleId,JSON.stringify(this.menuIds))
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {//如果修改成功
                            this.$message({
                                type: "success",
                                message: msg.msg
                            });
                            this.closeDialog();//关闭对话框
                            this.$emit("roleTableRefresh");//刷新父组件的表格
                        }else{//如果修改失败
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {

                    });
            }
        }
    }
</script>

<style scoped>

</style>
