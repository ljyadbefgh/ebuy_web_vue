<template>
  <div style="display: inline;" v-loading="loading">
    <template v-if="editorType=='image'">
       <el-button :id="editorId" @click="openImageDialog">上传图片</el-button>
    </template>
    <template v-else>
      <textarea :id="editorId" type="text/plain" style="width:100%;height:800px;" ></textarea>
    </template>

  </div>
</template>

<script>
    //主体文件引入
    //主体文件引入
    import '../../static/plugins/ueditor/ueditor.config.js'
    import '../../static/plugins/ueditor/ueditor.all.min.js'
    import '../../static/plugins/ueditor/lang/zh-cn/zh-cn.js'
    import '../../static/plugins/ueditor/ueditor.parse.js'

    /**
     * ljy于20200130完成的ueditor组件，可以实现富文本和图片上传组件功能
     * 使用说明：
     * 1.editorType
     * image表示上传图片组件，editor表示富文本编辑器。如果使用了image，则value属性无效
     * 2.value属性特别说明（重要）——只在editor属性下有效
     * （1）说明：value主要是获取从父组件传递过来的富文本内容，但是由于不同表单中的赋值不一样，因此本插件为了简化操作，主要是根据value来进行逻辑判断
     * （2）使用情况
     * a.在表单添加时（如产品添加表单），无需特别注意。
     * b.在表单编辑时（如产品编辑表单），也无需特别操作，但是本插件针对原生插件引入时存在的多个问题做了多方面处理。
     * b(1)。首先是通过watch监听value的值，用于检测本组件初始化时值的情况。保证在异步加载时（如产品编辑表单异步读取产品信息），插件能够获取到异步加载后的产品信息
     * b(2)。但如果只通过上面这步，会出现一个问题，即第一次加载时富文本为空；当然第二次后就没问题了。
     * 经过调试，发现出现这个的原因是因为加载插件的延迟导致的，结果就是富文本先将watch监听到的值赋值，然后再把空的value赋值。
     * 初步考虑是this.ueditor.ready(function()的原因，因为赋值都建立在ready的前提下
     * 在原代码中，watch赋值要先ready
     * 初始化文本框时，也会附值，此时值为Null，当然在非异步赋值时，不会出问题。但是异步赋值，就会出现初始化时，存在watch和下述两种值的情况，
     *  if(this.editorType=='editor'){
             this.setContent(this.value);// 初始化文本框内容
         }
     * 至于谁先ready好，无法确认——待查
     * 因此初始化富文本时，我加了个条件
     *  if(this.editorType=='editor'){
                //特别注意，下面是通过不断试验得出的方法，必须配合watch才能完美实现
                if(this.value!=''){
                    this.setContent(this.value);// 初始化文本框内容
                }
            }
     *即让初始化时，如果为空值，则不进行赋值；如果不为空值，那就由watch来处理，这样就保证了它和watch的不冲突，保证了效果的正确显示。
     */
    export default {
        name: "MyUeditor",
        props: {
            editorId: {//传入编辑器的id值，每个id会生成一个uditor。如果是在同一个组件调用，id值注意不能重名，否则会冲突。
                type: String
            },
            editorType:{// 使用编辑器的类型。当前设计有两种：image表示上传图片组件，editor表示富文本编辑器
                type:String
            },
            loading:{ //对应加载，false表示不加载
                default: false,//默认不加载
            },
            ueditorConfig: {//获取从父组件传递过来的ueditor的配置
                type: Object,
                default () {
                    return {};
                }
            },
            value: {//获取从父组件传递过来的富文本的内容
                type: String,
                default () {
                    return '';
                }
            }
        },
        data() {
            return {
               ueditor:null // 编辑器实例
            }
        },
       /* computed: {
            editorLoading: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    console.log("get:"+this.loading);
                    //console.log("get:"+this.value);
                    return this.loading;
                },
                set: function(value) {//如果productTypeId获得新的值。
                    console.log("set:"+value);
                    this.$emit("onChangeLoading",value);// 则传递给父组件。机制学习：computed这里的值变化后，watch就会监听到
                }
            }
        },*/
        methods:{
            setContent(value){ //给富文本内容赋值
                let _this=this;
                //对编辑器的操作最好在编辑器ready之后再做
                this.ueditor.ready(function() {
                    _this.$nextTick(()=>{//目的，等this.productTypeId被清空完成再执行搜索。因为是双向绑定的值，通过compute调用，如果不用this.$nextTick，这里会出现时间差，即已经按照原来的值搜索完得到结果，才会清空原来的值。
                        _this.$emit("onChangeLoading",false);
                    });
                    console.log(" this.editorLoading1:"+ _this.loading);
                    _this.ueditor.setContent(value);
                });
            },
            getContent(){//返回ueditor的富文本内容，例如: <p>hello</p>
                let _this=this;
                let content=null;//获取最后返回的富文本内容
                //对编辑器的操作最好在编辑器ready之后再做
                this.ueditor.ready(function() {
                    content=_this.ueditor.getContent();
                });
                return content;
            },
            getContentTxt(){ //获取纯文本内容，例如hello
                let _this=this;
                let content=null;//获取最后返回的纯文本内容
                //对编辑器的操作最好在编辑器ready之后再做
                this.ueditor.ready(function() {
                    content=_this.ueditor.getContentTxt();
                });
                return content;
            },
            setImageEditor(){//初始化图片上传插件，
                let _this=this;
                this.ueditor.ready(function(){
                    _this.$nextTick(()=>{//目的，等this.productTypeId被清空完成再执行搜索。因为是双向绑定的值，通过compute调用，如果不用this.$nextTick，这里会出现时间差，即已经按照原来的值搜索完得到结果，才会清空原来的值。
                        _this.$emit("onChangeLoading",false);
                    });
                    console.log(" this.editorLoading2:"+ _this.loading);
                    //myEditorImage.setDisabled();
                    _this.ueditor.hide();//隐藏UE框体
                    _this.ueditor.addListener('beforeInsertImage',function(t, arg){//监听插入图片动作，回调函数
                        //alert(arg[0].src);//arg就是上传图片的返回值，是个数组，如果上传多张图片，请遍历该值。
                        //把图片地址赋值给页面input
                        if(arg.length>1){
                            _this.$message.error("只能选一张图片上传");
                        }else{
                            _this.$emit('uploadPicUrl',arg[0].src);//调用父组件的方法，将插入图片的值赋给父组件。arg[0].src表示第一张图片
                        }
                    });
                });
            },
            openImageDialog(){
                let dialog= this.ueditor.getDialog("insertimage");//获取插入图片的对话框
                dialog.render();//渲染
                dialog.open();//打开插入图片对话框
            }
        },
        watch: {
            //如果编辑器没加载好，value值已经准备好了，那这个监听无效。这个监听是用于编辑器已经准备好（即没刷新页面前，第二次即以后打开使用）
            value: function(val, oldVal) {//检测富文本值的变化，主要用于开始的赋值。如果Ueditor加载好了，但是富文本的内容还没有异步读取到，这个时候通过监听，让编辑器读取加载好的富文本内容。
                let _this=this;
                let editor=this.ueditor;//等于当前编辑器
                editor.ready(function() {
                    _this.$nextTick(()=>{//目的，等this.productTypeId被清空完成再执行搜索。因为是双向绑定的值，通过compute调用，如果不用this.$nextTick，这里会出现时间差，即已经按照原来的值搜索完得到结果，才会清空原来的值。
                        _this.$emit("onChangeLoading",false);
                    });
                    console.log(" this.editorLoading3:"+ _this.loading);
                    editor.setContent(val);
                });


               /* if (val != null  && this.ready) {
                    this.instance = UE.getEditor(this.randomId, this.ueditorConfig);
                    this.instance.setContent(val);
                }*/
            }
        },
        mounted() {
            this.editorLoading=true;//加载架构
            let config={//原始配置，必须存在
                zIndex:5000,//element的dialog默认是2000，这里应该至少在2000以上。经过测试5000比较稳妥，3000也出现过问题
                serverUrl:this.$store.getters.ueditorServerUrlWithCredentials//必须手动设置，因为uedidot.config.js中保存的地址只会读取一次
                //UEDITOR_HOME_URL:'static/plugins/ueditor/' //放置文件的目录
            };
            this.ueditorConfig=Object.assign(this.ueditorConfig, config);//将配置信息合并。合并对象的值（如果对象本身存在的属性会更新,不存在的属性会增加。注意根据业务场合，这里可以用），不能直接对象引用，否则无法更改表格原来的数据
            this.ueditor= UE.getEditor(this.editorId,this.ueditorConfig);//根据id，初始化富文本。必须：否则一个父组件只能初始化一个Ueditor。
            if(this.editorType=='editor'){
                //特别注意，下面是通过不断试验得出的方法，必须配合watch才能完美实现
                if(this.value!=''){//特别注意，如果value不为空，如果有值传入，此时赋值。否则不赋值，避免初始化时和watch冲突。
                    this.setContent(this.value);// 初始化文本框内容
                }
            }else if(this.editorType=='image'){
                this.setImageEditor();//初始化插件
            }else{//如果都没有，默认是富文本
                this.setContent(this.value);// 初始化文本框内容
            }
        },
        beforeDestroy() {//销毁后，必须销毁，否则显示会有问题。加上代码后，第一次和切换路由后都能加载出来
            if(this.ueditor !== null && this.ueditor.destroy) {
                this.ueditor.destroy();
            }
        }
    }
</script>

<style scoped>

</style>
