import React, { Component } from 'react'
// 导入antd-mobile
import { NavBar, Icon } from 'antd-mobile'

/**
 * 完善封装
 * 1.封装的组件的props对象没有history、location、match三个对象
 *   解决办法：使用withRouter组件
 * 2.验证参数类型
 *   1)下载prop-types
 *   2)组件名.propTypes = { 参数名: PropTypes.数据类型}
 * 3.设置默认值
 *   组件名.defaultProps = { 参数名: 默认值 }
 */
// 导入withRouter组件
// 作用：把不是通过路由切换过来的组件中，将react-router 的 history、location、match 三个对象传入props对象上
import { withRouter } from 'react-router-dom'

// 导入prop-types
import PropTypes from 'prop-types'

class NavHeader extends Component {
  render() {
    return (
      <div>
        <NavBar
          className="navbar"
          mode="light" // 模式 light dark
          icon={<Icon type="left" />} // 出现在最左边的图标占位符
          onLeftClick={() => {
            // 返回上一页
            this.props.history.go(-1)
          }} // 导航左边点击回调
        >{this.props.children}</NavBar>
      </div>
    )
  }
}

// 验证参数类型
NavHeader.propTypes = {
  children: PropTypes.string
}

// 设置默认值
NavHeader.defaultProps = {
    children: '默认导航栏'
}

// withRouter()就是一个高阶组件函数
export default withRouter(NavHeader)
