import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

import request from '../../utils/request'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: '',
    password: '',
    isname: false,
    ispass: false
  }

  // 封装函数-获取用户名
  getUsername = (e) => {
    console.log('获取e的值', e.target)
    this.setState({
      username: e.target.value
    })
  }

  // 封装函数-获取密码
  getPassword = (e) => {
    console.log('密码值：', e.target.value)
    this.setState({
      password: e.target.value
    })
  }
  
  // 封装函数-验证用户名
  verifyUsername = () => {
    let username = this.state.username.trim()
    if (/^\w{5,8}$/.test(username)) {
      this.setState({
        isname: false
      })
    } else {
      this.setState({
        isname: true
      })
    }
  }

  // 封装函数-渲染错误提示
  renderError = () => {
    if (this.state.isname) {
      return <div className={styles.error}>账号为必填项</div>
    } else {
      return null
    }
  }

  // 封装函数-验证密码
  verifyPassword = () => {
    // 同验证账号相同
  }

  // 封装函数-提交表单
  handleSubmit = async (e) => {
    // 阻止默认行为
    e.preventDefault()
    // 获取用户名和密码，发送请求去登录
    const { data } = await request.post('/user/login', {
      username: this.state.username,
      password: this.state.password
    })
    console.log('登录信息', data)
    if (data.status === 200) {
      // 登录成功
      // 保存token到本地存储
      localStorage.setItem('my-token', data.body.token)
      // 提示登录成功
      Toast.success(data.description, 2)
    } else {
      // 提示登录失败
      Toast.fail(data.description, 2)
    }
  }

  // 生命周期函数-渲染到内存
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={this.handleSubmit}>
            <div className={styles.formItem}>
              <input
                value={this.state.username}
                onChange={this.getUsername}
                onBlur={this.verifyUsername}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            { this.renderError() }
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                value={this.state.password}
                onChange={this.getPassword}
                onBlur={this.verifyPassword}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Login
