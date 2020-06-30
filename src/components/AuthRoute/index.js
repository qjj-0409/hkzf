import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { isAuth } from '../../utils/token'

export default class AuthRoute extends Component {
  render() {
    const { exact, path, Page } = this.props
    return (
      <Route
        exact={exact}
        path={path}
        render={(props) => {
          if (isAuth()) {
            // 登录了，显示房屋管理页面
            return <Page {...props}></Page>
          } else {
            // 未登录，则重定向到登录页面
            return <Redirect to="/login"></Redirect>
          }
        }
      }></Route>
    )
  }
}
