// 封装频道相关接口请求函数
import request from '@/utils/request'

// 已经登录 : 用户频道列表
// 未登录 : 推荐频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取全部频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 删除用户频道列表
export const deleteUserChannels = (channelsId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelsId}`
  })
}

// 批量修改用户频道列表(重置)
export const resetUserChannels = channels => {
  return request({
    method: 'PUT',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}
