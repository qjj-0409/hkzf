// 统一处理token
// 获取token
let getToken = () => {
  return localStorage.getItem('my-token')
}

// 设置token
let setToken = (val) => {
  return localStorage.setItem('my-token', val)
}

// 删除token
let removeToken = () => {
  return localStorage.removeItem('my-token')
}

// 判断是否登录
let isAuth = () => {
  return !!getToken()
}

export { getToken, setToken, removeToken, isAuth }
