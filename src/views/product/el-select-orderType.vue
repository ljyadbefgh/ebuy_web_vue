<template>
  <el-select
    v-model="orderType"
    clearable
    placeholder="请选择排序规则">
    <el-option
      v-for="(value, key) in orderTypeOptions"
      :key="key"
      :label="value"
      :value="key">
    </el-option>
  </el-select>
</template>

<script>
    /**
     * 自定义排序规则组件
     */
    export default {
        name: "el-select-orderType",
        props: {
            value: {//获取从父组件v-model绑定的input的值
               /* type: String,*/
                default() {
                    return null;
                }
            }
        },
        data() {
            return {
                orderTypeOptions:[] //排序规则集合
            }
        },
        methods:{
            searchOrderTypeOptions(){ //获取产品排序规则列表。
                this.$axios
                    .get("/api/backstage/product/orderTypeMap")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.orderTypeOptions = msg.data;
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        computed: {
            orderType: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    if(this.value!=null){//只有不为null才转换，否则会转换为“null”
                        return String(this.value); //本处Ljy被坑了：然后将服务端传递过来的性别的值改为字符串类型，只有这样才能正确初始化下拉框—。至于原因是初始化时只能识别字符串
                    }
                },
                set: function(value) {//如果orderNum获得新的值
                    this.$emit('input', value);// 则传递给父组件
                }
            }
        },
        mounted() {
            this.searchOrderTypeOptions();
        }
    }
</script>

<style scoped>

</style>
