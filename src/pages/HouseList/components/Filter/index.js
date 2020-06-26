import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

// 导入axios实例对象
import request from '../../../../utils/request'
// 导入公共函数获取定位城市
import { getCurrentCity } from '../../../../utils/index'

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
    openType: '', // 被打开的标题type
    filtersData: {}, // 房屋查询条件
    selectedValues: { // 选中的条件
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
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
      let { filtersData } = this.state
      let data = [] // 下拉条件数据
      let cols = 0 // 列数
      // 拿到选中的默认值
      let defaultValues = this.state.selectedValues[openType]
      switch (openType) {
        case 'area':
          data = [filtersData.area, filtersData.subway]
          cols = 3
          break
        case 'mode':
          data = filtersData.rentType
          cols = 1
          break
        case 'price':
          data = filtersData.price
          cols = 1
          break
        default:
          break
      }
      return (
        <FilterPicker
          // 解决办法：给FilterPicker绑定key属性，每次切换openType都会变化
          key={openType}
          data={data}
          cols={cols}
          onCancel={this.onCancel}
          onSave={this.onSave}
          defaultValues={defaultValues}
        />
      )
    } else if (openType === 'more') {
      return null
    }
  }

  // 封装函数-获取房屋查询条件
  async getFiltersData () {
    // 获取定位城市
    const dingwei = await getCurrentCity()
    console.log(dingwei)
    // http://api-haoke-web.itheima.net/houses/condition?id=AREA%7C88cff55c-aaa4-e2e0
    const { data } = await request.get('/houses/condition', {
      params: {
        id: dingwei.value
      }
    })
    console.log('房屋查询条件：', data)
    this.setState({
      filtersData: data.body
    })
  }

  // 封装函数-控制FilterMore的显示和隐藏
  renderMore () {
    let { openType, filtersData } = this.state
    let data = {
      roomType: filtersData.roomType, // 户型
      oriented: filtersData.oriented, // 朝向
      floor: filtersData.floor, // 楼层
      characteristic: filtersData.characteristic // 房屋亮点
    }
    if (openType === 'more') {
      return <FilterMore
        data={data}
        onSave={this.onSave}
      />
    } else {
      return null
    }
  }

  // 声明函数-下拉选择框取消按钮事件
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }
  // 声明函数-下拉选择框确认按钮事件
  onSave = (value) => {
    let type = this.state.openType
    this.setState({
      // 接收传来的条件
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value
      },
      openType: ''
    }, () => {
      console.log('接收传来的条件：', this.state.selectedValues)
    })
  }

  // 声明周期函数-初次渲染页面
  componentDidMount () {
    // 调用函数获取房屋查询条件
    this.getFiltersData()
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
          { this.renderMore() }
        </div>
      </div>
    )
  }
}
