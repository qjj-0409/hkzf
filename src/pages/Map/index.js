import React, { Component } from 'react'

// 引入样式文件
import './map.scss'
// 引入局部样式
import styles from './map.module.css'

// 导入封装的组件
import NavHeader from '../../components/NavHeader/index'

// 使用定位显示对应的地图
// 1.导入封装的获取定位城市的方法
import { getCurrentCity } from '../../utils/index'

// 导入axios实例对象
import request from '../../utils/request'

const BMap = window.BMap
export default class Map extends Component {
    state = {
      list: [], // 小区房子信息
      count: '', // 房子数量
      isShow: false // 控制房源列表的展示和隐藏
    }
    // 生命周期函数-初次渲染到页面
    componentDidMount() {
      this.initMap()
    }

    // 封装函数-初始化地图
    async initMap () {
      // 获取当前定位城市
      const dingwei = await getCurrentCity()
      // 创建地图实例
      var map = new BMap.Map("container")
      /**
       * 两个函数使用map
       * 1.写全局变量
       * 2.作为参数传递给函数
       * 3.将map写在组件中
       */
      this.map = map
      // 创建地址解析器实例     
      var myGeo = new BMap.Geocoder()
      // 将地址解析结果显示在地图上，并调整地图视野    
      myGeo.getPoint(dingwei.label, point => {
        // point表示城市对应的经纬度
        if (point) {      
          map.centerAndZoom(point, 11)
          // 添加地图控件
          map.addControl(new BMap.NavigationControl()) // 缩放控件
          map.addControl(new BMap.ScaleControl()) // 比例尺
          map.addControl(new BMap.OverviewMapControl()) // 缩略地图
          map.addControl(new BMap.MapTypeControl()) // 地图类型
          
          // 调用函数-获取房源信息和展示覆盖物
          this.renderOverlay(dingwei.value, 'bubble')
          
        }
      },
      dingwei.label)
    }

    // 封装函数-发送请求获取房源信息显示对应覆盖物
    renderOverlay = async (id, type) => {
      // 发送请求获取所有区的房源信息
      const {data} = await request.get('/area/map',{
        params: {
          id
        }
      })
      console.log(data.body)
      // 循环遍历数据创建覆盖物
      data.body.forEach(item => {
        // 创建点坐标 longitude 经度  latitude 纬度
        var point = new BMap.Point(item.coord.longitude, item.coord.latitude)
        // 添加地图覆盖物
        var opts = {
          position: point, // 指定文本标注所在的地理位置
          // 移动覆盖物到坐标点中心
          offset: new BMap.Size(-35, -35)    //设置文本偏移量
        }
        // 创建文本标注对象
        var label = new BMap.Label("", opts)
        // 设置文本标注的内容
        if (type === 'bubble') {
          label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">${item.label}</p>
              <p>${item.count}套</p>
            </div>
          `)
        } else if (type === 'rect') {
          label.setContent(`
            <div class="${styles.rect}">
              <span class="${styles.housename}">${item.label}</span>
              <span class="${styles.housenum}">${item.count}套</span>
              <i class="${styles.arrow}"></i>
            </div>
          `)
        }
        // 设置文本的样式
        label.setStyle({
          border: 'none', // 去掉label标签的边框和padding
          padding: 0
        })
        // 给覆盖物绑定点击事件
        // addEventListener(event: String, handler: Function)
        label.addEventListener('click', () => {
          // 获取地图缩放级别
          let zoom = this.map.getZoom()
          // 如果当前地图缩放级别是11，点击放大到13并展示覆盖物
          if (zoom === 11) {
            this.updateMap(13, item.value, point, 'bubble')
          } else if (zoom === 13) {
            // 如果当前地图缩放级别是13，点击放大到15并展示覆盖物
            this.updateMap(15, item.value, point, 'rect')
          } else if (zoom === 15) {
            // 如果当前地图缩放级别是15，点击不放大，发送请求，获取当前小区房子列表信息
            this.getHouseList(item.value)
            // 展示小区房源列表
            this.setState({
              isShow: true
            })
          }
        })
        this.map.addOverlay(label)
      })
    }

    // 封装函数-放大地图，显示覆盖物
    updateMap = (zoom, id, point, type) => {
      console.log('当前地图缩放级别：', zoom)
      // 放大地图到指定区
      this.map.centerAndZoom(point, zoom)
      // 百度地图Bug：清除覆盖物必须使用定时器，否则会报错
      setTimeout(() => {
        // 默认点击放大地图后，原来的覆盖物还存在
        // 需求：清除之前的覆盖物，再生成新的覆盖物
        this.map.clearOverlays()
      }, 10)
      // 显示指定区的房源信息和覆盖物
      this.renderOverlay(id, type)
    }

    // 封装函数-获取小区房子列表
    getHouseList = async (cityId) => {
      // 发请求获取房子列表
      const { data: { body } } = await request.get('/houses',{
        params: {
          cityId
        }
      })
      console.log('小区房源列表',body)
      // 将获取到房源信息赋值给state
      this.setState({
        list: body.list,
        count: body.count
      })
    }

    // 封装函数-格式化tag样式
    formatTag = (i) => {
      switch (i) {
        case 0:
          return styles.tag1
        case 1:
          return styles.tag2
        case 2:
          return styles.tag3
        default:
          break;
      }
    }

    // 封装函数-渲染房源列表
    renderHouseList = () => {
      return this.state.list.map((item) => {
        return (
          <div
            className={styles.house}
            key={item.houseCode}
          >
            <div className={styles.imgWrap}>
              <img
                className={styles.img}
                src={`http://api-haoke-web.itheima.net${item.houseImg}`}
                alt=""
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              <div className={styles.desc}>{item.desc}</div>
              <div>
                {
                  item.tags.map((tag, i) => {
                    return (
                      <span
                        className={[styles.tag, this.formatTag(i)].join(' ')}
                        key={i}
                    >{tag}</span>
                    )
                  })
                }
              </div>
              <div className={styles.price}>
                <span className={styles.priceNum}>{item.price}</span>元/月
              </div>
            </div>
          </div>
        )
      })
    }

    // 生命周期函数-渲染到内存
    render() {
      return (
        <div className="map">
          {/* 顶部导航栏 */}
          <NavHeader>地图导航</NavHeader>  
          {/* 1.创建地图容器元素 */}
          <div id="container"></div>

          {/* 小区房源信息 */}
          <div className={[styles.houselist, this.state.isShow ? styles.show : ''].join(' ')}>
            {/* 标题 */}
            <div className={styles.titleWrap}>
              <h1 className={styles.listTitle}>房屋列表</h1>
              <a className={styles.titleMore} href="/house/list">更多房源</a>
            </div>
            {/* 房源信息 */}
            <div className={styles.houseItems}>
              {/* 调用函数-渲染房源列表信息 */}
              { this.renderHouseList() }
            </div>
            
          </div>
        </div>
      )
    }
}
