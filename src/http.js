import Vue from 'vue'
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
  if (typeof error.response === 'undefined') {
    this.$message.error('无法连接Flask API，请联系管理员')
  } else {
    // Do something with response error
    switch (error.response.status) {
      case 401:
        // 清除 Token 及 已认证 等状态
        store.logoutAction()
        router.push('/login')
        /*
        if (router.currentRoute.path !== '/login') {
          Vue.toasted.error('401: 认证已失效，请先登录', { icon: 'fingerprint' })
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.path }
          })
        }*/
        break

      case 403:
        this.$message.error('403: Forbidden')
        router.back()
        break

      case 404:
        this.$message.error('404')
        break
    }
  }
  return Promise.reject(error)
})
export default axios
