<template>
  <div>
    <el-card shadow="hover">
      <div id="productTypeSaleChart" :style="{width: '100%', height: '300px'}"></div>

    </el-card>
  </div>

</template>

<script>
  /**
   *产品各栏目销售额比重的饼状图
   */
    import  'echarts/theme/fresh-cut.js'//导入青绿色
    export default {
        name: "ProductTypeSaleChart",
        data() {
            return {
                fit: 'fill'
            }
        },
        methods:{
            /**
             *
             * @param names 要展示在图片的图例，即产品栏目的名称集合
             * @param data 要展示的数据。由name和value的数组组成
             */
            drawLine(title,names,data) {//实例化产品图形
                //初始化echarts实例。不能在单个容器上初始化多个 ECharts 实例。
                let myChart = this.$echarts.init(document.getElementById('productTypeSaleChart'),"fresh-cut");
                let option = {
                    title: {
                        text: title,
                        subtext: '即时数据',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: names
                    },
                    series: [
                        {
                            name: '销售额',
                            type: 'pie',//表示饼图
                            radius: '55%',//图形站整个表格比例的大小
                            center: ['60%', '60%'],//图形在整个表格偏移量。第一个数字是距离左边的水平偏移比例；第二个数字是距离顶部的垂直偏移比例
                            data: data,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                // 绘制图表
                myChart.setOption(option);
            },
            getData(){
                this.$axios
                    .get("/api/backstage/count/maxSaleOfProductType",{
                        params: {
                            limit:10
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            let names=[];//创建名字数组
                            msg.data.forEach(item => {
                                names.push(item.name);
                            })
                            this.drawLine("各产品栏目销售额比重",names,msg.data);
                        }
                    });
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
