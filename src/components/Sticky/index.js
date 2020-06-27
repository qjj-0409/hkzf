import React, { Component } from 'react'

export default class Sticky extends Component {
  pRef = React.createRef()
  cRef = React.createRef()
  // 封装函数-页面滚动实现吸顶功能
  handerScroll = () => {
    let pDiv = this.pRef.current
    let cDiv = this.cRef.current
    let pTop = pDiv.getBoundingClientRect().top
    // console.log('pTop', pTop)
    if (pTop <= 0) {
      cDiv.style.position = 'fixed'
      cDiv.style.top = 0
      cDiv.style.left = 0
      cDiv.style.width = '100%'
      cDiv.style.zIndex = 999
      // pDiv占位，防止下面的数据突然上跳
      pDiv.style.height = this.props.height + 'px'
    } else {
      // 恢复原来的样式
      cDiv.style.position = 'static'
      pDiv.style.height = 0
    }
  }

  // 生命周期函数-页面一加载就执行
  componentDidMount() {
    // 添加滚动事件
    window.addEventListener('scroll', this.handerScroll)
  }

  // 生命周期函数-组件卸载
  componentWillUnmount() {
    // 移除滚动事件
    window.removeEventListener('scroll', this.handerScroll)
  }

  // 生命周期函数-渲染到内存
  render() {
    return (
      <div className="sticky">
        <div id="placeholder" ref={this.pRef}></div>
        <div id="content" ref={this.cRef}>
          { this.props.children }
        </div>
      </div>
    )
  }
}
