import React, { Component } from 'react'

import { NavBar, Icon } from 'antd-mobile'

import './citylist.scss'

export default class CityList extends Component {
    render() {
        return (
            <div className="citylist">
                我是CityList组件
                <NavBar
                  className="navbar"
                  mode="light" // 模式 light dark
                  icon={<Icon type="left" />} // 出现在最左边的图标占位符
                  onLeftClick={() => console.log('onLeftClick')} // 导航左边点击回调
                >城市选择</NavBar>
            </div>
        )
    }
}
