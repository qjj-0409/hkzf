import React, { Component } from 'react'

// 引入样式文件
import './map.scss'

// 导入封装的组件
import NavHeader from '../../components/NavHeader/index'

// 使用定位显示对应的地图
// 1.导入封装的获取定位城市的方法
import { getCurrentCity } from '../../utils/index'

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
