<template>
  <div>
    <div class="item">
      <!--搜索栏-->
      <el-form :model="productTypeQuery"  :inline="true" style="text-align: left;" class="demo-form-inline">
        <el-form-item label="产品类别名" >
          <el-input v-model="productTypeQuery.name" placeholder="产品类别名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格工具栏-->
    <div class="item" align="left" style="margin-bottom: 5px;">
      <el-button @click="$refs.productTypeAddForm.openDialog()" type="primary">添加</el-button>
      <el-button @click="handleDelete" type="primary"  :disabled="disabled">删除</el-button>
    </div>
    <!--表格-->
    <div class="item">
      <!-- 表格插件-->
      <el-table
        @selection-change="handleSelectionChange"
        :data="table.tableData"
        stripe
        border
        style="width: 100%">
        <el-table-column type="selection" width="40" align="center">
        </el-table-column>
        <!--  <el-table-column type="index" width="60" label="序号" align="center">
          </el-table-column>-->
        <el-table-column
          width="80"
          prop="imageUrl"
          align="center"
          label="LOGO">
          <template  slot-scope="scope">
            <!--用div来限制el-image的高度，避免el-image会有部分高度超出——原因未明-->
            <div style="display: block;height:30px;">
              <el-image
                style="height:30px;"
                v-if="scope.row.imageUrl!=null&&scope.row.imageUrl!=''"
                fit="contain"
                :src="scope.row.imageUrl"
                :preview-src-list="[scope.row.imageUrl]"></el-image>
              <el-image
                v-else
                style="height:30px;"
                fit="contain"
                :src="myVariable.pic.noPic4Src"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          width="70"
          align="center"
          prop="display"
          label="前台显示">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.display==true" type="success">显示</el-tag>
            <el-tag v-else type="danger">隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          align="center"
          prop="orderNum"
          label="优先级">
        </el-table-column>
        <el-table-column
          width="70"
          align="center"
          prop="linkUrl"
          label="外部链接">
          <template slot-scope="scope">
            <template v-if="scope.row.linkUrl!=null&&scope.row.linkUrl!=''">
              <el-popover  placement="top" effect="light" trigger="hover">
                <el-link type="primary" :href="scope.row.linkUrl" target="_blank">{{scope.row.linkUrl}}</el-link>
                <el-tag slot="reference"  type="danger">有</el-tag>
              </el-popover>
            </template>
            <el-tag v-else>无</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          tooltip-effect="light"
          prop="summary"
          label="简介">
        </el-table-column>
        <el-table-column
          width="60"
          align="center"
          show-overflow-tooltip
          prop="productNumber"
          label="产品数">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="310">
          <template slot-scope="scope">
            <el-button  @click="$refs.productTypeEditForm.openDialog(scope.row.id)" type="primary" plain  icon="el-icon-edit">编辑</el-button>
            <el-button @click="$refs.productTypeLogoUpload.openDialog(scope.row.id)" type="primary" plain  icon="el-icon-user">上传LOGO</el-button>
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

    <!-- 产品栏目添加表单 -->
    <ProductTypeAdd
      ref="productTypeAddForm"
      @tableRefresh="getTableData"
    />

    <!-- 产品栏目编辑表单 -->
    <ProductTypeEdit
      ref="productTypeEditForm"
      @tableRefresh="getTableData"
    />

  <!-- 产品栏目LOGO上传组件 -->
  <ProductTypeLogoUpload
    ref="productTypeLogoUpload"
    @tableRefresh="getTableData"
  />

  </div>
</template>
<script>
    export default {
        name: "ProductTypeManage",
        components: {
            ProductTypeAdd: () => import("@/views/producttype/ProductTypeAdd.vue"),//引入产品类别添加表单
            ProductTypeEdit: () => import("@/views/producttype/ProductTypeEdit.vue"),//引入产品类别编辑表单
            ProductTypeLogoUpload: () => import("@/views/producttype/ProductTypeLogoUpload.vue")//引入产品类别LOGO上传组件
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
                productTypeQuery:{//查询条件
                    'name': null,//产品名
                },
            }
        },
        methods:{
            getTableData() {//从服务端读取表格列表
                this.$axios
                    .get("/api/backstage/producttype",{
                        params: {
                            page: this.table.page,
                            limit: this.table.limit,
                            name:this.productTypeQuery.name
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.table.tableData = msg.data;
                            this.table.tableData.forEach(function(row) {
                                if(row.imageUrl!=null&&row.imageUrl!=''){
                                    row.imageUrl=row.imageUrl+"?"+Math.random();//重要：被坑了很久实验多次才成功，并且要这里设置（不能在图片里设置，否则会不断刷新影响效果）。重要：被坑了很久实验多次才成功，并且要这里设置。设置图片地址不缓存，因为如果头像有上传，地址都是一样的（服务端决定）。因此如果不加入，浏览器会因为图片地址不变化设置缓存，导致新上传的图片无法在浏览器显示
                                }
                            });
                            this.table.total=msg.count;
                        }
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
            handleDelete(){//批量删除产品栏目
                if(this.checkSelection()){
                    let count=this.multipleSelection.length;
                    this.$confirm(" 确定要批量删除这"+count+"个产品类别信息吗？", "系统提示", {
                        confirmButtonText: "确定",//确定按钮的文本内容
                        cancelButtonText: "取消",//取消按钮的文本内容
                        type: "warning"
                    }).then(() => {//选择确认按钮后执行
                        var ids = [];//定义要批量删除的主键
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            ids.push(this.multipleSelection[i].id);
                        }
                        this.$axios
                            .delete("/api/backstage/producttype/"+ids.toString())
                            .then(response => {//获取返回数据
                                let msg=response.data;
                                if (msg.code === 0) {
                                    this.getTableData();// 刷新表格数据
                                }
                            });
                    }).catch(error => {//选择取消按钮后执行
                        //console.error(error);
                    });
                }
            },
            edit(id){// 编辑账户
                this.$refs.customerEditForm.openDialog(id);
            },
            uploadPhoto(id){// 头像上传
                this.$refs.customerPhotoUpload.openDialog(id);
            }
        },
        mounted() {
            this.getTableData();// 获取表格数据
        }
    }
</script>

<style scoped>

</style>
