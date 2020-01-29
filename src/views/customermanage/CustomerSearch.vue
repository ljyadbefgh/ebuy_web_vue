<template>
  <el-dialog title="高级查询" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px" @opened="opened" @closed="closed">
    <el-form :model="customerQuery" ref="form" label-width="80px">
      <el-form-item label="账户名">
        <el-input v-model="customerQuery.username"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="customerQuery.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" style="text-align: left;">
        <el-select v-model="customerQuery.sex" clearable  placeholder="请选择">
          <el-option value="1" label="男"></el-option>
          <el-option value="2" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="初始密码" style="text-align: left;">
        <el-select v-model="customerQuery.changeInitialPassword" clearable  placeholder="请选择">
          <el-option value="true" label="已变更"></el-option>
          <el-option value="false" label="未变更"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传头像" style="text-align: left;">
        <el-select v-model="customerQuery.uploadPhoto" clearable  placeholder="请选择">
          <el-option value="true" label="已上传"></el-option>
          <el-option value="false" label="未上传"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关闭</el-button>
      <el-button type="primary" @click="$emit('customerTableRefresh')">查询</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "CustomerSearch",
        props:{
            customerQuery: {//获取从父组件传递过来的账户信息集合。注意，这里引用的是地址，如果修改会影响父组件。例如this.adminRows.length=0清空数组后，父组件选择的数据也将被清空。如果不想更改可以配合watch或computed来重新赋值，实现复制值而非地址来传递。
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data() {
            return {
                dialogFormVisible: false
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
            closed(){
                this.$refs["form"].resetFields();//重置表单
            }
        }
    }
</script>

<style scoped>

</style>
