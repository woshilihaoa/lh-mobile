import axios from 'axios'
import store from '@/store/store'
import JSONbig from 'json-bigint'
import router from '@/router'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

request.defaults.transformResponse = [
  function (data) {
    try {
      // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
      return JSONbig.parse(data)
    } catch (err) {
      // 无法转换的数据直接原样返回
      return data
    }
  }
]

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    const { user } = store.state
    // 判断用户数据是否存在 判断是否登录
    // 如果登录了
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  res => {
    // 响应成功进入这里
    return res.data.data || res.data
  },
  async error => {
    // 响应失败进入这里
    if (error.response.status === 401) {
      // 判断有没有user
      const user = store.state.user
      if (!user) {
        return router.push({
          name: 'login'
        })
      }
      try {
        const { data } = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // console.log(data) // 拿到新的登录令牌了
        store.commit('setUser', {
          token: data.data.token,
          refresh_token: user.refresh_token
        })
        // 把因为token过期 的请求再次发出去
        return request(error.config)
      } catch (err) {
        router.push({
          name: 'login'
        })
      }
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default request
