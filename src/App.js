import React, { Component, Suspense, lazy } from 'react'

// 引入antd-mobile组件库中的Botton组件
// import { Button } from 'antd-mobile'

// 配置一个简单的路由
// 1.下载react-router-dom
// 2.导入react-router-dom包中的三个组件 BrowserRouter, Route, Link
import { BrowserRouter, Route, Redirect} from 'react-router-dom'
// 3.BrowserRoute必须在App根组件包裹一次
// 4.Route匹配地址，挖坑显示组件

// 导入组件
// 打包优化-基于路由的代码分割
const Home = lazy(() => import('./pages/Home'))
const CityList = lazy(() => import('./pages/CityList/'))
const Map = lazy(() => import('./pages/Map/'))
const HouseDetail = lazy(() => import('./pages/HouseDetail/'))
const Login = lazy(() => import('./pages/Login/'))
const Rent = lazy(() => import('./pages/Rent/'))
const AuthRoute = lazy(() => import('./components/AuthRoute'))
const RentAdd = lazy(() => import('./pages/Rent/Add/'))
const RentSearch = lazy(() => import('./pages/Rent/Search/'))
// import Home from './pages/Home'
// import CityList from './pages/CityList/'
// import Map from './pages/Map/'
// import HouseDetail from './pages/HouseDetail/'
// import Login from './pages/Login/'
// import Rent from './pages/Rent/'
// import AuthRoute from './components/AuthRoute'
// import RentAdd from './pages/Rent/Add/'
// import RentSearch from './pages/Rent/Search/'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="app">
            {/* <Button type="primary">按钮</Button> */}
            {/* 默认地址重定向 */}
            <Route exact path="/" render={
              (props) => {
                return <Redirect to="/home/index"></Redirect>
              }
            }></Route>

            {/* <Route path="/路径" component={显示的组件}></Route> */}
            <Route path="/home" component={Home}></Route>

            {/* 城市列表组件 */}
            <Route exact path="/citylist" component={CityList}></Route>
            <Route exact path="/map" component={Map}></Route>
            <Route exact path="/detail/:id" component={HouseDetail}></Route>
            <Route exact path="/login" component={Login}></Route>
            {/* 房屋管理组件 */}
            <AuthRoute exact={true} path="/rent" Page={Rent}></AuthRoute>
            <AuthRoute exact={true} path="/rent/add" Page={RentAdd}></AuthRoute>
            <AuthRoute exact={true} path="/rent/search" Page={RentSearch}></AuthRoute>
          </div>
        </Suspense>
      
      </BrowserRouter>
    )
  }
}
