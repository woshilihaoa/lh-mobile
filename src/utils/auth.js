const USER_KEY = 'user'

export const getUser = () => { // 获取
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

export const saveUser = (data) => { // 存储
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const removeUser = () => { // 删除
  window.localStorage.removeItem(USER_KEY)
}
