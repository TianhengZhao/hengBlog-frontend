import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import signin from '@/components/signin'
import navbar from '@/components/navbar'
import home from '@/components/home'
import profile from '@/components/user/profile'
import editProfile from '@/components/user/editProfile'
import post from '@/components/post'
import hisPosts from '@/components/user/hisPosts'
import followers from '@/components/user/followers'
import following from '@/components/user/following'
import notifications from '../components/notification/notifications'
import receivedComments from '../components/notification/receivedComments'
import receivedFollowers from '../components/notification/receivedFollowers'
import receivedLikes from '../components/notification/receivedLikes'
import receivedMessages from '../components/notification/receivedMessages'
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
      component: navbar,
    },
    {
      path: '/user/:id',
      //name: 'profile',
      component: profile,    // 在profile的<router-view>中使用
      children:[
        { path: '', component: hisPosts },      // 默认子路由，父路由不能指定 name
        { path: 'hisPosts', name: 'hisPosts', component: hisPosts },     //         对应/user/:id
        { path: 'followers', name: 'followers', component: followers },  //         对应/user/:id/followers
        { path: 'following', name: 'following', component: following }  //         对应/user/:id/following
      ],
      meta: {
        requiresAuth: true                   //在进入页面前判断是否登录
      }

    },
    {
      path: '/user/editProfile',
      name: 'editProfile',
      component: editProfile,
      meta: {
        requiresAuth: true                   //在进入页面前判断是否登录
      }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: post
    },
    {
      path: '/notifications',
      component: notifications,    // 在<router-view>中使用
      children:[
        { path: '', component: receivedComments }, //         对应/notifications
        { path: 'receivedComments', name: 'receivedComments', component: receivedComments }, // 对应/notifications/receivedComments
        { path: 'receivedFollowers', name: 'receivedFollowers', component: receivedFollowers },
        { path: 'receivedLikes', name: 'receivedLikes', component: receivedLikes},
        { path: 'receivedMessages', name: 'receivedMessages', component: receivedMessages}
      ],
      meta: {
        requiresAuth: true                   //在进入页面前判断是否登录
      }
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
