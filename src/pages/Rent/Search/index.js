import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import styles from './index.module.css'

import request from '../../../utils/request'
import { getCurrentCity } from '../../../utils/index'

export default class Search extends Component {
  // 初始化-仅执行一次
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  // 封装函数-根据关键字获取小区列表
  getSearchList = async (val) => {
    // 将输入的value值赋值回去
    this.setState({
      searchTxt: val
    })
    // 判断当前输入框是否为空，为空的话清空列表
    if (!val) {
      this.setState({
        tipsList: []
      })
      return
    }
    // 防抖处理-减少发送请求的次数
    clearTimeout(this.timeId)
    this.timeId = setTimeout(async () => {
      const dingwei = await getCurrentCity()
      // console.log('城市id', dingwei)
      // 发请求获取小区列表
      const { data } = await request.get('/area/community', {
        params: {
          name: val, // 关键词
          id: dingwei.value // 当前定位城市id
        }
      })
      console.log('小区列表', data)
      this.setState({
        tipsList: data.body // 小区数组
      })
    }, 500)
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.getSearchList}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
