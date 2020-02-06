<template>
  <div>
    <el-card shadow="hover" style="height: 120px;overflow:hidden;background-color:#64b0f2;color:#fff;">
      <!--<el-avatar  style="float:left;font-size: 60px;" type="primary" shape="square" :size="70"  :fit="fit" icon="el-icon-user-solid">
      </el-avatar>-->
      <i class="el-icon-user-solid" style="float:left;font-size: 70px;"></i>
      <div  style="float:right;margin-top: 5px;">
        <div>
          <span style="color:#fff;font-size: 16px;font-weight: bold;">管理账户数</span>
        </div>
         <div style="margin-top:10px;">
           <span style="color:#fff;font-size: 20px;">{{number}}</span>
         </div>
      </div>

    </el-card>
  </div>

</template>

<script>
    export default {
        name: "AdminCount",
        data() {
            return {
                fit: 'fill',
                number:''
            }
        },
        methods:{
            getData(){
                this.$axios
                    .get("/api/backstage/adminmanage/total")
                    .then(response => {//获取返回数据
                        let msg=response.data;
                        if (msg.code === 0) {
                            this.number=msg.data
                        }else{
                            this.number='-';
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
