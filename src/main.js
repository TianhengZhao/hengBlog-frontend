// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment'
import axios from './http' // 导入配置了全局拦截器后的 axios

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import './assets/bootstrap-markdown/css/bootstrap-markdown.min.css'
import './assets/bootstrap-markdown/css/custom.css'
import './assets/icon-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios = axios // 将 $axios 挂载到 prototype 上，在组件中可以直接使用 this.$axios 访问
Vue.prototype.$moment = moment // 将 $moment 挂载到 prototype 上，在组件中可以直接使用 this.$moment 访问
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
