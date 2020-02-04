<template>
  <el-select
    clearable
    filterable
    v-model="customerId"
    remote
    :remote-method="searchCustomerOptions"
    placeholder="请输入客户名字">
    <el-option
      v-for="customer in options"
      :key="customer.id"
      :label="customer.name"
      :value="customer.id">
      <span style="float: left">{{ customer.name }}</span>
      <span style="float: right; margin-left:15px;color: #8492a6; font-size: 13px">{{ customer.tel }}</span>
    </el-option>
  </el-select>
</template>

<script>

    export default {
        name: "el-select-customer",
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
            searchCustomerOptions(query){ //获取query获取客户列表
                this.$axios
                    .get("/api/backstage/customermanage",{
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
            customerId: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    //console.log("get:"+this.value);
                    return this.value;
                },
                set: function(value) {//如果customerId获得新的值。
                    //console.log("set:"+value);
                    this.$emit('input', value);// 则传递给父组件。机制学习：computed这里的值变化后，watch就会监听到
                }
            }
        }
    }
</script>

<style scoped>

</style>
