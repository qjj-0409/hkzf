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
    // 生命周期函数-初次渲染到页面
    componentDidMount() {
      this.initMap()
    }

    // 封装函数-初始化地图
    async initMap () {
      // 获取当前定位城市
      const dingwei = await getCurrentCity()
      console.log('定位城市：', dingwei)
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
          this.renderOverlay(dingwei.value)
          
          
        }
      },
      dingwei.label)
    }

    // 封装函数-发送请求获取房源信息显示对应覆盖物
    renderOverlay = async (id) => {
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
        label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">${item.label}</p>
            <p>${item.count}套</p>
          </div>
        `)
        // 设置文本的样式
        label.setStyle({
          border: 'none', // 去掉label标签的边框和padding
          padding: 0
        })
        // 给覆盖物绑定点击事件
        // addEventListener(event: String, handler: Function)
        label.addEventListener('click', () => {
          // 放大地图到指定区
          this.map.centerAndZoom(point, 13)
          // 百度地图Bug：清除覆盖物必须使用定时器，否则会报错
          setTimeout(() => {
            // 默认点击放大地图后，原来的覆盖物还存在
            // 需求：清除之前的覆盖物，再生成新的覆盖物
            this.map.clearOverlays()
          }, 10)
          // 显示指定区的房源信息和覆盖物
          this.renderOverlay(item.value)
        })
        this.map.addOverlay(label)
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
        </div>
      )
    }
}
