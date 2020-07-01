/**
 * 封装请求模块
 */
// 1.导入axios
import axios from 'axios'

// 导入接口基准地址
import baseURL from './baseURL'
import { getToken, removeToken } from './token'

// 2.创建axios实例对象
const request = axios.create({
    // 配置基准地址
    baseURL
})

// 请求拦截器
request.interceptors.request.use(function(config){
  // 控制要不要加上登录token
  // 请求地址以/user开头，但是不包括登录和注册
  // console.log('请求拦截器配置对象config', config)
  if (config.url.startsWith('/user')
    && config.url !== '/user/registered'
    && config.url !== '/user/login'
  ) {
    config.headers.authorization = getToken()
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(function(response){
  // console.log('响应拦截器的配置对象response', response)
  if (response.data.status === 400) {
    console.log('token有问题')
    // 删除token
    removeToken()
    // 跳转到登录页
    window.location.href = '/login'
  } else if (response.data.status === 500) {
    console.log('服务器有问题')
  } else if (response.data.status === 404) {
    console.log('接口有问题')
  }
  return response
})

// 3.导出实例对象
export default request
