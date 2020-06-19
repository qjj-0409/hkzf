import React, { Component } from 'react'

import { NavBar, Icon, Toast } from 'antd-mobile'

import './citylist.scss'

// 导入axios插件
import axios from 'axios'

// react-virtualized的基本使用
// 1.下载安装react-virtualized插件
// 2.导入react-virtualized中的List组件
// AutoSizer的作用：计算屏幕剩余宽高，并设置给被包裹的List组件
import {AutoSizer, List} from 'react-virtualized'

// 导入公共函数
import { getCurrentCity } from '../../utils/index'

// 3.声明list列表数据，我们使用cityWord列表
// const list = [
//   'Brian Vaughn',
//   // And so on...
// ];

export default class CityList extends Component {
  // react中ref的使用
  // 1.调用React.createRef()方法创建ref对象
  listRef = React.createRef()
  // 2.将创建好的ref对象绑定给需要的标签或组件
  // 3.通过ref对象获取dom对象或组件 ref对象.current

  state = {
    cityList: {}, // 城市列表
    cityWord: [], // 城市单词列表
    activeIndex: 0 // 激活的索引
  }
  // 封装函数-获取城市列表
  async getCityList () {
    const { data } = await axios.get('http://api-haoke-dev.itheima.net/area/city?level=1')
    // console.log(data.body)
    // 遍历城市列表，格式化数据
    const { cityList, cityWord} = this.formatCityList(data.body)

    // 发请求获取热门城市
    const hot = await axios.get('http://api-haoke-dev.itheima.net/area/hot')
    // console.log('热门城市：',hot.data.body)
    // 追加热门城市到城市列表
    cityList['hot'] = hot.data.body
    // 在右侧单词列表插入热门城市关键词
    cityWord.unshift('hot')

    // 获取当前定位城市信息
    let currentCity = await getCurrentCity()
    // 百度地图根据ip获取定位城市的操作是异步的，所以尚未获取到定位城市就返回打印了下面的代码，因此是undefined
    // console.log('获取到的定位城市：',currentCity) // undefined
    // 将定位城市追加到城市列表
    cityList['#'] = [currentCity]
    // 在右侧单词列表插入定位城市关键词
    cityWord.unshift('#')

    // console.log('城市列表：', cityList)
    // console.log('城市单词列表：', cityWord)
    this.setState({
      cityList: cityList,
      cityWord: cityWord
    })
  }

  // 封装函数-格式化城市列表
  formatCityList (list) {
    // 遍历城市列表，格式化数据
    let cityList = {}
    list.forEach((item) => {
      // 截取每一项short属性值的第一个字符
      let key = item.short.charAt(0)
      // 如果字符属性在对象中不存在，将当前这个城市封装为数组赋值给城市列表
      if (cityList[key] === undefined) {
        cityList[key] = [item]
      } else {
        // 如果字符属性在对象中存在，将当前这个城市追加到字符属性值中
        cityList[key].push(item)
      }
    })
    // 右侧单词列表
    let cityWord = Object.keys(cityList).sort()
    return {
      cityList,
      cityWord
    }
  }

  // 5.封装rowRenderer函数，渲染每条数据的div样式
  rowRenderer = ({
    key, // 数组中行的唯一键
    index, // 每一行的索引
    isScrolling, // 当前数据是否正在滚动，true表示正在滚动，false表示没有滚动
    isVisible, // 当前行是否可见，看得见true，看不见false
    style, // 将应用于行(定位该行)的样式对象，必须写
  }) => {
    let word = this.state.cityWord[index]
    let citys = this.state.cityList[word]
    return (
      // 外层大盒子的key和style必填
      <div className="city" key={key} style={style}>
        <div className="title">{this.formatWord(word)}</div>
        {/* 循环渲染每个单词对应的城市列表 */}
        {
          citys.map(item => {
            return (
              <div
                className="name"
                key={item.value}
                onClick={() => {
                  this.changeCurrentCity(item)
                }}
              >{item.label}</div>
            )
          })
        }
      </div>
    )
  }

  // 封装函数-获取每行数据的高度
  // ({ index: number }): number
  getRowHeight = ({index}) => {
    let word = this.state.cityWord[index]
    let citys = this.state.cityList[word]
    return 36 + citys.length * 50
  }

  // 封装函数-格式化单词
  formatWord (word) {
    switch (word) {
      case '#':
        return '当前定位'
      case 'hot':
        return '热门城市'
      default:
        return word.toUpperCase()
    }
  }

  // 封装函数-循环渲染右侧单词列表
  renderWordList = () => {
    return this.state.cityWord.map((item,index) => {
      return <li
        key={index}
        className={index === this.state.activeIndex ? 'active' : ''}
        onClick={() => {
          // 让list组件滚动到指定索引的城市位置
          this.listRef.current.scrollToRow(index)
        }}
      >{item === 'hot' ? '热' : item.toUpperCase()}</li>
    })
  }

  // 封装函数-用来在渲染列表时触发
  // ({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void
  // startIndex：当前可视区开始行的索引
  // stopIndex：当前可视区末尾行的索引
  onRowsRendered = ({overscanStartIndex, overscanStopIndex, startIndex, stopIndex}) => {
    // 优化：索引不一样再修改
    if (startIndex !== this.state.activeIndex) {
      // 当滚动到某个单词城市时，让当前单词城市对应的右侧单词高亮
      this.setState({
        activeIndex: startIndex
      })
      // console.log('开始行索引：',startIndex)
      // 小问题：若一直在一个索引处来回滚动，修改多次激活索引是没必要的
    }
    
  }

  // 封装函数-点击切换当前城市租房信息
  changeCurrentCity = (city) => {
    // 只有北上广深有房源信息
    let citys = ['北京', '上海', '广州', '深圳']
    // 判断当前点击的城市再数组中是否存在
    if (citys.indexOf(city.label) !== -1) {
      // 如果是北上广深，则切换城市
      // 修改本地存储中的数据
      localStorage.setItem('my-city', JSON.stringify(city))
      // 跳转到首页
      this.props.history.push('/home/index')
    } else {
      // 否则，提示暂无房源
      Toast.info('暂无房源', 1);
    }
  }

  // 生命周期-初次渲染到页面
  componentDidMount () {
    // 获取城市列表
    this.getCityList()
  }

  // 生命周期-渲染到内存
  render() {
    return (
      <div className="citylist">
        {/* 顶部导航栏 */}
        <NavBar
          className="navbar"
          mode="light" // 模式 light dark
          icon={<Icon type="left" />} // 出现在最左边的图标占位符
          onLeftClick={() => {
            // 返回上一页
            this.props.history.go(-1)
          }} // 导航左边点击回调
        >城市选择</NavBar>

        {/* 左侧城市列表 */}
        <AutoSizer>
          {({height, width}) => (
            // 4.使用List组件渲染列表数据
            <List
              width={width} // 列表宽
              height={height} // 列表高
              rowCount={this.state.cityWord.length} // 总条数/行数
              rowHeight={this.getRowHeight} // 每行高度
              rowRenderer={this.rowRenderer} // 每行渲染的html内容
              onRowsRendered={this.onRowsRendered} // 当List数据滚动渲染的时候执行函数
              ref={this.listRef}
              scrollToAlignment="start" // 控制滚动行的位置，默认是auto；start：总是将行对齐列表可视区的顶部
            />
          )}
        </AutoSizer>
        
        {/* 右侧单词列表 */}
        <ul className="city-index">
          {/* 调用函数-渲染单词列表 */}
          { this.renderWordList() }
        </ul>

      </div>
    )
  }
}
