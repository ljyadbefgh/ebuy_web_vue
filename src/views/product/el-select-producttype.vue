<template>
  <el-select
    clearable
    filterable
    v-model="productTypeId"
    remote
    :remote-method="searchProductTypeOptions"
    @clear="clear"
    @focus="focus"
    placeholder="请选择产品类别">
    <el-option
      v-for="productType in productTypeOptions"
      :key="productType.id"
      :label="productType.name"
      :value="productType.id">
    </el-option>
  </el-select>
</template>

<script>
    /**
     * 20200131最后修正
     *
     * 一、组件功能说明
     * 1.当选择框没有任何搜索值时，加载默认的下拉列表
     * 2.当选择框有搜索值时
     * （1）如果选择框没有选中的值，则会加载相应的数值到下拉框中
     * （2）如果选择框有选中的值，则会提示不允许再选择，必须要点击选择框的清除按钮取消选中值之后，才可以再进行搜索。
     * 3.当选择框已经有选中状态时，会加载该选中状态对应的下拉列表显示
     *
     * 二、快速使用方法：
     * <el-select-producttype v-model="form.productTypeId"></el-select-producttype>
     * 其中form.productTypeId对应本组件的value，是一个双向绑定的值。
     * 特别说明：如果传进来的值是在父组件异步加载的，如产品编辑，先异步读取产品信息，获取到相应产品栏目，并且是form.productTypeId的形式传入，那么必须保证from对象在读取的过程中不变
     * 如传统的：this.form = msg.data;
     * 将会出现问题，必须是this.form=Object.assign(this.form,  msg.data);其中this.form应该包含相关的初始属性定义
     *
     *
     * 三、组件设计说明：
     * 1.原生下拉框remote与本人设计的不符
     * （1）原设计：remote事件是在手动输入值时候才触发。
     * 本人设计：这样在空白时候打开是空的，而本人设计需要空白时候打开默认的列表（也可以限制数量）
     * （2）原设计（猜测是BUG）：remote事件是在手动输入值发生变化的时候才触发，并且如果没有选择下拉框，文本框不会保留上次手动输入的值（重点），这样下次打开下拉框时会看到结果还是上次输入值的下拉框，如果没有找到记录，则下拉框不会显示。容易让人误以为下拉框出现了问题：即没有值，也不显示下拉框
     * 本人设计：下拉框失去焦点后，如果没有选择下拉列表中的选项，那么下次打开时，如果会清空手动输入的值，然后获取空白时应显示的默认列表。
     * （3）特别说明——使用前必读：
     * 结论：表单对象不能重新赋值；如果开始需要设定的初始值，则必须传递为null
     * 机制解释：
     * 在表单编辑时，如产品编辑表单，因为要异步读取产品信息，此时按常规用法用
     * this.form = msg.data;
     * 来获取新产品信息，会因为form重新获得了对象地址，导致产品栏目下拉框的value值无法监听。代码的具体表现就是：computed无法监听父组件传递过来的value值的变化
     * 所以应该在不改变from对象地址的前提下进行操作，如下面代码
     * this.form=Object.assign(this.form,  msg.data);
     * 同时为了避免父组件dom渲染延迟，应该为form提前设计好属性，如下
     * data:{
     *   form: {// 这里必须初始化所有属性，否则后面用form=msg.data，因为form地址的变化，会导致产品栏目下拉框无法监听
                    productTypeId:null,
                    name: '',
                    picUrl:'',
                    orderNum:100,
                    originalPrice:0.00,
                    price:0.00,
                    repository:0,
                    click:0,
                    onSale:'',
                    description:'',
                    content:''
                },
     * }
     *即可解决问题
     */
    export default {
        name: "el-select-producttype",
        props: {
            value: {//获取从父组件传递过来的当前选择的值
/*                type: Number,*/
                default() {
                    return null;
                }
            }
        },
        data() {
            return {
                query:'', // 获取产品栏目中的手动输入值，通过触发remote获取。用于配合实现其他事件
                productTypeOptions:[] //远程搜索的产品栏目集合
            }
        },
        methods: {
            searchProductTypeOptions(query){ //获取产品栏目查询列表。query为当前的下拉框输入的值（非Key）
                if(query!=''&&this.productTypeId!=''){//只有当前处于未选中状态时，才进行搜索
                    this.$message.error("如需选择其他的值，请先点右侧清空按钮，清空当前选项后再进行选择");
                }else{
                    this.query=query;
                    //console.log("search:"+this.productTypeId);
                    this.$axios
                        .get("/api/backstage/producttype",{
                            params: {
                                page: 1,
                                limit: 10,
                                name:this.query,
                                id:this.productTypeId
                            }
                        })
                        .then(response => {//获取返回数据
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.productTypeOptions = msg.data;
                            }else{
                                this.$message.error(msg.msg);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            },
            clear(){//当点击选择框的清空按钮时，加入 id:this.productTypeId查询条件后，必须通过这个来执行
                this.$nextTick(()=>{//目的，等this.productTypeId被清空完成再执行搜索。因为是双向绑定的值，通过compute调用，如果不用this.$nextTick，这里会出现时间差，即已经按照原来的值搜索完得到结果，才会清空原来的值。
                    this.searchProductTypeOptions("");
                });
            },
            focus(){//当复选框获得焦点时触发，用于配合解决BUG（搜索框本身无BUG，但是不符合我对于此处下拉框的设置：即空白时显示所有，有值时显示相应的）。当下拉框输入值，如“汤”，但是不选择时。这个时候下拉框不显示内容“汤”，但是下拉框一直显示的是根据“汤”查询的列表（此时应显示的是空白时查询的列表）。此时无法用clear，只能编写新的值才能得到新的结果。
                //加入this.query!=null的条件，是避免在空的时候重复刷新。（除了第一次加载，后面为空的时候都必然是手动清除的，手动清除可以触发remote）
               /* if((this.productTypeId==null||this.productTypeId=="")&&this.query!=''){//在没有选中时，如果失去焦点再打开，此时下拉框列表还是根据上次手动输入的值查询到的，但是手动输入的值已经不显示了。为了提高体验，在此重新查询
                    this.searchProductTypeOptions("");
                }*/
                if(this.productTypeId==null||this.productTypeId==""){//在没有选中时，每次点击都重新查询
                    this.searchProductTypeOptions("");
                }
            }
        },
        watch: {
            //必须，否则如果下拉列表很多第一次没加载到，那就获取不到产品栏目id对应的值了
           value(newValue, oldValue){//专门用于表单编辑时（例如产品编辑），初始值是先异步获取信息（如先读取产品信息，获取到相应产品栏目），再传递过来的情况
               //console.log("watch_old"+oldValue);
               //console.log("watch_new"+newValue);
                if(newValue!=null&&newValue!=''){//当选择框选择了值，则下拉框值显示相关的值。
                    this.searchProductTypeOptions('');
                }
            },
        },
        computed: {
            productTypeId: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    //console.log("get:"+this.value);
                    return this.value;
                },
                set: function(value) {//如果productTypeId获得新的值。
                    //console.log("set:"+value);
                    this.$emit('input', value);// 则传递给父组件。机制学习：computed这里的值变化后，watch就会监听到
                }
            }
        }
        /*mounted() {//说明：子组件被不同的父组件调用，例如被2个父组件调用就初始化两次。后面取消此处初始化，由文本框获得焦点时再根据情况初始化。
            this.searchProductTypeOptions('');
        }*/
    }
</script>

<style scoped>

</style>
