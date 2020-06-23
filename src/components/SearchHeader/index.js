import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

class SearchHeader extends Component {
  render() {
    console.log(this.props)
    return (
      <div className="search">
        <div className="search-left">
          <div className="location">
            <span
              onClick={() => {
                this.props.history.push('/citylist')
              }}
            >{this.props.cityname}</span>
            <i className="iconfont icon-arrow"></i>
          </div>
          <div className="searchForm">
            <i className="iconfont icon-seach"></i>
            <span>请输入小区或地址</span>
          </div>
        </div>
        <i
          className="iconfont icon-map"
          onClick={() => {
            this.props.history.push('/map')
          }}
        ></i>
      </div>
    )
  }
}

// 验证参数类型
SearchHeader.propTypes = {
  cityname: PropTypes.string
}
// 设置默认值
SearchHeader.defaultProps = {
  cityname: '全国'
}

export default withRouter(SearchHeader)
