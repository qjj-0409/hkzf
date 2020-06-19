// 1.引入react
import React from 'react'

// 导入antd-mobile组件
import { TabBar } from 'antd-mobile'

// 导入四个子组件
import Index from '../Index/'
import HouseList from '../HouseList/'
import News from '../News/'
import Profile from '../Profile/'

// 引入样式
import './home.css'
import { Route } from 'react-router-dom'

// tabItem数组
const tabItems = [{
  title: '首页',
  icon: 'icon-ind',
  path: '/home/index'
},
{
  title: '找房',
  icon: 'icon-findHouse',
  path: '/home/houselist'
},
{
  title: '资讯',
  icon: 'icon-infom',
  path: '/home/news'
},
{
  title: '我的',
  icon: 'icon-my',
  path: '/home/profile'
}]

// 2.封装组件
class Home extends React.Component {
    // 复制state
    state = {
      selectedTab: '/home/index', // 默认选中的关键字
      hidden: false // 控制是否隐藏
    }

    // 封装渲染tabBar.Item的函数
    renderTabBarItem () {
        return tabItems.map(item => {
            return (
                <TabBar.Item
                  title={item.title} // 标题
                  key="Life"
                  icon={ // 默认图标
                      <span className={`iconfont ${item.icon}`}></span>
                  }
                  selectedIcon={ // 选中图标
                      <span className={`iconfont ${item.icon}`}></span>
                  }
                  selected={this.state.selectedTab === item.path} // 是否选中
                  onPress={() => { // bar 点击触发，需要自己改变组件 state & selecte={true}
                      this.setState({
                          selectedTab: item.path,
                      });
                      this.props.history.push(item.path)
                  }}
                  data-seed="logId"
                >
                </TabBar.Item>
            )
        })
    }

    render() {
        return (
            <div className="home">
                {/* 
                TabBar属性
                  unselectedTintColor：未选中的字体颜色
                  tintColor：选中的字体颜色
                  barTintColor：tabbar 背景色
                  hidden：控制TabBar是否隐藏
                TabBar.Item属性
                  badge：徽标
                  dot：是否在右上角显示小红点（在设置badge的情况下失效）
                */}
                
                {/* 挖坑显示四个组件 */}
                <Route path="/home/index" component={Index}></Route>
                <Route path="/home/houselist" component={HouseList}></Route>
                <Route path="/home/news" component={News}></Route>
                <Route path="/home/profile" component={Profile}></Route>

                <TabBar
                  unselectedTintColor="#949494" // 未选中的字体颜色
                  tintColor="#21b97a" // 选中的字体颜色
                  barTintColor="white" // tabbar 背景色
                  hidden={this.state.hidden} // 控制TabBar是否隐藏
                  noRenderContent={true}
                >
                  {/* 循环渲染TabBar.Item */}
                  {
                    this.renderTabBarItem()
                  }
                </TabBar>
            </div>
        )
    }
}
// 3.导出组件
export default Home