// 评论相关接口请求函数
import request from '@/utils/request'

// 评论
export const getCommentList = (aandc, source, offset) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params: {
      type: aandc ? 'a' : 'c',
      source,
      offset
    }
  })
}

// 对评论或评论回复点赞
export const clickCommentLike = commentId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

// 取消对评论或评论回复点赞
export const unClickCommentLike = commentId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${commentId}`
  })
}

// 评论文章
export const replyComment = (articleId, content) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data: {
      target: articleId,
      content
    }
  })
}
