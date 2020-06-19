// 封装公共函数
// 导入axios
import axios from "axios";

export let getCurrentCity = () => {
  // 优化：1.百度方法，有次数限制  2.定位很少变化，所以没必要多次调用
  // 解决：如果本地存储中有城市就取出来，没有才百度定位
  let city = JSON.parse(localStorage.getItem('my-city'))
  if (!city) {
    // 百度地图根据ip获取定位城市的操作是异步的，尚未获取到定位城市信息就先返回了，所以没有数据
    // 解决办法：将根据ip获取定位城市封装为promise对象
    return new Promise((resolve, reject) => {
      // 1.百度地图定位-根据id定位城市
      let myCity = new window.BMap.LocalCity();
      myCity.get(async (result) => {
      let cityName = result.name
      // console.log("当前定位城市:", cityName)
      // 2.发送请求-根据城市名获取城市信息
      let { data } = await axios.get('http://api-haoke-dev.itheima.net/area/info?name=' + cityName)
      
      // 将获取到的定位城市信息保存到本地
      localStorage.setItem('my-city', JSON.stringify(data.body))  
      // 将获取到的定位城市信息返回
      resolve(data.body)
      })
    })
  } else {
    // 为了保持数据格式一致，所以将city封装成promise对象
    // return new Promise((resolve, reject) => {
    //   resolve(city)
    // })
    // 简写
    return Promise.resolve(city)
  }

  
  
}