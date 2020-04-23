import axios from 'axios'
import router from './router'
import store from './store'
// 基础配置
axios.defaults.timeout = 5000 // 超时时间
axios.defaults.baseURL = 'http://localhost:5000'

// 请求拦截器
axios.interceptors.request.use(function (config) {
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // 添加 Token 到请求头 Authorization 中
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  switch (error.response.status) {
    case 401: // JWT过期
      // 清除 Token 及 已认证 等状态
      store.logoutAction()
      // 跳转到登录页
      if (router.currentRoute.path !== '/login') {
        this.$message.error('401: 认证已失效，请先登录')
        router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.path }
        })
      }
      break

    case 404:
      this.$message.error('404: NOT FOUND')
      router.back()
      break
  }
  return Promise.reject(error)
})

export default axios
