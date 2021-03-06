// 1.引入react, react-dom
import React from 'react'
import ReactDOM from 'react-dom'
// 导入antd-mobile样式文件
// import 'antd-mobile/dist/antd-mobile.css'
// 导入全局样式
import './index.css'
// 引入字体图标
import './assets/fonts/iconfont.css'

// 注意：先导入antd-mobile样式再导入组件，这样防止自己写的样式被覆盖
// 2.创建react元素（导入根组件）
import App from './App'

// 3.渲染到页面
ReactDOM.render(<App></App>, document.getElementById('root'))