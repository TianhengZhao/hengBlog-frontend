import Vue from 'vue'
import Vuex from 'vuex'
/* eslint-disable */    //禁用eslint，可在init项目时即关闭
Vue.use(Vuex)
// 初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
const state = {
  //sessionStorage 创建一个本地存储的 key/value 对,getItem获取键值user对应的value
  user: window.sessionStorage.getItem('user'),
  token: window.sessionStorage.getItem('token')//登录状态token,true表示已登录
}
const mutations = {
  SET_TOKEN: (state, data) => {
    state.token = data
    window.sessionStorage.setItem('token', data)
  },
  GET_USER: (state, data) => {
    // 把用户名存起来
    state.user = data
    window.sessionStorage.setItem('user', data)
  },
  LOGOUT: (state) => {
    // 登出的时候要清除token
    state.token = null
    state.user = null
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('user')
  }
}

const actions = {
}
export default new Vuex.Store({
  state,
  mutations,
  actions
})
