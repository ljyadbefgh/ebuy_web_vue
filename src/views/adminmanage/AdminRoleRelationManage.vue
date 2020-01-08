<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" align="center"  width="630px" @opened="openDialogChecked" @closed="closeDailogClean">
    <el-transfer
      align="left"
      v-model="rolesSelect"
      :titles="titles"
      :data="roles"
      @change="handleChange"
    >
    </el-transfer>
  </el-dialog>
</template>

<script>
    export default {
        name: "AdminRoleRelationManage",
        data() {
            return {
                id:'',//接收传递过来的id的值
                name:'',//接收传递过来的name值
                title:'',//对话框的标题
                titles:['未赋予的角色','已赋予的角色'],
                dialogFormVisible: false,
                roles: [],//所有角色信息
                rolesSelect: []//已经拥有的角色关系
            };
        },
        methods: {
            openDialog(id,name) {//打开对话框
                this.dialogFormVisible = true;
                this.id=id;
                this.name=name;
                this.title="账号("+name+")的角色关系管理";
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            openDialogChecked(){//Dialog 打开的回调，检查父组件是否传递了id过来
                if(this.id==''){//如果没有接收到父窗口传递过来的值
                    this.closeDialog();//关闭窗口
                    this.$message.error("没有接收到要编辑的账户信息");
                }else{//如果有id,读取账户信息
                    this.getAdminRoleRelation();//重新读取角色关系信息
                }
            },
            closeDailogClean() {//Dialog 关闭动画结束时的回调。这里是在关闭窗口时清空窗口的编辑信息

            },
            getAdminRoleRelation(){//重新读取角色关系信息
                //清空穿梭框里面的原始值，避免第二次打开还会存在
                this.roles.length=0;
                this.rolesSelect.length=0;
                this.$axios
                    .get("api/backstage/adminmanage/"+this.id+"/adminRoleRelationManage")
                    .then(response => {//获取返回数据/
                        let msg=response.data;
                        if (msg.code === 0) {
                            let adminRoles = msg.data;
                            for (let i = 0; i < adminRoles.length; i++) {//获取该账户拥有的所有角色关系
                                let adminRole=adminRoles[i];//获取相应的关系对象
                                let disabled=true;//决定该角色是否可操作，默认不可以操作
                                if(adminRole.role.enabled==true){//如果角色是可用的
                                    disabled=false;
                                }
                                this.roles.push({
                                    key:adminRole.role.id,
                                    label:adminRole.role.nameZH,
                                    disabled:disabled
                                });
                                if(adminRole.id!=null){//如果id为null，表示该账户没有相关角色关系
                                    this.rolesSelect.push(adminRole.role.id);
                                }
                            }
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleChange(rightValue, direction, movedKeys) {//回调参数：当前值、数据移动的方向（'left' / 'right'）、发生移动的数据 key 数组。rightValue表示右边栏目也是当前拥有的记录数（key值）集合；movedkey表示当前移动的数组的（key值）集合
                //可以通过direction回调right/left 来进行操作，right：把数字移到右边，left把数据移到左边
                if(direction === "right") {//把记录向右边移动
                    this.$axios
                        .post("/api/backstage/adminmanage/" + this.id+"/adminRoleRelationManage/roles/"+movedKeys.toString())
                        .then(response => {//获取返回数据
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.$message("操作成功");
                                this.$emit("adminTableRefresh");//刷新父组件的表格
                            }else{
                                this.getAdminRoleRelation();//重新读取角色关系信息
                                this.$message.error(msg.msg);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
                if(direction === "left") {//向左边移动
                    this.$axios
                        .delete("/api/backstage/adminmanage/" + this.id+"/adminRoleRelationManage/roles/"+movedKeys.toString())
                        .then(response => {//获取返回数据
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.$message("操作成功");
                                this.$emit("adminTableRefresh");//刷新父组件的表格
                            }else{
                                this.getAdminRoleRelation();//重新读取角色关系信息
                                this.$message.error(msg.msg);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            }
        },
    }
</script>

<style scoped>

</style>
