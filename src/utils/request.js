/**
 * 封装请求模块
 */
// 1.导入axios
import axios from 'axios'

// 2.创建axios实例对象
const request = axios.create({
    // 配置基准地址
    baseURL: 'http://api-haoke-web.itheima.net/'
})

// 3.导出实例对象
export default request
