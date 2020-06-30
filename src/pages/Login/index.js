import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

import request from '../../utils/request'

// 导入formik
// 简化表单验证
import { withFormik, Form, Field, ErrorMessage } from 'formik'
// 导入yup，配合validationSchema进行表单验证
import * as Yup from 'yup'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {

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

  // 生命周期函数-渲染到内存
  render() {
    // let {
    //   values,
    //   errors,
    //   handleChange,
    //   handleSubmit,
    // } = this.props
    // console.log('login页的props', this.props)
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          {/* 1.Form替换from，不用绑定onSubmit事件，内部默认绑定 */}
          <Form>
            <div className={styles.formItem}>
              {/* 2.Field替换input输入框，value和onChange事件不用写了，使用name绑定values */}
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* 3.ErrorMessage替换错误提示框，使用name绑定对应验证errors的错误，component绑定错误标签div */}
            <ErrorMessage className={styles.error} name="username" component="div" />
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            <ErrorMessage className={styles.error} name="password" component="div" />
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
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

export default withFormik({
  // 1.mapPropsToValues的作用：替代state；会把数据写在组件上
  mapPropsToValues: () => {
    return {
      username: '', // 用户名
      password: '' // 密码
    }
  },
  // 2.handleSubmit表单提交的函数，替代原来的onSubmit事件的执行函数
  handleSubmit: async (values, { props }) => {
    // 阻止默认行为，内部默认已经做了
    // e.preventDefault()
    // 获取用户名和密码，发送请求去登录
    const { data } = await request.post('/user/login', {
      username: values.username,
      password: values.password
    })
    console.log('登录信息', data)
    if (data.status === 200) {
      // 登录成功
      // 保存token到本地存储
      localStorage.setItem('my-token', data.body.token)
      // 提示登录成功
      Toast.success(data.description, 1)
      // 跳转到上一个页面，不能再用this.props了
      // console.log('登录页面的props', props)
      props.history.go(-1)
    } else {
      // 提示登录失败
      Toast.fail(data.description, 2)
    }
  },
  // 3.validationSchema配合yup进行表单验证
  validationSchema: Yup.object().shape({
    // values参数: 验证规则
    // 报错信息会放在props对象的errors对象上
    // 如果没有错误，则errors是一个空对象
    username: Yup.string().required('用户名必填').matches(/^\w{5,8}$/, '用户名长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码必填').matches(/^\w{5,12}$/, '密码长度为5到12位，只能出现数字、字母、下划线')
  })
})(Login)
