<template>
  <el-select
    v-model="orderNum"
    clearable
    placeholder="请选择优先级">
    <el-option
      v-for="(value, key) in orderNumOptions"
      :key="key"
      :label="value"
      :value="key">
    </el-option>
  </el-select>
</template>

<script>
    export default {
        name: "el-select-orderNum",
        props: {
            value: {//获取从父组件v-model绑定的input的值
               /* type: String,*/
                default() {
                    return null;
                }
            },
            orderNumOptions: {//获取从父组件传递过来的优先级map对象集合。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                /* type: Array,因为这个传递的是map集合，所以去掉这个检查，否则会被vue警告*/
                default () {
                    return [];
                }
            }
        },
        data() {
            return {
                query:'', // 获取产品栏目中的手动输入值，通过触发remote获取。用于配合实现其他事件
                productTypeOptions:[] //远程搜索的产品栏目集合
            }
        },
        computed: {
            orderNum: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    if(this.value!=null){//只有不为null才转换，否则会转换为“null”
                        return String(this.value); //本处Ljy被坑了：然后将服务端传递过来的性别的值改为字符串类型，只有这样才能正确初始化下拉框—。至于原因是初始化时只能识别字符串
                    }
                },
                set: function(value) {//如果orderNum获得新的值
                    this.$emit('input', value);// 则传递给父组件
                }
            }
        }
    }
</script>

<style scoped>

</style>
