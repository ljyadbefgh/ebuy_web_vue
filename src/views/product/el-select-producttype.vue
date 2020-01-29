<template>
  <el-select
    clearable
    filterable
    remote
    v-model="productTypeId"
    :remote-method="searchProductTypeOptions"
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
     * 说明：
     * 1.原生下拉框remote与本人设计的不符
     * （1）原设计：remote事件是在手动输入值时候才触发。
     * 本人设计：这样在空白时候打开是空的，而本人设计需要空白时候打开默认的列表（也可以限制数量）
     * （2）原设计（猜测是BUG）：remote事件是在手动输入值发生变化的时候才触发，并且如果没有选择下拉框，文本框不会保留上次手动输入的值（重点），这样下次打开下拉框时会看到结果还是上次输入值的下拉框，如果没有找到记录，则下拉框不会显示。容易让人误以为下拉框出现了问题：即没有值，也不显示下拉框
     * 本人设计：下拉框失去焦点后，如果没有选择下拉列表中的选项，那么下次打开时，如果会清空手动输入的值，然后获取空白时应显示的默认列表。
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
                this.query=query;
                this.$axios
                    .get("/api/backstage/producttype",{
                        params: {
                            page: 1,
                            limit: 10,
                            name:query
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
            },
            focus(){//当复选框获得焦点时触发，用于配合解决BUG（搜索框本身无BUG，但是不符合我对于此处下拉框的设置：即空白时显示所有，有值时显示相应的）。当下拉框输入值，如“汤”，但是不选择时。这个时候下拉框不显示内容“汤”，但是下拉框一直显示的是根据“汤”查询的列表（此时应显示的是空白时查询的列表）。此时无法用clear，只能编写新的值才能得到新的结果。
                //加入this.query!=null的条件，是避免在空的时候重复刷新。（除了第一次加载，后面为空的时候都必然是手动清除的，手动清除可以触发remote）
                if((this.productTypeId==null||this.productTypeId=="")&&this.query!=''){//在没有选中时，如果失去焦点再打开，此时下拉框列表还是根据上次手动输入的值查询到的，但是手动输入的值已经不显示了。为了提高体验，在此重新查询
                    this.searchProductTypeOptions("");
                }
            }
        },
        watch: {
            query(newValue, oldValue) {//检查输入值的变化
                // console.log(oldValue);
                // console.log(newValue);
            }
        },
        computed: {
            productTypeId: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    return this.value
                },
                set: function(value) {//如果productTypeId获得新的值
                    this.$emit('input', value);// 则传递给父组件
                }
            }
        },
        mounted() {//说明：子组件被不同的父组件调用，例如被2个父组件调用就初始化两次
            this.searchProductTypeOptions('');
        }
    }
</script>

<style scoped>

</style>
