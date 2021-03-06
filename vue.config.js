const path = require('path')
const resolve = (dir) => path.join(__dirname, dir) // 路径

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const IS_DEV = ['development'].includes(process.env.NODE_ENV)
module.exports = {

  devServer: {
    open: true,

    // host: '127.0.0.1',

    port: 3700,

    https: false,

    hotOnly: false,

    proxy: null,

    before: (app) => { }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 16,
            // rootValue: 100, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /(node_module)/,  //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false,  //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 0 //设置要替换的最小像素值(3px会被转rem)。 默认 0
          }),
        ]
      }
    }
  },
  chainWebpack: (config) => {
    // config
    //     // https://webpack.js.org/configuration/devtool/#development
    //     .when(!IS_PROD, config => config.devtool('cheap-source-map'))

    // 配置相关loader，支持修改，添加和替换相关的loader
    config.resolve.alias.set('@', resolve('src'))


    config.module
    .rule('vue')
    .test(/\.vue$/)
    .exclude.add(resolve('node_modules'))
    .end()
    .use('unit-convert-loader')
    .loader('unit-convert-loader')
    .options({
      UIWidth: 1920,
      targetUnit: 'rem',
      // minPixelValue: 1, //可选，默认1。您设置的最小值，所有小于它的值都不会被转换。
      // unitPercesion: 3,//可选，默认3。转换后保留的小数位数。
      rem:16,//可选，默认null。html节点的字体大小，targetUnit为rem.
    })
    .end()
  },
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1,

  // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // 第三方插件配置
  pluginOptions: {}
}
