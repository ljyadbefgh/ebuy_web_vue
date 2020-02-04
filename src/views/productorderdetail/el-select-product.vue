<template>
  <el-select
    clearable
    filterable
    v-model="productId"
    remote
    :remote-method="searchOptions"
    placeholder="请输入产品名">
    <el-option
      v-for="product in options"
      :key="product.id"
      :label="product.name"
      :value="product.id">
      <span style="float: left">{{ product.name }}</span>
      <span style="float: right; margin-left:15px;color: #8492a6; font-size: 13px">{{ product.productType.name}}</span>
    </el-option>
  </el-select>
</template>

<script>

    export default {
        name: "el-select-product",
        props: {
            value: {//获取从父组件传递过来的当前选择的值
/*                type: Number,*/
                default() {
                    return null;//必须设置为null，否则watch观察会出现偏差
                }
            }
        },
        data() {
            return {
                query:'', // 获取文本框中的手动输入值，通过触发remote获取。用于配合实现其他事件
                options:[] //远程搜索的选项信息集合
            }
        },
        methods: {
            searchOptions(query){ //获取query获取列表
                this.$axios
                    .get("/api/backstage/product",{
                        params: {
                            page: 1,
                            limit: 10,
                            name:query
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.options = msg.data;
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
            productId: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    return this.value;
                },
                set: function(value) {//如果productId获得新的值。
                    this.$emit('input', value);// 则传递给父组件。机制学习：computed这里的值变化后，watch就会监听到
                }
            }
        }
    }
</script>

<style scoped>

</style>
