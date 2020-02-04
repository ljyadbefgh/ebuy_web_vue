<template>
  <div>
    <div class="item">
      <!-- 自定义搜索栏插件-->
      <ProductOrderDetailSearch
        ref="productOrderDetailSearch"
        :productOrderDetailQuery="productOrderDetailQuery"
        @tableRefresh="getTableData"
        @initQuery="initQuery"
      />
      <!-- 表格插件-->
      <el-table
        @selection-change="handleSelectionChange"
        :data="table.tableData"
        stripe
        border
        style="width: 100%">
       <!-- <el-table-column type="selection" width="45" align="center">
        </el-table-column>-->
        <el-table-column
          show-overflow-tooltip
          prop="productOrder.orderNo"
          label="订单编号">
        </el-table-column>
        <el-table-column
          width="150"
          show-overflow-tooltip
          prop="product.name"
          label="产品名称">
        </el-table-column>
        <el-table-column
          width="80"
          align="center"
          show-overflow-tooltip
          label="原价">
          <template slot-scope="scope">
            <i style="text-decoration:line-through;color:#9c9c9c;">￥{{scope.row.originalPrice}}</i><br/>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          align="center"
          show-overflow-tooltip
          label="现价">
          <template slot-scope="scope">
            <i>￥{{scope.row.price}}</i>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          show-overflow-tooltip
          prop="productNumber"
          label="数量">
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          show-overflow-tooltip
          prop="priceTotal"
          label="总价">
        </el-table-column>
        <el-table-column
          width="70"
          show-overflow-tooltip
          align="center"
          label="支付状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.productOrder.paymentStatus==0" type="danger">未付款</el-tag>
            <el-tag v-else-if="scope.row.productOrder.paymentStatus==1"  type="success">已付款</el-tag>
            <el-tag v-else type="warning">已退款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="70"
          show-overflow-tooltip
          align="center"
          prop="tag"
          label="订单状态">
          <template  slot-scope="scope">
            {{myVariable.orderTagMap[scope.row.productOrder.tag]}}
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          show-overflow-tooltip
          align="center"
          prop="productOrder.createTime"
          label="下单时间">
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
        name: "ProductOrderDetailManage",
        components: {
            ProductOrderDetailSearch: () => import("@/views/productorderdetail/ProductOrderDetailSearch.vue")//引入产品子订单查询表单
        },
        data() {
            return {
                disabled:true,//用于批量操作的按钮的可用性属性，只有当选择了复选框时才可以操作
                table:{// 记录表格数据
                    tableData: [],//表格记录
                    // 分页-传递到服务端的数值
                    limit: 20,//每页的最大记录数
                    page: 1,//当前页
                    //分页-服务端返回的数值
                    total:0,//总记录数
                    hideOnSinglePage:false,//如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性。
                },
                productOrder:null, //获取当前行,订单的详细记录。
                multipleSelection:[],//复选框选择的记录row
                productOrderDetailQuery:{} // 查询条件，这里通过方法实现属性赋值，避免在清空时因为地址改变导致部分组件的绑定值出问题
            }
        },
        methods:{
            initQuery(){//初始化查询条件
                this.$set(this.productOrderDetailQuery,'orderNo','');//订单号
                this.$set(this.productOrderDetailQuery,'productId','');//产品id
                this.$set(this.productOrderDetailQuery,'paymentStatus','');//付款状态
                this.$set(this.productOrderDetailQuery,'tag','');//订单状态
                this.$set(this.productOrderDetailQuery,'createTimeQueryOfBegin','');//下单开始时间
                this.$set(this.productOrderDetailQuery,'createTimeQueryOfEnd','');//下单结束时间
            },
            getTableData() {//从服务端读取表格列表
                this.$axios
                    .get("/api/backstage/productorderdetail",{
                        params: {
                            page: this.table.page,
                            limit: this.table.limit,
                            'productOrderQuery.orderNo':this.productOrderDetailQuery.orderNo,
                            'product.id':this.productOrderDetailQuery.productId,
                            'productOrderQuery.paymentStatus':this.productOrderDetailQuery.paymentStatus,
                            'productOrderQuery.tag':this.productOrderDetailQuery.tag,
                            'productOrderQuery.createTimeQueryOfBegin':this.productOrderDetailQuery.createTimeQueryOfBegin,
                            'productOrderQuery.createTimeQueryOfEnd':this.productOrderDetailQuery.createTimeQueryOfEnd
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.table.tableData = msg.data;
                            this.table.total=msg.count;
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleCurrentChange(value) {//当分页插件的页码改变时触发，value表示前端分页点击的页码
                this.table.page = value;
                this.getTableData();
            },
            handleSizeChange(value) {//当分页插件的每页显示数量改变时触发，value表示每页的分页数量
                this.table.limit = value;
                this.getTableData();
            },
            handleSelectionChange(value){//当选择项发生变化时会触发该事件，这里用于获取选择的记录（多选）.value可以获取所有选择了的行记录row
                this.multipleSelection=value;
                if(this.multipleSelection.length>0){//如果选择了记录
                    this.disabled=false;
                }else{//如果没有选择记录
                    this.disabled=true;
                }
            },
            checkSelection() {//判断是否选择了数据，用于批量操作前的验证
                if (this.multipleSelection.length>0) {
                    return true
                } else {
                    this.$message.error('请先选择数据')
                }
            }
        },
        mounted() {
            this.initQuery();//初始化查询数据
            this.getTableData();//初始化表格数据
        }
    }
</script>

<style scoped>

</style>
