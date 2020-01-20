<template>
  <el-dialog title="菜单编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px" @opened="opened" @closed="closed">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="上级菜单" prop="menuIdPathArray" align="left">
        <el-cascader
          ref="menuCascader"
          clearable
          v-model="form.menuIdPathArray"
          :options="menuArray"
          :props="optionProps"
          @change="menuChange"
           >
        </el-cascader>
      </el-form-item>
      <el-form-item label="菜单名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="优先级" prop="orderNum">
        <el-input v-model.number="form.orderNum"></el-input>
      </el-form-item>
      <el-form-item label="是否可用" prop="enabled" align="left">
        <el-switch v-model="form.enabled"></el-switch>
      </el-form-item>
      <el-form-item label="资源地址" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-divider content-position="center">组件设置</el-divider>
      <el-form-item label="组件名称" prop="component">
        <el-input v-model="form.component"></el-input>
      </el-form-item>
      <el-form-item label="组件图片" prop="iconCls" placeholder="请结合前端，填写图片样式名称">
        <el-input v-model="form.iconCls"></el-input>
      </el-form-item>
      <el-form-item label="路由地址" prop="route">
        <el-input v-model="form.route"></el-input>
      </el-form-item>
      <el-form-item label="组件地址" prop="path">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="需要登陆"  prop="requireAuth" align="left">
        <el-switch v-model="form.requireAuth"></el-switch>
      </el-form-item>
      <el-form-item label="是否显示"  prop="display" align="left">
        <el-switch v-model="form.display"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确认修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "MenuEdit",
        props:{
            menuArray: {///取从父组件传递过来的所有角色信息集合。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Array,
                default () {
                    return [];
                }
            }
        },
        data() {
            return {
                dialogFormVisible: false,
                optionProps: {//用于格式化里的菜单属性
                    value: 'id',
                    label: 'name',
/*                    disabled:'enabled',*/
                    children: 'children',
                    checkStrictly:true //true之后可以选择任意一级选项
                },
                form: {},
                rules: {
                   /* menuIdPathArray: [
                        { type: 'array', required: true, message: '请选择父菜单', trigger: 'change' }
                    ],*/
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                    ],
                    url: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值', trigger: 'blur'}
                    ],
                    component: [
                        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                    ],
                    iconCls: [
                        { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
                    ],
                    route: [
                        { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
                    ],
                    path: [
                        { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
                    ]
                },
            }

        },
        methods: {
            getMenu(id){//读取菜单信息

            },
            openDialog(id) {//打开对话框
                this.dialogFormVisible = true;
                if(id!=undefined){//如果id存在
                    this.$axios
                        .get("api/backstage/menumanage/"+id)
                        .then(response => {//获取返回数据/
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.form = msg.data;
                                this.form.menuIdPathArray=new Array();//创建数组来获取父组件的路径
                                if(this.form.parentId!=null||this.form.parentId!=undefined){//如果存在父栏目
                                    let nodePathArray = this.myMethod.getRootPathAtTreeByKey(this.form.parentId, 'id', this.menuArray);//根据指定的节点获取该节点的完整父路径（含当前节点）
                                    for(let i=0;i<nodePathArray.length;i++){//将节点集合转换为id集合（这样才符合树形组件默认值方式）
                                        this.form.menuIdPathArray.push(nodePathArray[i].id);
                                    }
                                }
                            }else{
                                this.$message.error(msg.msg);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            opened(){//Dialog 打开动画结束时的回调

            },
            closed(){
                this.$refs["form"].resetFields();//关闭时重置表单，让值不会被影响。不会清空级联列表的值（但是会清空级联列表显示出来的Label值）
            },
            menuChange(val){//在父菜单列表改变时触发，val为节点的具体路径，数组形式
                if(val.length>0){//如果选择了节点
                    this.form.parentId=val[val.length-1];//获取最后一个数组的元素作为当前节点
                }else{//如果当前没有选择节点
                    this.form.parentId='';
                }
            },
            submitForm(formName) {//提交表单事件
                //let nodesObj = this.$refs['menuCascader'].getCheckedNodes(true);
                //console.log(this.form.menuIdPathArray);
                console.log(window.JSON.stringify(this.form));
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                       this.$axios//将更新后的值传到服务端保存
                            .put("/api/backstage/menumanage",window.JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.closeDialog();//关闭对话框
                                    this.$emit("menuTableRefresh");//刷新父组件的表格
                                }else{//如果修改失败
                                    this.$message.error(msg.msg);
                                }
                            })
                            .catch(error => {

                            });
                    } else {//如果验证不通过
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
