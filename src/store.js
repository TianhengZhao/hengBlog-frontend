/* eslint-disable */
/*由于项目简单，没有使用 vuex，使用 store 来进行状态管理*/
export default {
  debug: true,
  state: {
    is_new: false  ,  //共享状态
    is_authenticated: window.localStorage.getItem('token') ? true : false,
    user_id:window.localStorage.getItem('token') ? JSON.parse(atob(window.localStorage.getItem('token').split('.')[1])).id:0,
    user_name:window.localStorage.getItem('token') ?JSON.parse(atob(window.localStorage.getItem('token').split('.')[1])).name:null
  },

    setNewAction () {
    if (this.debug) { console.log('setNewAction triggered') }
    this.state.is_new = true
  },
  resetNotNewAction () {
    if (this.debug) { console.log('resetNotNewAction triggered') }
    this.state.is_new = false
  },
  loginAction () {
    if (this.debug) { console.log('loginAction triggered') }
    this.state.is_authenticated = true
    this.state.user_id= JSON.parse(atob(window.localStorage.getItem('token').split('.')[1])).id
    this.state.user_name=JSON.parse(atob(window.localStorage.getItem('token').split('.')[1])).name
  },
  logoutAction () {
    if (this.debug) console.log('logoutAction triggered')
    window.localStorage.removeItem('token')
    this.state.is_authenticated = false
    this.state.user_id = 0
    this.state.user_name='陌生用户'
  }

}

