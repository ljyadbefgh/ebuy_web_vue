<template>
  <el-dialog align="center" title="头像上传" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px" @opened="opened" @closed="closed">

    <img v-if="imageUrl!=null&&imageUrl!=''" :src="imageUrl"  style="height:180px;min-width:120px;">
    <img v-else :src="myVariable.pic.noPic4Src"  style="height:180px;min-width:120px;">
    <el-upload
      ref="upload"
      class="upload-demo"
      accept="image/jpeg,image/gif,image/png,image/bmp"
      :action="action"
      list-type="picture"
      :on-exceed="uploadExceed"
      :before-remove="beforeRemove"
      :on-success="uploadSuccess"
      :show-file-list="true"
      :limit="1"
      :with-credentials="true"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传头像</el-button>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png/gif/bmp文件</div>
    </el-upload>


  </el-dialog>
</template>

<script>
    export default {
        name: "ProductTypeLogoUpload",
        data() {
            return {
                dialogFormVisible: false,
                productType:{},
                action:'',// 设置图片提交的地址
                imageUrl: ''
            }
        },
        methods: {
            openDialog(id) {//打开对话框
                this.dialogFormVisible = true;
                this.action=this.myVariable.baseUrl+"/api/backstage/producttype/uploadPhoto/"+id;//定义上传头像的地址
                this.$nextTick(()=>{//防止窗口还没有显示就开始网络连接，导致全局Lodding覆盖不了该窗口
                    this.$axios
                        .get("/api/backstage/producttype/"+id)
                        .then(response => {//获取返回数据/
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.productType=msg.data;
                                let imageUrl=this.productType.imageUrl;
                                if(imageUrl!=null&&imageUrl!=''){
                                    this.imageUrl=imageUrl+"?"+Math.random();//重要：被坑了很久实验多次才成功，并且要这里设置。设置图片地址不缓存，因为如果头像有上传，地址都是一样的（服务端决定）。因此如果不加入，浏览器会因为图片地址不变化设置缓存，导致新上传的图片无法在浏览器显示
                                }else{
                                    this.imageUrl='';
                                }
                            }
                        });
                });
            },
            closeDialog() {//关闭对话框
                this.dialogFormVisible = false;
            },
            opened(){//Dialog 打开动画结束时的回调

            },
            closed(){
                this.$refs.upload.clearFiles();//清空上传组件信息
                this.imageUrl='';//清空图片地址
            },
            uploadExceed(files, fileList){// 文件超出个数限制时的钩子时执行。files是选中但没有在文件列表的图片；fileList在文件列表中的图片集合
                this.$message.error("只允许上传一个头像");
            },
            beforeRemove(file, fileList) {//删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            uploadSuccess(response, file, fileList){// 上传成功后执行
                //let msg=response.data; // 注意，在图片上传这里，response就是返回的json数据，不需要再用response.data
                if (response.code === 0) {//如果上传成功
                    this.imageUrl=window.URL.createObjectURL(file.raw);//将图片变为已经上传的图片。注意：从本地图片读取而不是服务端
                    //fileList.length=0;// 清空文件列表中的图片集合
                    this.$emit("tableRefresh");//刷新父组件的表格
                }else{
                    this.$message.error(response.msg);
                }
                this.$refs.upload.clearFiles();//不管成功或是失败，都清空上传组件信息
            },
            submitUpload() {//点击上传按钮
                this.$refs.upload.submit();
            }
        }
    }
</script>

<style scoped>

</style>
