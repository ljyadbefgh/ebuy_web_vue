<template>
  <div>
    <el-table
      :data="productOrderRow.productOrderDetails"
      stripe
      border
      style="width: 100%">
      <el-table-column
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
        label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <template v-if="productOrderRow.tag==0">
            <el-button  @click="editProductOrderDetail(scope.row)" type="primary" plain>修改订单</el-button>
          </template>
          <template v-else>
            <el-button disabled  @click="editProductOrderDetail(scope.row)"  plain>修改订单</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="20">
      <el-col :span="4"><div class="grid-content bg-purple">收货人：{{productOrderRow.sendName}}</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">收货人电话：{{productOrderRow.sendTel}}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">收货人邮编：{{productOrderRow.sendZip}}</div></el-col>
      <el-col :span="10"><div class="grid-content bg-purple">收货人地址：{{productOrderRow.sendAddress}}</div></el-col>
    </el-row>

    <!--子订单编辑组件-->
    <ProductOrderDetailEdit
      ref="productOrderDetailEdit"
      :productOrderDetail="productOrderDetail"
      @freshProductOrderTotalPrice="freshProductOrderTotalPrice"
    ></ProductOrderDetailEdit>
  </div>

</template>

<script>
    //作为订单下的子订单采用
    export default {
        name: "ProductOrderDetailManageByProductOrder",
        components: {
            ProductOrderDetailEdit: () => import("@/views/productorder/ProductOrderDetailEdit.vue") //引入子订单编辑表单
        },
        props:{
            productOrderRow: {//获取从父组件传递过来的某订单记录
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data() {
            return {
                productOrderDetail:null //获取当前行,子订单的详细记录。
            }
        },
        methods:{
            editProductOrderDetail(row){// 修改指定的订单，这里将整条记录传过去，是为了方便不刷新表格前提下动态修改记录
                this.productOrderDetail=row;
                this.$nextTick(()=>{//必须加这个，否则值可能无法按时传递造成错误
                    this.$refs.productOrderDetailEdit.openDialog();
                })
            },
            freshProductOrderTotalPrice(){//提供给价格修改时的子组件调用，用于重新计算订单总价（通过计算所有子订单），在不刷新表格前提下动态修改记录
                let totalPrice=0;
                this.productOrderRow.productOrderDetails.forEach(productOrderDetail=>{//遍历子订单
                    totalPrice+=productOrderDetail.priceTotal;
                });
                this.productOrderRow.totalPrice=totalPrice;//更新总价
            }
        }
    }
</script>

<style scoped>

</style>
