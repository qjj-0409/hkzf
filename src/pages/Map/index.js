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

console.log(styles)

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
      // 创建地图实例
      var map = new BMap.Map("container")
      // 创建地址解析器实例     
      var myGeo = new BMap.Geocoder()
      // 将地址解析结果显示在地图上，并调整地图视野    
      myGeo.getPoint(dingwei.label, function(point){
        // point表示城市对应的经纬度
        if (point) {      
          map.centerAndZoom(point, 11)
          // 添加地图控件
          map.addControl(new BMap.NavigationControl()) // 缩放控件
          map.addControl(new BMap.ScaleControl()) // 比例尺
          map.addControl(new BMap.OverviewMapControl()) // 缩略地图
          map.addControl(new BMap.MapTypeControl()) // 地图类型
          // 添加地图覆盖物
          var opts = {
            position: point,    // 指定文本标注所在的地理位置
            // 移动覆盖物到坐标点中心
            offset: new BMap.Size(-35, -35)    //设置文本偏移量
          }
          // 创建文本标注对象
          var label = new BMap.Label("", opts)
          // 设置文本标注的内容
          label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">朝阳区</p>
              <p>10套</p>
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
            console.log('点击了覆盖物')
          })
          map.addOverlay(label)
        }
      },
      dingwei.label)
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
