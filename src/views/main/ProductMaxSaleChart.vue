<template>
  <div>
    <el-card shadow="hover">
      <div id="productMaxSaleChart" :style="{width: '100%', height: '300px'}"></div>

    </el-card>
  </div>

</template>

<script>
    /**
     * 展示最大销售额产品排行的折线图
     */
    import  'echarts/theme/blue.js'//导入蓝色主题
    export default {
        name: "ProductMaxSalesVolumeChart",
        data() {
            return {
                fit: 'fill'
            }
        },
        methods:{
            drawLine(title,productNames,productSalesVolumes) {//实例化产品图形
                //初始化echarts实例。不能在单个容器上初始化多个 ECharts 实例。
                let myChart = this.$echarts.init(document.getElementById('productMaxSaleChart'),"blue")
                // 绘制图表
                myChart.setOption({
                    title: {text: title},
                    tooltip: {},
                    xAxis: {//X坐标轴，这里现在放置产品名
                        data: productNames
                       /* axisLine: {
                            lineStyle: {
                                color: '#58afed', // X轴及其文字颜色
                            }
                        }*/

                    },
                    yAxis: {//直角坐标系 grid 中的 y 轴
                        type: 'value' //
                       /* axisLine: {
                            lineStyle: {
                                color: '#58afed', // y轴及其文字颜色
                            }
                        }*/

                    },
                    series: [{//系列列表。每个系列通过 type 决定自己的图表类型
                        name: '销售额',
                        type: 'bar',//柱状/条形图 通过 柱形的高度/条形的宽度 来表现数据的大小，
                        label: {
                            show: true,
                            position: 'outside'
                        },
                        data: productSalesVolumes
                       /* itemStyle: {
                            normal: {
                                color:'#188df0' //柱子颜色。默认为红色
                            }
                        }*/
                    }]
                });
            },
            getData(){
                this.$axios
                    .get("/api/backstage/count/maxSaleOfProduct",{
                        params: {
                            limit:5
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.drawLine("商品销售额排行榜",msg.data["productNames"],msg.data["productSales"]);
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
