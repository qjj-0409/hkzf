import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal } from 'antd-mobile'

import baseURL from '../../utils/baseURL'

import styles from './index.module.css'

import { isAuth, removeToken } from '../../utils/token'
import request from '../../utils/request'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = baseURL + '/img/profile/avatar.png'

export default class Profile extends Component {
  // 生命周期函数-初始化（进打开页面执行一次）
  state = {
    isLogin: isAuth(), // 控制登录状态
    userInfo: { // 用户相关信息
      avatar: '', // 用户头像
      nickname: '' // 用户昵称
    }
  }

  // 封装函数-渲染登录状态
  renderLogin = () => {
    const { history } = this.props
    if (this.state.isLogin) {
      // 已登录样式
      return (
        <>
          <div className={styles.auth}>
            <span onClick={this.logout}>退出</span>
          </div>
          <div className={styles.edit}>
            编辑个人资料
            <span className={styles.arrow}>
              <i className="iconfont icon-arrow" />
            </span>
          </div>
        </>
      )
    } else {
      // 未登录样式
      return (
        <div className={styles.edit}>
          <Button
            type="primary"
            size="small"
            inline
            onClick={() => history.push('/login')}
          >
            去登录
          </Button>
        </div>
      )
    }
  }

  // 封装函数-获取用户信息
  getUserInfo = async () => {
    const { data } = await request.get('/user')
    // console.log('获取到的用户信息：', data)
    if (data.status === 200) {
      // 请求成功，渲染用户个人信息
      this.setState({
        userInfo: {
          avatar: data.body.avatar,
          nickname: data.body.nickname
        }
      })
    }
  }

  // 封装函数-退出登录
  logout = () => {
    // 1.显示弹出框
    Modal.alert('退出登录', '你确定退出吗???', [
      { text: '取消', onPress: () => {
        // 2.点击取消关闭弹出框
        console.log('取消')
      }},
      { text: '确定', onPress: async () => {
        // 3.点击确定发请求退出
        const { data } = await request.post('/user/logout', null)
        // console.log('退出信息：', data)
        // 4.退出成功，清除token，重置state数据
        if (data.status === 200) {
          removeToken()
          this.setState({
            isLogin: false, // 控制登录状态
            userInfo: { // 用户相关信息
              avatar: '', // 用户头像
              nickname: '' // 用户昵称
            }
          })
        }
      }}
    ])
  }

  // 生命周期函数-初次渲染到页面（执行一次）
  componentDidMount () {
    // 调用函数-获取用户信息
    this.getUserInfo()
  }

  // 生命周期函数-渲染到内存（执行多次）
  render() {
    // const { history } = this.props
    let { userInfo } = this.state

    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={baseURL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={ userInfo.avatar || DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{ userInfo.nickname || '游客' }</div>
              {/* 调用函数-渲染登录状态 */}
              { this.renderLogin() }
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={baseURL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
