import React, { Component } from 'react'

export default class Sticky extends Component {
  pRef = React.createRef()
  cRef = React.createRef()
  // 生命周期函数-页面一加载就执行
  componentDidMount() {
    let pDiv = this.pRef.current
    let cDiv = this.cRef.current
    window.addEventListener('scroll', () => {
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
    })
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
