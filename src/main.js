import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import checkLogin from './utils/check-login'
import Vant, { Lazyload, Toast } from 'vant' // 导入vant
import 'dayjs/locale/zh-cn'
import 'amfe-flexible' // 用于设置 rem 基准值 在postcss.config.js中配置
import 'vant/lib/index.css'
import './styles/index.less' // 导入自定义样式

import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'

Vue.use(checkLogin)
Vue.use(Vant)
Vue.use(Toast)
Vue.use(Lazyload)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // dayjs使用中文语言包
Validator.localize('zh_CN', zhCN)

Vue.use(VeeValidate, {
  // 配置改变的时候去触发校验，默认是 input
  // 配置文档：https://baianat.github.io/vee-validate/guide/events.html#changing-default-events
  events: ''
})

// 注册一个全局过滤器
Vue.filter('RelativeTime', function (value) {
  return dayjs().from(value)
})

Vue.config.productionTip = false

// vue原型上添加一个定时器 封装在promise里 方便调用时可以await
Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
