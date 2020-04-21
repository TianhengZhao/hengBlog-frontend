/* eslint-disable */
/*由于项目简单，没有使用 vuex，使用 store 来进行状态管理*/
export default {
  debug: true,
  state: {
    is_new: false  ,  //共享状态
    is_authenticated: window.localStorage.getItem('token') ? true : false

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
  },
  logoutAction () {
    if (this.debug) console.log('logoutAction triggered')
    window.localStorage.removeItem('token')
    this.state.is_authenticated = false
  }

}

