<template>
  <!--style="background-color: #f0f2f5;"-->
  <div class="index">
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="14">
       <RePortPersonProportion/>
      </el-col>
      <el-col :span="10">
        <ArriveHuBeiChart/>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="14">
        <MyIllChart/>
      </el-col>
      <el-col :span="10">
        <ArriveWuHanChart/>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="14">
        <WorkStudentChart/>
      </el-col>
      <el-col :span="10">
        <TouchPersonChart/>
      </el-col>
    </el-row>


    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <FromHuBeiChart/>
      </el-col>
      <el-col :span="8">
        <FromWuHanChart/>
      </el-col>
      <el-col :span="8">
        <StayHuBeiChart/>
      </el-col>
    </el-row>


  </div>




</template>

<script>
    export default {
        name: 'chart',
        components: {
            RePortPersonProportion: () => import("@/views/chart/RePortPersonProportionChart.vue"), //引入填报类型的统计组件
            FromWuHanChart: () => import("@/views/chart/FromWuHanChart.vue"), //引入来自武汉的统计组件
            FromHuBeiChart: () => import("@/views/chart/FromHuBeiChart.vue"), //引入来自湖北的统计组件
            ArriveWuHanChart: () => import("@/views/chart/ArriveWuHanChart.vue"), //引入去过武汉的统计组件
            ArriveHuBeiChart: () => import("@/views/chart/ArriveHuBeiChart.vue"), //引入去过湖北的统计组件
            StayHuBeiChart: () => import("@/views/chart/StayHuBeiChart.vue"), //引入去过湖北的统计组件
            TouchPersonChart: () => import("@/views/chart/TouchPersonChart.vue"), //引入去过湖北的统计组件
            WorkStudentChart: () => import("@/views/chart/WorkStudentChart.vue"), //引入去过湖北的统计组件
            MyIllChart: () => import("@/views/chart/MyIllChart.vue") //引入有症状的人数的统计组件
        },
        data() {
            return {
                admin:{}
            }
        },
        methods:{

        },
        mounted() {

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
