import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

// 控制四个标题的高亮状态
let titleStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

export default class Filter extends Component {
  state = {
    titleStatus: titleStatus
  }
  // 封装函数-点击修改标题高亮状态
  onTitleClick = (type) => {
    this.setState({
      titleStatus: {
        ...titleStatus, // 这种方式可以实现只有当前点击的高亮，其他的不高亮
        [type]: true
      }
    })
  }
  // 生命周期函数-渲染到内存
  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleStatus={this.state.titleStatus}
            onTitleClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
