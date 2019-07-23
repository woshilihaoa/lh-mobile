// 封装文章相关接口请求函数
import request from '@/utils/request'

// 已经登录 : 用户频道文章列表
// 未登录 : 推荐频道文章列表
export const getArticle = ({ channelId, timestamp, withTop }) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId, // 频道ID
      timestamp, // 时间戳(分页用)
      with_top: withTop // 是否包含置顶数据 1/0
    }
  })
}

// 反馈垃圾内容
export const reportAtricle = (atricleId, type, remark = '') => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: atricleId,
      type, // 举报类型
      remark // 其他问题 的附加说明
    }
  })
}

// 获取新闻文章详情
export const getArticleDetails = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

// 对文章点赞
export const likeAtricle = atricleId => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/likings`,
    data: {
      target: atricleId
    }
  })
}

// 取消对文章点赞
export const unLikeAtricle = atricleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${atricleId}`
  })
}

// 对文章不喜欢
export const disLickArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 取消对文章不喜欢
export const unDisLickArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/dislikes/${articleId}`
  })
}
