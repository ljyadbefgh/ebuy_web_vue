<template>
  <el-dialog title="批量转移产品到指定栏目" :close-on-click-modal="false" :visible.sync="dialogFormVisible" @closed="closed" width="400">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="产品栏目" prop="productTypeId" align="left">
        <el-select-producttype v-model="form.productTypeId"></el-select-producttype>
      </el-form-item>
    </el-form>
    <el-table
      :data="products"
      stripe
      border
      style="width: 100%">
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="产品名称">
      </el-table-column>
      <el-table-column
        width="100"
        show-overflow-tooltip
        prop="productType.name"
        label="所属栏目">
      </el-table-column>
      <el-table-column
        width="80"
        align="center"
        prop="price"
        label="现价">
      </el-table-column>
      <el-table-column
        width="80"
        align="center"
        prop="originalPrice"
        label="原价">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="danger" @click="submit('form')" >提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "ProductTransfer",
        components: {
            'el-select-producttype': () => import("@/views/product/el-select-producttype.vue") //引入产品分类下拉框
        },
        props:{
            products: {//获取从父组件传递过来的产品集合
                type: Array,
                default () {
                    return [];
                }
            }
        },
        data() {
            return {
                dialogFormVisible: false,
                form: {
                    productIds:[],
                    productTypeId:''
                },
                rules: {
                    productTypeId: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ]
                },
            }

        },
        methods: {
            openDialog() {//打开对话框
                this.dialogFormVisible = true;
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            closed(){
                this.$refs['form'].resetFields();//重置表单
            },
            submit(formName) {//将角色批量赋予多个账户
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        if(this.products.length>0){//如果有产品集合
                            for (let i = 0; i < this.products.length; i++) {
                                this.form.productIds.push(this.products[i].id);
                            }
                            this.$axios//将更新后的值传到服务端保存
                                .put("/api/backstage/product/productType",JSON.stringify(this.form))
                                .then(response => {//获取返回数据
                                    let msg=response.data;
                                    if (msg.code === 0) {//如果修改成功
                                        this.$message({
                                            type: "success",
                                            message: "操作成功"
                                        });
                                        this.closeDialog();//关闭窗口
                                        this.$emit("tableRefresh");//刷新父组件的表格
                                    }else{//如果修改失败
                                        this.$message.error(msg.msg);
                                    }
                                })
                                .catch(error => {

                                });
                        }else{
                            this.$message.error("请先选择产品");
                        }
                    } else {//如果验证不通过
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
