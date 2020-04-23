import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import signin from '@/components/signin'
import navbar from '@/components/navbar'
import home from '@/components/home'
Vue.use(Router)
/* eslint-disable */
const router=new Router({
  //否则url中会出现#
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta: {                 //meta 字段就是路由元信息字段，requiresAuth 是自己起的字段名称，用来标记这个路由信息是否需要检测
        requiresAuth: true   //在进入页面前判断是否登录
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/signin',
      name: 'signin',
      component: signin
    },
    {
      path: '/navbar',
      name: 'navbar',
      component: navbar
    },
    {
      path: '/user/:id',
      name: 'profile',
      component: profile
    }
  ]

  })
//每次进入页面前进行判断；全局前置守卫 beforeEach
router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    next({
      path: '/login',
      query: {redirect: to.fullPath}
    })
  } else if (token && to.name == 'login') {
    // 用户已登录，但又去访问登录页面时不让他过去
    next({
      path: from.fullPath
    })
  } else {
    next()
  }
})

export default router
