import React, { Component } from 'react'

import { NavBar, Icon } from 'antd-mobile'

import './citylist.scss'

// 导入axios插件
import axios from 'axios'

// react-virtualized的基本使用
// 1.下载安装react-virtualized插件
// 2.导入react-virtualized中的List组件
import {List} from 'react-virtualized'

// 导入公共函数
import { getCurrentCity } from '../../utils/index'

// 3.声明list列表数据，我们使用cityWord列表
// const list = [
//   'Brian Vaughn',
//   // And so on...
// ];

export default class CityList extends Component {
    state = {
      cityList: {}, // 城市列表
      cityWord: [] // 城市单词列表
    }
    // 封装函数-获取城市列表
    async getCityList () {
      const { data } = await axios.get('http://api-haoke-dev.itheima.net/area/city?level=1')
      // console.log(data.body)
      // 遍历城市列表，格式化数据
      const { cityList, cityWord} = this.formatCityList(data.body)

      // 发请求获取热门城市
      const hot = await axios.get('http://api-haoke-dev.itheima.net/area/hot')
      console.log('热门城市：',hot.data.body)
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

      console.log('城市列表：', cityList)
      console.log('城市单词列表：', cityWord)
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
    //   let citys = this.state.cityList[word]
    //   console.log(word,citys)
      return (
        // 外层大盒子的key和style必填
        <div className="city" key={key} style={style}>
          <div className="title">{this.formatWord(word)}</div>
          <div className="name">北京</div>
        </div>
      )
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

    // 生命周期-初次渲染到页面
    componentDidMount () {
      // 获取城市列表
      this.getCityList()
    }

    // 生命周期-渲染到内存
    render() {
      return (
        <div className="citylist">
          <NavBar
            className="navbar"
            mode="light" // 模式 light dark
            icon={<Icon type="left" />} // 出现在最左边的图标占位符
            onLeftClick={() => {
              // 返回上一页
              this.props.history.go(-1)
            }} // 导航左边点击回调
          >城市选择</NavBar>

          {/* 4.使用List组件渲染列表数据 */}
          <List
            width={300} // 列表宽
            height={300} // 列表高
            rowCount={this.state.cityWord.length} // 总条数/行数
            rowHeight={120} // 每行高度
            rowRenderer={this.rowRenderer} // 每行渲染的html内容
          />
        </div>
      )
    }
}
