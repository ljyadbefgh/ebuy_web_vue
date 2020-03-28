<template>
  <el-dialog title="产品创建" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="1010px"  @opened="opened" @closed="closed">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="产品分类" prop="productTypeId" align="left">
        <el-select-producttype v-model="form.productTypeId"></el-select-producttype>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="标题图片" prop="picUrl" align="left">
        <el-input v-model="form.picUrl" clearable readonly style="width: 300px;"></el-input>
        <MyUeditor
          ref="pictureUeditor"
          editorId="picUrlId"
          :loading="ueditorLoading1"
          @onChangeLoading="onchangeLoaddingOfImage"
          :config="picUrlConfig"
          editorType="image"
          @uploadPicUrl="uploadPicUrl"
        />
      </el-form-item>
      <el-form-item label="预览图">
        <div id="picturePreViewsDiv">
          <article
            class="picturePreView"
            @mouseover="imageOperatorShow=true"
            @mouseout="imageOperatorShow=false"
            v-for="(previewPicture, index) in form.previewPictures"
            :key="index">
            <el-image
              style="height:60px;width: 80px;margin-right: 10px;"
              fit="fill"
              :src="previewPicture"
              :preview-src-list="[previewPicture]"></el-image>
            <div align="center" id="'mask_'+index">
             <el-link type="primary" icon="el-icon-delete" @click="removePreviewPicture(index)" style="font-size: 12px;">删除</el-link>
            </div>
          </article>
        </div>
        <MyUeditor
          editorId="picUrlId+index"
          :config="picUrlConfig"
          editorType="image"
          allowUploadPictureNumber="8"
          @uploadPicUrl="uploadPrePicUrl"
        />
      </el-form-item>
      <el-form-item label="优先级" prop="orderNum" align="left">
        <el-select-orderNum v-model.number="form.orderNum" :orderNumOptions="orderNumOptions"></el-select-orderNum>
      </el-form-item>
      <el-form-item label="推荐指数" prop="recommendation" align="left">
        <el-rate v-model="form.recommendation" :max="5" show-score text-color="#ff9900"></el-rate>
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
        <el-input v-model.number="form.click"></el-input>
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
      <el-form-item label="介绍" prop="content" align="left">
        <!--<el-input
          type="textarea"
          :autosize="{ minRows: 10,maxRows: 20}"
          placeholder="请输入内容"
          v-model="form.content">
        </el-input>-->
        <MyUeditor
          ref="contentUeditor"
          editorType="editor"
          editorId="contentId"
          :loading="ueditorLoading2"
          @onChangeLoading="onchangeLoaddingOfContent"
          :value="form.content"
          :config="contentConfig">
        </MyUeditor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')" :loading="loading">创建</el-button>
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
                loading:false,
                imageOperatorShow:false,
               /* config: {
                    //serverUrl:this.myVariable.ueditorServerUrl+";jsessionid="+sessionStorage.getItem("JSESSIONID")+"?"
                    serverUrl:this.$store.getters.ueditorServerUrlWithCredentials//必须手动将值传过去，因为uedidot.config.js中保存的地址只会读取一次
                },*/
                picUrlConfig: {
                    wordCount: false,
                },
                contentConfig: {
                    // initialFrameWidth: '100%',
                    // initialFrameHeight: 800,
                    wordCount: true
                },
                ueditorLoading1:true,
                ueditorLoading2:true,
                form: {
                    previewPictures: [],
                },
                rules: {
                    productTypeId: [
                        { required: true, message: '不能为空'}
                    ],
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 30, message: '长度在 2 到 20个字符', trigger: 'blur' }
                    ],
                    picUrl: [
                        { required: true, message: '不能为空', trigger: 'blur' }
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
                this.initForm();//初始化表单
                this.dialogFormVisible = true;
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            opened(){//Dialog 打开动画结束时的回调

            },
            closed(){
                this.initForm();
                this.$refs['form'].resetFields();//重置表单
                this.$refs.contentUeditor.setContent("");//清空富文本的值
            },
            onchangeLoaddingOfContent(value){
                this.ueditorLoading2=value;
            },
            uploadPicUrl(picUrl){//当点击图片上传时调用，获取ueditor图片上传组件调用图片的地址
                this.$set(this.form,'picUrl',picUrl);
                if(this.form.previewPictures.length==0){//如果预览图还没有图片，则为预览图添加一张图片
                    this.form.previewPictures.push(picUrl);
                }
            },
            onchangeLoaddingOfImage(value){
                this.ueditorLoading1=value;
            },
            uploadPrePicUrl(picUrlArray){//用于预览图上传，批量上传
                const array=picUrlArray.split(",");//将组件传递过来的字符串重新转为数组
                if(this.form.previewPictures.length+array.length>8){
                    this.$message.error("预览图不能超过8张");
                }else{
                    this.form.previewPictures=this.form.previewPictures.concat(array);//连接数组
                }
            },
            removePreviewPicture(index){//移除某个图片
                this.form.previewPictures.splice(index,1);
            },
            initForm(){//初始化表单元素
                this.$set(this.form,'productTypeId',null);
                this.$set(this.form,'name','');
                this.$set(this.form,'picUrl','');
                this.$set(this.form,'orderNum','100');
                this.$set(this.form,'recommendation',1);
                this.$set(this.form,'originalPrice',0.00);
                this.$set(this.form,'price',0.00);
                this.$set(this.form,'repository',0);
                this.$set(this.form,'click',0);
                this.$set(this.form,'onSale','true');
                this.$set(this.form,'description','');
                this.$set(this.form,'content','');
                this.form.previewPictures.splice(0,this.form.previewPictures.length);//清空之前上传的预览图列表。
            },
            submitForm(formName) {//提交表单事件
                this.$refs[formName].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.loading=true;//加载状态
                        let productType ={//创建所属产品类别对象
                            id: this.form.productTypeId
                        };
                        this.form.productType=productType;
                        //获取富文本内容的值
                        this.form.content=this.$refs.contentUeditor.getContent();
                        this.$axios//将更新后的值传到服务端保存
                            .post("/api/backstage/product",JSON.stringify(this.form))
                            .then(response => {//获取返回数据
                                this.loading=false;
                                let msg=response.data;
                                if (msg.code === 0) {//如果修改成功
                                    this.$message({
                                        type: "success",
                                        message: msg.msg
                                    });
                                    this.initForm();//初始化表单元素
                                    this.$emit("tableRefresh");//刷新父组件的表格
                                }
                            })
                            .catch(error => {
                                this.loading=false;
                            });
                    } else {//如果验证不通过
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
#picturePreViewsDiv{
  display: -webkit-flex;
  display: flex;
}
.picturePreView{
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
}
.imageOperatorMask{
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  height: 40px;
  width: 60px;
  /*透明度为0，则就是不可见*/
  opacity: 0;
}
.imageOperatorMask:hover{
  opacity: 1;
}

</style>
