import React, { Component } from 'react'

import { NavBar, Icon } from 'antd-mobile'

import './citylist.scss'
import axios from 'axios'

export default class CityList extends Component {
    // 封装函数-获取城市列表
    async getCityList () {
      const { data } = await axios.get('http://api-haoke-dev.itheima.net/area/city?level=1')
      // console.log(data.body)
      // 遍历城市列表，格式化数据
      const { cityList, cityWord} = this.formatCityList(data.body)
      // 发请求获取热门城市
      const res = await axios.get('http://api-haoke-dev.itheima.net/area/hot')
      console.log('热门城市：',res.data.body)
      // 追加热门城市到城市列表
      cityList['hot'] = res.data.body
      cityWord.unshift('hot')
      console.log('城市列表：', cityList)
      console.log('城市单词列表：', cityWord)
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

    // 生命周期-初次渲染到页面
    componentDidMount () {
      // 获取城市列表
      this.getCityList()
    }

    // 生命周期-渲染到内存
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
