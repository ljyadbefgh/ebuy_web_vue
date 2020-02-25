<template>
  <div>
    <el-card shadow="hover">
      <div id="myIll" :style="{width: '100%', height: '300px'}"></div>

    </el-card>
  </div>

</template>

<script>
    /**
     * 填报人数比例
     */
    import  'echarts/theme/eduardo.js'//导入蓝色主题
    export default {
        name: "MyIllChart",
        data() {
            return {
                fit: 'fill'
            }
        },
        methods:{
            drawLine(title,xAxisData,seriesData,seriesName) {//实例化产品图形
                //初始化echarts实例。不能在单个容器上初始化多个 ECharts 实例。
                let myChart = this.$echarts.init(document.getElementById('myIll'),"eduardo");
                // 绘制图表
                myChart.setOption({
                    title: {text: title},
                    tooltip: {},
                    xAxis: {//X坐标轴，这里现在放置产品名
                        boundaryGap: false,
                        data: xAxisData
                    },
                    yAxis: {//直角坐标系 grid 中的 y 轴
                        type: 'value' //
                    },
                    series: [{//系列列表。每个系列通过 type 决定自己的图表类型
                        name: seriesName,
                        type: 'line',//柱状/条形图 通过 柱形的高度/条形的宽度 来表现数据的大小，
                        label: {
                            show: true,
                            position: 'outside'
                        },
                        data: seriesData,
                        areaStyle: {},
                    }]
                });
            },
            getData(){
                this.$axios
                    .get("http://localhost:8091/api/front/chart/myIll")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.drawLine("有咳嗽、胸闷、发烧等不适症状的人数",msg.data["labels"],msg.data["values"],'人数');
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
