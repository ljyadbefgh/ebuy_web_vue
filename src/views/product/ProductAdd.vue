<template>
  <el-dialog title="产品创建" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px" @opened="opened" >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="产品分类" prop="productTypeId" align="left">
        <el-select-producttype v-model="form.productTypeId"></el-select-producttype>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="pirUrl" align="left">
        <el-input v-model="form.pirUrl" style="width: 200px;"></el-input>
        <el-button>上传图片</el-button>
      </el-form-item>
      <el-form-item label="优先级" prop="orderNum" align="left">
        <el-select-orderNum v-model.number="form.orderNum" :orderNumOptions="orderNumOptions"></el-select-orderNum>
      </el-form-item>
      <el-form-item label="产品原价" prop="originalPrice">
        <el-input v-model="form.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="产品现价" prop="price">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="repository">
        <el-input v-model.number="form.repository"></el-input>
      </el-form-item>
      <el-form-item label="人气" prop="click">
        <el-input v-model="form.click"></el-input>
      </el-form-item>
      <el-form-item label="是否上架" prop="onSale" align="left">
        <el-select v-model="form.onSale"  placeholder="请选择上架状态">
          <el-option value="true" label="上架"></el-option>
          <el-option value="false" label="下架"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="description" >
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 10}"
          placeholder="请输入简介"
          v-model="form.description">
        </el-input>
      </el-form-item>
      <el-form-item label="介绍" prop="content" >
        <el-input
          type="textarea"
          :autosize="{ minRows: 10,maxRows: 20}"
          placeholder="请输入内容"
          v-model="form.content">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "ProductAdd",
        components: {
            'el-select-producttype': () => import("@/views/product/el-select-producttype.vue"), //引入产品分类下拉框
            'el-select-orderNum': () => import("@/views/product/el-select-orderNum.vue") //引入优先级下拉框
        },
        props: {
            orderNumOptions: {//获取从父组件传递过来的账户信息集合。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                /* type: Array,因为这个传递的是map集合，所以去掉这个检查，否则会被vue警告*/
                default () {
                    return [];
                }
            }
        },
        data() {
            return {
                dialogFormVisible: false,
                form: {
                    productTypeId:null,
                    name: '',
                    pirUrl:'',
                    orderNum:100,
                    originalPrice:0.00,
                    price:0.00,
                    repository:0,
                    click:0,
                    description:'',
                    content:''
                },
                rules: {
                    productTypeId: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 30, message: '长度在 2 到 20个字符', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    originalPrice: [
                        { validator: this.myMethod.elementRules.validateFloat},//自定义正浮点数的验证
                    ],
                    price: [
                        { validator: this.myMethod.elementRules.validateFloat},//自定义正浮点数的验证
                    ],
                    repository: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                    ],
                    click: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'number', message: '必须为数字'}
                    ],
                    onSale: [
                        { required: true, message: '请选择显示方式'}
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
            opened(){//Dialog 打开动画结束时的回调

            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        let productType ={//创建所属产品类别对象
                            id: this.form.productTypeId
                        };
                        this.form.productType=productType;
                        this.$axios//将更新后的值传到服务端保存
                            .post("/api/backstage/product",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.$refs[formName].resetFields();//重置表单
                                    this.$emit("tableRefresh");//刷新父组件的表格
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
            }
        }
    }
</script>

<style scoped>

</style>
