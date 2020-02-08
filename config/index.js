'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    //assetsPublicPath: './',
    assetsPublicPath: '/',
    proxyTable: { //只在生产模式下有效
      /*'/api': {
        //target: process.env.NODE_ENV === 'development'?'http://开发环境':'http://非开发环境',
        //target: 'http://120.76.118.101:8081/', //远程访问的服务器域名
        target: 'http://localhost:8081/', //远程访问的服务器域名
        secure: false,              // 如果是https接口，需要配置这个参数
        changeOrigin: true, //允许跨域,这个参数是用来回避跨站问题的，配置完之后发请求时会自动修改http header里面的host
        pathRewrite: {//重写路径，其实这里就是和上面的target拼接起来
          '^/api': '/api'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      }*/
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    //changeOrigin: true,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    //assetsPublicPath: '/',//注意：生产环境下使用
    assetsPublicPath: './',//注意：打包成产品时使用

    /**
     * Source Maps
     */

    productionSourceMap: false,//ljy:将productionSourceMap 的值设置为false. 再次打包就可以看到项目文件中已经没有map文件，文件减少
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
