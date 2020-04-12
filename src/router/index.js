import Vue from 'vue'
import Router from 'vue-router'
import login from '@/store/login'
import signin from '@/store/signin'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/signin',
      name: 'signin',
      component: signin
    }
  ]
})
