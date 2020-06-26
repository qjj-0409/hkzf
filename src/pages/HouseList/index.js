import React, { Component } from 'react'
// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
// 导入Filter 筛选条件组件
import Filter from './components/Filter'
// 导入样式
import './index.scss'

// 导入公共函数获取定位城市
import { getCurrentCity } from '../../utils/index'
// 导入axios实例对象
import request from '../../utils/request'
// 导入react-virtualized的List组件
import {List} from 'react-virtualized';

function rowRenderer({
  key, // Unique key within array of rows
  index, // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible, // This row is visible within the List (eg it is not an overscanned row)
  style, // Style object to be applied to row (to position it)
}) {
  return (
    <div key={key} style={style}>
      <h1>房屋列表</h1>
    </div>
  );
}

export default class Houselist extends Component {
  state = {
    cityName: '', // 定位城市名
    cityId: '', // 定位城市Id
    count: 0, // 房屋数量
    list: [] // 房屋列表
  }

  // 封装函数-获取格式化的选择项，发请求获取房屋列表
  onFilter = (filters) => {
    console.log('HouseList组件接收到的格式化选择器：', filters)
    // 两个函数用到同一个参数，传参方式：1.传参数 2.全局变量 3.this.变量 = 变量
    this.filters = filters
    // 调用函数发请求
    this.searchHouseList()
  }

  // 封装函数-发请求获取房屋列表
  searchHouseList = async () => {
    const { data } = await request.get('/houses', {
      params: {
        cityId: this.state.cityId, // 城市id
        ...this.filters, // 选择项
        start: 1, // 开始项
        end: 20 // 结束项
      }
    })
    console.log('房屋列表信息：', data)
    this.setState({
      count: data.body.count,
      list: data.body.list
    })
  }

  // 生命周期函数-初次加载页面
  async componentDidMount() {
    // 获取定位城市
    const dingwei = await getCurrentCity()
    // console.log('定位城市信息', dingwei)
    this.setState({
      cityName: dingwei.label,
      cityId: dingwei.value
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
          <Filter onFilter={this.onFilter}></Filter>

          {/* 房屋列表展示 */}
          <List
            width={300}
            height={300}
            rowCount={this.state.count} // 注意：第一次打开页面没有选中的条件，所以没有数据
            rowHeight={120}
            rowRenderer={rowRenderer}
          />
      </div>
    )
  }
}
