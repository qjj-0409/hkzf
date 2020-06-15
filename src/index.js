// 1.引入react, react-dom
import React from 'react'
import ReactDOM from 'react-dom'
// 2.创建react元素（导入根组件）
import App from './App'

// 导入全局样式
import './index.css'
// 导入antd-mobile样式文件
import 'antd-mobile/dist/antd-mobile.css'
// 引入字体图标
import './assets/fonts/iconfont.css'

// 3.渲染到页面
ReactDOM.render(<App></App>, document.getElementById('root'))