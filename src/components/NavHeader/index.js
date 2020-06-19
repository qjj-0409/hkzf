import React, { Component } from 'react'
// 导入antd-mobile
import { NavBar, Icon } from 'antd-mobile'

export default class NavHeader extends Component {
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
        >地图导航</NavBar>
      </div>
    )
  }
}
