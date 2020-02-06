<template>
  <div>
    <el-card shadow="hover">
      <div id="productOrderChart" :style="{width: '100%', height: '400px'}"></div>

    </el-card>
  </div>

</template>

<script>
    //import  'echarts/theme/fresh-cut.js'//导入青绿色
    /*let option = {
        title: {
            text: '各类订单销售图'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '邮件营销',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '联盟广告',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '视频广告',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: '直接访问',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: '搜索引擎',
                type: 'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {},
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    };*/
    /**
     *产品各栏目销售额比重的折现堆叠图
     */
    import  'echarts/theme/cool.js'//导入紫红色值域，蓝色字体
    export default {
        name: "ProductOrderDetailManageByProductOrder",
        data() {
            return {
                dayNumber:7,// 查询几天的栏目
                fit: 'fill'
            }
        },
        methods:{
            drawLine(title,xAxisData,seriesData,legendData) {//实例化产品图形
                //初始化echarts实例。不能在单个容器上初始化多个 ECharts 实例。
                let myChart = this.$echarts.init(document.getElementById('productOrderChart'),"cool");
                let option = {
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data:legendData
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}//可以下载的工具栏
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            //data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                            data:xAxisData
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series:seriesData
                };



                // 绘制图表
                myChart.setOption(option);
            },
            getData(){
                this.$axios
                    .get("/api/backstage/count/productTypeSalesVolumeInRecentlyEveryDay",{
                        params: {
                            dayNumber:this.dayNumber
                        }
                    })
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            console.log(msg.data);
                            let title="近"+this.dayNumber+"天各产品栏目的销量情况";
                            let xAxisData=msg.data.xaxisArray;//获取X坐标的值集合
                            //将服务端获取的值，结合图标的要求进行设置
                            let legendData=[];//定义图例要展示的数据
                            let seriesData=[];//定义值域的集合
                            msg.data.lineArrayChartOfSeriesArray.forEach((item,index) => {
                                legendData.push(item.name);//将图例名字添加进来
                                let seriesDatum={//定义值域中每一条记录的走势
                                    name:item.name,
                                    type: 'line',
                                    stack: '总量',
                                    areaStyle: {},
                                    data:item.seriesArray
                                }
                                /*if(index>=msg.data.lineArrayChartOfSeriesArray.length-2){//如果是最后一个元素
                                    let label={
                                        normal: {
                                            show: true,
                                            position: 'top'
                                        }
                                    }
                                    this.$set(seriesDatum,'label',label);//下单开始时间
                                }*/
                                seriesData.push(seriesDatum);
                            })
                            this.drawLine(title,xAxisData,seriesData,legendData);
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
