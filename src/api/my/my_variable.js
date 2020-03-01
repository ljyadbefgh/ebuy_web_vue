/*ljy创建的用来存放公共变量*/

import pic from '@/api/my/variable/pic.js' // 导入自定义的图片地址

//const baseUrl="http://127.0.0.1:8081";// 本机访问地址
const baseUrl="http://120.76.118.101:8081"; //远程访问地址


const ueditorServerUrl=baseUrl+"/api/backstage/ueditor" //百度编辑器的服务器响应url，记住后面使用要加上jsessionid，因为它不是通过axios调用的，，不会自己跨域保存session信息

//下面的整个map集合用：orderTagMap.get(key)  获取键对应的值
// const orderTagMap=new Map([[1, '已付款'], [2, '未付款'], [3, '异常'], [4, '申请取消'], [5, '已作废']]);//订单状态（1、已付款，2、未付款，3、异常,4、申请取消，5、已作废）,1的情况下不可以作废

//下面这个用：orderTagMap[key]  获取键对应的值。因为如果是服务端返回的集合基本是下面的格式，所以同意采用下面的格式
//订单处理状态（-9异常，-4已退货，-3 申请退货，-2已取消，-1申请取消，0待付款、1.待发货，2已发货，3已收货、4已完成）
const orderTagMap={'-9':"异常",'-4':"已退货",'-3':"申请退货",'-2':"已取消",'-1':"申请取消",'0':"待付款",'1':"待发货",'2':"已发货",'3':"已收货",'4':"已完成"};

export default {
  pic,
  baseUrl,
  ueditorServerUrl,
  orderTagMap
}
