<template>
  <div>
    <div class="item">
      <!--搜索栏-->
      <el-form :model="query"  :inline="true" style="text-align: left;" class="demo-form-inline">
        <el-form-item label="产品" align="left">
          <el-select-product v-model="query.productId"></el-select-product>
        </el-form-item>
        <el-form-item label="客户" align="left">
          <el-select-customer v-model="query.customerId"></el-select-customer>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query={};getTables();">清空查询条件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格-->
    <div class="item">
      <!-- 表格插件-->
      <el-table
        :data="table.tableData"
        stripe
        border
        style="width: 100%">
        <el-table-column
          show-overflow-tooltip
          prop="product.name"
          label="产品名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="ip"
          label="ip">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="customer.username"
          label="账户名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="customer.name"
          label="姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="clickTime"
          label="访问时间">
        </el-table-column>
      </el-table>
    </div>
    <div class="text item">
      <!-- 分页插件-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          layout="prev,pager,next,total,sizes,jumper"
          :hide-on-single-page="table.hideOnSinglePage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="table.limit"
          :current-page="table.page"
          :total="table.total"
          :pager-count="11">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "LogOfCustomerLoginManage",
        components: {
            'el-select-product': () => import("@/components/el-select-product.vue"), //引入产品下拉框组件
            'el-select-customer': () => import("@/components/el-select-customer.vue") //引入客户下拉框组件
        },
        data() {
            return {
                disabled:true,//用于批量操作等按钮的可用性属性，只有当选择了复选框时才可以操作
                table:{// 记录表格数据
                    tableData: [],//表格记录
                    // 分页-传递到服务端的数值
                    limit: 20,//每页的最大记录数
                    page: 1,//当前页
                    //分页-服务端返回的数值
                    total:0,//总记录数
                    hideOnSinglePage:false,//如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性。
                },
                multipleSelection:[],//复选框选择的记录row
                query:{//查询条件
                    'productId': null,
                    'customerId':null
                },
            }
        },
        methods:{
            getTables() {//从服务端读取记录列表
                this.$axios
                    .get("/api/backstage/log/product",{
                        params: {
                            page: this.table.page,
                            limit: this.table.limit,
                            'product.id':this.query.productId,
                            'customer.id':this.query.customerId
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.table.tableData = msg.data;
                            this.table.total=msg.count;
                        }
                    });
            },
            handleCurrentChange(value) {//当分页插件的页码改变时触发，value表示前端分页点击的页码
                this.table.page = value;
                this.getTables();
            },
            handleSizeChange(value) {//当分页插件的每页显示数量改变时触发，value表示每页的分页数量
                this.table.limit = value;
                this.getTables();
            },
            search(){//执行查询条件--简单查询
                this.getTables();
            }
        },
        mounted() {
            this.getTables();// 获取表格数据
        }
    }
</script>

<style scoped>

</style>
