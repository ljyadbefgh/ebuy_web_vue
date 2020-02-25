<template>
  <div>
    <el-card shadow="hover">
      <div id="rePortPersonProportion" :style="{width: '100%', height: '300px'}"></div>

    </el-card>
  </div>

</template>

<script>
    /**
     * 填报人数比例
     */
    import  'echarts/theme/blue.js'//导入蓝色主题
    export default {
        name: "RePortPersonProportion",
        data() {
            return {
                fit: 'fill'
            }
        },
        methods:{
            drawLine(title,productNames,productSalesVolumes,seriesName) {//实例化产品图形
                //初始化echarts实例。不能在单个容器上初始化多个 ECharts 实例。
                let myChart = this.$echarts.init(document.getElementById('rePortPersonProportion'),"blue");
                // 绘制图表
                myChart.setOption({
                    title: {text: title},
                    tooltip: {},
                    xAxis: {//X坐标轴，这里现在放置产品名
                        data: productNames
                    },
                    yAxis: {//直角坐标系 grid 中的 y 轴
                        type: 'value' //
                    },
                    series: [{//系列列表。每个系列通过 type 决定自己的图表类型
                        name: seriesName,
                        type: 'bar',//柱状/条形图 通过 柱形的高度/条形的宽度 来表现数据的大小，
                        label: {
                            show: true,
                            position: 'outside'
                        },
                        data: productSalesVolumes
                    }]
                });
            },
            getData(){
                this.$axios
                    .get("http://localhost:8091/api/front/chart/rePortPersonProportion")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.drawLine("填报人数类型(今天)",msg.data["labels"],msg.data["values"],'人数');
                        }else{
                            this.$message.error(msg.msg);
                        }
                    })
                    .catch(error => {
                        console.log(error);
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
