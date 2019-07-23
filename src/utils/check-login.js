import router from '../router/index'
import store from '../store/store'
import { Dialog } from 'vant'

export default {
  install (Vue, options) {
    Vue.prototype.$checkLogin = checkLogin
  }
}
function checkLogin () {
  // 校验登录状态
  if (store.state.user) {
    return true
  }
  Dialog.confirm({
    message: '该操作需要登录,是否调整到登录页?'
  })
    .then(() => {
      router.push({
        name: 'login',
        query: {
          // 跳转登录页时 记录下当前页的url 并传给登录页
          redirect: router.currentRoute.fullPath
        }
      })
    })
    .catch(() => {})
  return false
}
