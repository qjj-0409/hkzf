import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    moreValues: this.props.defaultValues // 选中的值
  }
  // 渲染标签
  renderFilters(arr) {
    // 高亮类名： styles.tagActive
    return arr.map((item, index) => {
      // 选中的元素
      let isSelected = this.state.moreValues.indexOf(item.value) !== -1
      return (
        <span
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : '' ].join(' ')}
          onClick={() => {
            let newValues = this.state.moreValues
            // 点击的时候先判断是否已被选中
            // 如果没有被选中，则点击追加进数组；
            // 如果已经被选中，则点击删除当前条件
            if (newValues.indexOf(item.value) === -1) {
              newValues.push(item.value)
            } else {
              newValues.splice(index, 1)
            }
            this.setState({
              moreValues: newValues
            }, () => {
              console.log('moreValues的值：', this.state.moreValues)
            })
          }}
        >{item.label}</span>
      )
    })
  }

  render() {
    let { data } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(data.roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(data.oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(data.floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(data.characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onSave={() => {
            this.props.onSave(this.state.moreValues)
          }}
          onCancel={() => {
            // 去掉所有之前选中的-->重置选中数组为空
            this.setState({
              moreValues: []
            })
          }}
        />
      </div>
    )
  }
}
