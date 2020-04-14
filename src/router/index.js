import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import signin from '@/components/signin'
import test from '@/components/test'
Vue.use(Router)
/* eslint-disable */
export default new Router({
  //否则url中会出现#
  mode: 'history',
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
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }

  ]
})
