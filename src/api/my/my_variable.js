/*ljy创建的用来存放公共变量*/

import pic from '@/api/my/variable/pic.js' // 导入自定义的图片地址

const ueditorServerUrl="http://127.0.0.1:8081/api/backstage/ueditor" //百度编辑器的服务器响应url，记住后面使用要加上jsessionid，因为它不是通过axios调用的，，不会自己跨域保存session信息

export default {
  pic,
  ueditorServerUrl
}
