import React, { Component } from 'react'

// 引入样式文件
import './map.scss'

const BMap = window.BMap
export default class Map extends Component {
    // 生命周期函数-初次渲染到页面
    componentDidMount() {
        this.initMap()
    }

    // 封装函数-初始化地图
    initMap () {
        // 2.创建地图实例
        var map = new BMap.Map("container")
        // 3.设置地图中心点坐标
        var point = new BMap.Point(116.404, 39.915)
        // 4.移动地图到中心点
        map.centerAndZoom(point, 15)
    }

    // 生命周期函数-渲染到内存
    render() {
        return (
            <div className="map">
                {/* 1.创建地图容器元素 */}
                <div id="container"></div>
            </div>
        )
    }
}
