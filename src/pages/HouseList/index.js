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
import {List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import styles from './houselist.module.scss'

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
  searchHouseList = async (startIndex = 1, stopIndex = 20) => {
    console.log('startIndex和stopIndex', startIndex, stopIndex)
    const { data } = await request.get('/houses', {
      params: {
        cityId: this.state.cityId, // 城市id
        ...this.filters, // 选择项
        start: startIndex, // 开始项
        end: stopIndex // 结束项
      }
    })
    let newList = [...this.state.list, ...data.body.list]
    console.log('房屋列表信息：', newList)
    this.setState({
      count: data.body.count,
      list: newList
    })
  }

  // 封装函数-格式化tag样式
  formatTag = (i) => {
    switch (i) {
      case 0:
        return styles.tag1
      case 1:
        return styles.tag2
      case 2:
        return styles.tag3
      default:
        break;
    }
  }

  // 封装函数-渲染每行数据
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const house = this.state.list[index]
    if (!house) {
      return <div
        key={key}
        style={style}
        className={styles.loading}
      >加载中...</div>
    }
    return (
      <div
        className={styles.house}
        key={key}
        style={style}
      >
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`http://api-haoke-web.itheima.net${house.houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{house.title}</h3>
          <div className={styles.desc}>{house.desc}</div>
          <div>
            {
              house.tags.map((tag, i) => {
                return (
                  <span
                    className={[styles.tag, this.formatTag(i)].join(' ')}
                    key={i}
                >{tag}</span>
                )
              })
            }
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{house.price}</span>元/月
          </div>
        </div>
      </div>
    )
  }

  // 封装函数-当前数据是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  }

  // 封装函数-加载更多
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise((resolve, reject) => {
      // 发送请求，获取更多数据
      this.searchHouseList(startIndex, stopIndex)
      // 获取数据成功后，resolve
      resolve()
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
    // 页面一打开发送请求获取房源列表
    this.filters = {} // 没有条件，加载所有
    this.searchHouseList()
  }
  render() {
    return (
      <div className="houselist">
        {/* 搜索导航栏组件 */}
        <div className="header">
          <i
            className="iconfont icon-back"
            onClick={() => {
              this.props.history.goBack()
            }}
          ></i>
          <SearchHeader cityname={this.state.cityName}></SearchHeader>
        </div>
        
        {/* Filter 筛选条件组件 */}
        <Filter onFilter={this.onFilter}></Filter>

        {/* 房屋列表展示 */}       
        {/* 无限滚动加载更多 */}
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded} // 当前数据是否加载完成
          loadMoreRows={this.loadMoreRows} // 加载更多
          rowCount={this.state.count} // 总行数
        >
          {({ onRowsRendered, registerChild }) => (
            // 让整个页面一起滚动
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                // 将屏幕剩余宽高设置给List组件
                <AutoSizer>
                {({ width }) => (
                  <List
                    // InfiniteLoader要求
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}

                    // WindowScroller要求
                    autoHeight // 自动适应窗口高度
                    isScrolling={isScrolling} // 判断当前包裹的组件是否滚动
                    onScroll={onChildScroll} // 监听页面滚动让List一起滚
                    scrollTop={scrollTop} // 控制让list滚多少
    
                    width={width}
                    height={height}
                    rowCount={this.state.count} // 注意：第一次打开页面没有选中的条件，所以没有数据
                    rowHeight={120}
                    rowRenderer={this.rowRenderer}
                  />
                )}
              </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
        
      </div>
    )
  }
}
