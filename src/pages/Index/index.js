import React, { Component } from 'react'

// 导入antd-moblie组件库
import { Carousel, Flex, Grid } from 'antd-mobile'
// 导入样式文件
import './index.css'
// 导入sass样式文件
import './index.scss'
import './news.scss'
// 导入导航菜单图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

// 导入axios
import axios from 'axios'

// 导航菜单的数据
const navs = [{
    id: 0,
    img: nav1,
    title: '整租',
    path: '/home/houselist'
}, {
    id: 1,
    img: nav2,
    title: '合租',
    path: '/home/houselist'
}, {
    id: 2,
    img: nav3,
    title: '地图找房',
    path: '/map'
}, {
    id: 3,
    img: nav4,
    title: '去出租',
    path: '/rent/add'
}]

export default class Index extends Component {
    state = {
      data: [], // 轮播图数据
      imgHeight: 176, // 轮播图片大小
      isAutoPlay: false, // 控制是否自动轮播
      groups: [], // 租房小组数据
      news: [], // 最新资讯数据
      currentCity: '' // 当前城市
    }

    // 生命周期函数-初次渲染到页面
    componentDidMount() {
      // 获取轮播图数据
      this.getSwiperData()
      // 获取租房小组数据
      this.getGroups()
      // 获取最新资讯数据
      this.getNews()
      // 获取当前定位城市
      this.getCurrentCity()
    }

    // 封装函数-获取轮播图数据
    async getSwiperData () {
      // 1.发送请求获取轮播图数据
      const { data } = await axios.get('http://api-haoke-dev.itheima.net/home/swiper')
      // 2.如果获取轮播图数据成功
      if (data.status === 200) {
        // 修改state中的data数据
        this.setState({
          data: data.body
        }, () => { // 必须保证在获取轮播图数据成功后，设置自动轮播为true，否则无法自动轮播
          this.setState({
            isAutoPlay: true
          })
        })
      }
    }

    // 封装函数-获取租房小组数据
    async getGroups () {
      const { data } = await axios.get('http://api-haoke-dev.itheima.net/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
      // console.log(data.body)
      this.setState({
        groups: data.body
      })
    }

    // 封装函数-获取当前城市
    getCurrentCity () {
      var myCity = new window.BMap.LocalCity();
      myCity.get((result) => {
        var cityName = result.name
        this.setState({
          currentCity: cityName
        })
        // console.log("当前定位城市:"+cityName)
      })
    }

    // 封装函数-获取最新资讯数据
    async getNews () {
      const { data } = await axios.get('http://api-haoke-dev.itheima.net/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
      // console.log(data.body)
      this.setState({
        news: data.body
      })
    }


    // 封装函数-渲染轮播图
    renderSwiper () {
      return this.state.data.map(item => (
        <a
          key={item.id}
          href="http://www.alipay.com"
          style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
        >
          <img
            src={`http://api-haoke-dev.itheima.net${item.imgSrc}`}
            alt=""
            style={{ width: '100%', verticalAlign: 'top' }}
            onLoad={() => {
              // fire window resize event to change height
              window.dispatchEvent(new Event('resize'));
              this.setState({ imgHeight: 'auto' });
            }}
          />
        </a>
    ))
    }

    // 封装函数-渲染导航菜单
    renderNav () {
      return (
        navs.map(item => {
          return (
            <Flex.Item
              key={item.id}
              onClick={
                () => {
                  this.props.history.push(item.path)
                }
              }
            >
              <img src={item.img} alt=""/>
              <p>{item.title}</p>
            </Flex.Item>
          )
        })
      )
    }

    // 封装函数-渲染租房小组
    renderGroups () {
      return (
        // rendeItem 属性：用来 自定义 每一个单元格中的结构
        <Grid
          data={this.state.groups} // 传入的菜单数据
          columnNum={2} // 列数
          square={false} // 每个格子是否固定为正方形
          activeStyle // 点击反馈的自定义样式 (设为 false 时表示禁止点击反馈)
          hasLine={false} // 是否有边框
          renderItem={item => ( // 自定义每个 grid 条目的创建函数
            <Flex className="grid-item" justify="between">
              <div className="desc">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <img src={`http://api-haoke-dev.itheima.net${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
      )
    }

    // 封装函数-渲染最新资讯
    renderNews () {
      return this.state.news.map(item => {
        return (
          <li className="item" key={item.id}>
            <img src={`http://api-haoke-dev.itheima.net${item.imgSrc}`} alt=""/>
            <div className="item-right">
              <h3>{item.title}</h3>
              <p>
                <span>{item.from}</span>
                <span>{item.date}</span>
              </p>
            </div>
          </li>
        )
      })
    }

    
    // 生命周期函数-渲染到内存
    render() {
        return (
            <div className="index">

              {/* 顶部搜索栏 */}
              <div className="search">
                <div className="search-left">
                  <div className="location">
                    <span
                      onClick={() => {
                        this.props.history.push('/citylist')
                      }}
                    >{this.state.currentCity}</span>
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

              {/* 轮播图 */}
              <Carousel
                  autoplay={this.state.isAutoPlay} // 是否自动切换
                  infinite // 是否循环播放
                  // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)} // 切换面板前的回调函数
                  // afterChange={index => console.log('slide to', index)} // 切换面板后的回调函数
                  >
                  {/* 调用函数-渲染轮播图 */}
                  { this.renderSwiper() }
              </Carousel>

              {/* 菜单栏 */}
              <Flex className="nav">
                {/* 调用函数-渲染导航菜单 */}
                { this.renderNav() }
              </Flex>

              {/* 租房小组 */}
              <div className="groups">
                {/* 标题部分 */}
                <div className="groups-title">
                  <h2>租房小组</h2>
                  <p>更多</p>
                </div>
                {/* 内容部分 */}
                {/* 调用函数-渲染租房小组 */}
                { this.renderGroups() }
                
              </div>
              
              {/* 最新资讯 */}
              <div className="news">
                  <div className="news-title">
                    <h2>最新资讯</h2>
                  </div>
                  <ul>
                    {/* 调用函数-渲染最新资讯 */}
                    { this.renderNews() }
                    
                    
                  </ul>
                </div>

            </div>
        )
    }
}
