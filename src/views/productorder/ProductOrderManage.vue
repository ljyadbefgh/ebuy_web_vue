<template>
  <div>
    <!--表格-->
    <div class="item">
      <div class="item">
        <!--搜索栏-->
        <el-form :model="productOrderQuery"  :inline="true" style="text-align: left;" class="demo-form-inline">
          <el-form-item >
            <el-input v-model="productOrderQuery.orderNo" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getTableData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="$refs.productOrderSearch.openDialog()">高级查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clearQuery();getTableData();">清空查询条件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格插件-->
      <el-table
        @selection-change="handleSelectionChange"
        :data="table.tableData"
        stripe
        border
        style="width: 100%">
        <!--订单子列表，嵌套表格。下面-->
        <el-table-column type="expand">
          <template slot-scope="props">
            <!--子订单列表组件-->
            <ProductOrderDetailManageByProductOrder
              ref="roductOrderDetailManage"
              :productOrderRow="props.row"
            />
          </template>
        </el-table-column>
        <!--订单子列表，嵌套表格。上面-->
        <!--订单列表-->
        <el-table-column type="selection" width="45" align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="orderNo"
          label="订单编号">
        </el-table-column>
        <el-table-column
          width="70"
          show-overflow-tooltip
          prop="customer.name"
          label="客户">
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          show-overflow-tooltip
          prop="totalPrice"
          label="总价">
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          show-overflow-tooltip
          prop="strikePrice"
          label="成交价">
        </el-table-column>
        <el-table-column
          width="70"
          show-overflow-tooltip
          align="center"
          prop="payment"
          label="付款方式">
          <template slot-scope="scope">
            <template v-if="scope.row.paymentType==1">网上支付</template>
            <template v-if="scope.row.paymentType==2">货到付款</template>
          </template>
        </el-table-column>
        <el-table-column
          width="70"
          show-overflow-tooltip
          align="center"
          prop="payment"
          label="支付状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.paymentStatus==0" type="danger">未付款</el-tag>
            <el-tag v-else-if="scope.row.paymentStatus==1"  type="success">已付款</el-tag>
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
            {{myVariable.orderTagMap[scope.row.tag]}}
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          show-overflow-tooltip
          align="center"
          prop="createTime"
          label="下单时间">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="140">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="operatorProductOrder($event,scope.row)">
              <el-button>请选择操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu>
               <!-- <el-dropdown-item  command="editSend" :disabled="scope.row.tag!=1">更改收件信息</el-dropdown-item>-->
                <el-dropdown-item   v-if="scope.row.tag==1" command="editStrikePrice">修改订单信息</el-dropdown-item>
                <el-dropdown-item  v-if="scope.row.tag==1"  command="editMerchantShipped">已发送货物</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.paymentStatus=1&&scope.row.tag==3"   command="editPayment">已收到钱款</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!--<el-button  @click="editProductOrder(scope.row)" type="primary" plain  icon="el-icon-edit">变更订单</el-button>-->
          </template>
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

    <!--订单编辑组件-->
    <ProductOrderEdit
      ref="productOrderEdit"
      :productOrder="productOrder"
    />

    <!--订单高级搜索组件-->
    <ProductOrderSearch
      ref="productOrderSearch"
      :productOrderQuery="productOrderQuery"
      @tableRefresh="getTableData"
      @clearQuery="clearQuery"/>

  </div>

</template>

<script>
    export default {
        name: "ProductOrderManage",
        components: {
            ProductOrderSearch: () => import("@/views/productorder/ProductOrderSearch.vue"),//引入产品高级查询表单
            ProductOrderDetailManageByProductOrder: () => import("@/views/productorder/ProductOrderDetailManageByProductOrder.vue"),//引入子订单列表
            ProductOrderEdit: () => import("@/views/productorder/ProductOrderEdit.vue") //引入子订单编辑表单
        },
        data() {
            return {
                disabled:true,//用于批量操作的按钮的可用性属性，只有当选择了复选框时才可以操作
                table:{// 记录表格数据
                    tableData: [],//表格记录
                    // 分页-传递到服务端的数值
                    limit: 10,//每页的最大记录数
                    page: 1,//当前页
                    //分页-服务端返回的数值
                    total:0,//总记录数
                    hideOnSinglePage:false,//如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性。
                },
                productOrder:null, //获取当前行,订单的详细记录。
                multipleSelection:[],//复选框选择的记录row
                productOrderQuery:{//查询条件
                    'orderNo': null,//订单号
                    paymentType:'', //付款方式
                    paymentStatus:'',// 支付状态
                    tag:''//订单状态
                }
            }
        },
        methods:{
            clearQuery(){// 清空查询条件。原因在于使用pro传递查询条件到子组件，子组件直接清空会显示不能修改，但是不想双向绑定，也不想使用vuex，因此在这里进行处理
                this.productOrderQuery={}
            },
            getTableData() {//从服务端读取表格列表
                this.$axios
                    .get("/api/backstage/productorder",{
                        params: {
                            page: this.table.page,
                            limit: this.table.limit,
                            orderNo:this.productOrderQuery.orderNo,
                            paymentType:this.productOrderQuery.paymentType,
                            paymentStatus:this.productOrderQuery.paymentStatus,
                            tag:this.productOrderQuery.tag
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
            },
            operatorProductOrder(command,row){// 当点击订单操作菜单时
                if(command=="editStrikePrice"){//修改订单成交价
                    this.editStrikePrice(row);
                }else if(command=="editMerchantShipped"){//修改收件人信息
                    this.editMerchantShipped(row.orderNo);
                }else if(command=="editPayment"){//修改收件人信息
                    this.editPayment(row.orderNo);
                }
            },
            editStrikePrice(row){//修改订单成交价
                this.productOrder=row;
                this.$nextTick(()=>{//必须加这个，否则值可能无法按时传递
                    this.$refs.productOrderEdit.openDialog();
                })
            },
            editMerchantShipped(orderNo){//将订单变为已发货状态
                this.$confirm(" 确定要将订单状态改为“已发货”吗？", "系统提示", {
                    confirmButtonText: "确定",//确定按钮的文本内容
                    cancelButtonText: "取消",//取消按钮的文本内容
                    type: "warning"
                }).then(() => {//选择确认按钮后执行
                    this.$axios
                        .patch("/api/backstage/productorder/"+orderNo+"/merchantShipped")
                        .then(response => {//获取返回数据
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.getTableData();// 刷新表格数据
                            }else{
                                this.$message.error(msg.msg);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }).catch(error => {//选择取消按钮后执行
                    //console.error(error);
                });
            },
            editPayment(orderNo){//修改订单状态
                this.$confirm(" 确定要将订单支付状态改为“已支付”吗？", "系统提示", {
                    confirmButtonText: "确定",//确定按钮的文本内容
                    cancelButtonText: "取消",//取消按钮的文本内容
                    type: "warning"
                }).then(() => {//选择确认按钮后执行
                    this.$axios
                        .patch("/api/backstage/productorder/"+orderNo+"/payment")
                        .then(response => {//获取返回数据
                            let msg=response.data;
                            if (msg.code === 0) {
                                this.getTableData();// 刷新表格数据
                            }else{
                                this.$message.error(msg.msg);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }).catch(error => {//选择取消按钮后执行
                    //console.error(error);
                });
            }
        },
        mounted() {
            this.getTableData();
        }
    }
</script>

<style scoped>

</style>
