import React, { Component } from 'react'
// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
// 导入Filter 筛选条件组件
import Filter from './components/Filter'
// 导入样式
import './index.scss'

// 导入公共函数获取定位城市
import { getCurrentCity } from '../../utils/index'

export default class Houselist extends Component {
  state = {
    cityName: ''
  }
  // 生命周期函数-初次加载页面
  async componentDidMount() {
    // 获取定位城市
    const dingwei = await getCurrentCity()
    this.setState({
      cityName: dingwei.label
    })
  }
  render() {
    return (
      <div className="houselist">
          {/* 搜索导航栏组件 */}
          <div className="header">
            <i className="iconfont icon-back"></i>
            <SearchHeader cityname={this.state.cityName}></SearchHeader>
          </div>
          

          {/* Filter 筛选条件组件 */}
          <Filter></Filter>
      </div>
    )
  }
}
