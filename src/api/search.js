import request from '@/utils/request'

// 文章联想建议
export const searchTextSuggest = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q // 请求的前缀词句
    }
  })
}

// 文章搜索历史
export const searchHistories = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}

// 获取搜索结果
export const getSearch = (page, q) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page,
      q
    }
  })
}
