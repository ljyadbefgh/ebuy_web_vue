<template>
  <div>
    <el-date-picker
      v-model="beginTime"
      :picker-options="beginPickerOption"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    -
    <el-date-picker
      v-model="endTime"
      :picker-options="endPickerOption"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </div>

</template>

<script>
    /**
     * 自定义的日期插件，用于两个日期。
     * 说明：
     * 一、用法快捷说明
     * 标签调用
     <el-date-picker-between
       :begin="productOrderQuery.createTimeQueryOfBegin"
       :end="productOrderQuery.createTimeQueryOfEnd"
       @begin-Change="createTimeQueryBeginChange"
       @end-Change="createTimeQueryEndChange"
     />
     *对应函数
     createTimeQueryBeginChange(value){//value是自定义组件的开始日期当前的值
                //this.productOrderQuery.createTimeQueryOfBegin=value;
                 this.$set(this.productOrderQuery,'createTimeQueryOfBegin',value);//如果是查询条件会清空，建议采用这种方法赋值更稳妥
            },
     createTimeQueryEndChange(value){//value是自定义组件的截止日期当前的值
                //this.productOrderQuery.createTimeQueryOfEnd=value;
                this.$set(this.productOrderQuery,'createTimeQueryOfEnd',value);//如果是查询条件会清空，建议采用这种方法赋值更稳妥
            }
     *1.属性说明：
     * （1）begin
     * 开始日期的值
     * （2）end
     * 截止日期的值
     * 2.事件说明
     * （1）begin-Change(value)
     * 当开始日期的当前值发生时触发，value参数是开始日期控件当前的值
     * （2）end-Change(value)
     * 当截止日期的当前值发生时触发，value参数是截止日期控件当前的值
     */
    export default {
        name: "el-date-picker-between",
        props: {
            begin: {
                type: String,
                default() {
                    return '';
                }
            },
            end: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        data(){
            return{
                beginPickerOption: {//日期插件-开始日期的设置
                    disabledDate: time => {
                        if (this.endTime) {
                            // 让开始日期比结束日期少一天，86400000L=1天=24小时*60分钟*60秒*1000毫秒。
                            return time.getTime() > new Date(this.endTime).getTime()-86400000;
                        }
                    }
                },
                endPickerOption: {//日期插件-截止日期的设置
                    disabledDate: time => {
                        if (this.beginTime) {
                            // 让结束日期比开始日期多一天，86400000L=1天=24小时*60分钟*60秒*1000毫秒。
                            return time.getTime() < new Date(this.beginTime).getTime()+86400000;
                        }
                    }
                }
            }
        },
        computed: {
            beginTime: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    return this.begin;
                },
                set: function(value) {//如果beginTime获得新的值。
                    this.$emit('begin-change', value);//则开始时间当前的值传递给父组件
                }
            },
            endTime: {//通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
                get: function() { //通过这里获取父组件传递过来的值
                    return this.end;
                },
                set: function(value) {//如果endTime获得新的值。
                    this.$emit('end-change', value);//则截止时间当前的值传递给父组件
                }
            }
        }
    }
</script>

<style scoped>

</style>
