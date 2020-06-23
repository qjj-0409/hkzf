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
    titleStatus: titleStatus, // 四个标题的高亮状态
    openType: '' // 被打开的标题type
  }
  // 封装函数-点击修改标题高亮状态
  onTitleClick = (type) => {
    this.setState({
      titleStatus: {
        ...titleStatus, // 这种方式可以实现只有当前点击的高亮，其他的不高亮
        [type]: true
      },
      openType: type
    })
  }

  // 封装函数-渲染下拉选择框
  renderFilterPicker = () => {
    // 如果是区域、方式、租金则显示FilterPicker，否则显示FilterMore
    let { openType } = this.state
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return <FilterPicker />
    } else if (openType === 'more') {
      return null
    }
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

          {/* 前三个菜单对应的内容：下拉选择框 */}
          {/* 调用函数-渲染下拉选择框 */}
          { this.renderFilterPicker() }

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
