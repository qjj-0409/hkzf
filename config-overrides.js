// 修改默认配置
// babel-plugin-import 是一个用于按需加载组件代码和样式的 babel 插件（原理）
const { override, fixBabelImports } = require('customize-cra')
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css'
  })
)
