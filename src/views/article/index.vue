<template>
  <div class="article">
    <!-- 头部导航 -->
    <van-nav-bar title="文章详情" left-text="返回" left-arrow @click-left="$router.back()" />
    <!-- /头部导航 -->

    <div class="articlebody">
      <!-- 文章标题 -->
      <h2 class="articletitle">{{ articleList.title }}</h2>
      <!-- /文章标题 -->

      <!-- 作者信息 -->
      <AuthInfo :articleList="articleList" />
      <!-- /作者信息 -->

      <!-- 文章内容 -->
      <div :articleList="articleList" class="article-content" v-html="articleList.content"></div>
      <!-- /文章内容 -->

      <!-- 两个更多操作的按钮 -->
      <MoreArticle :articleList="articleList" />
      <!-- /两个更多操作的按钮 -->

      <!-- 评论列表 -->
      <CommentList :articleList="articleList" />
      <!-- /评论列表 -->

      <!-- 回复 -->
      <ComReply />
      <!-- /回复 -->

      <!-- 发表评论 -->
      <AddComment />
      <!-- /发表评论 -->
    </div>
  </div>
</template>

<script>
import AuthInfo from './components/auth-info'
import MoreArticle from './components/more-article'
import CommentList from './components/comment-list'
import { getArticleDetails } from '@/api/article'
import ComReply from './components/comReply'
import AddComment from './components/addcomment'

export default {
  name: 'ArticleIndex',
  components: {
    AuthInfo,
    MoreArticle,
    CommentList,
    ComReply,
    AddComment
  },
  data () {
    return {
      articleList: {}
    }
  },

  created () {
    this.getArticleList()
  },

  deactivated () {
    this.$destroy()
  },

  methods: {
    async getArticleList () {
      try {
        this.$toast.loading({
          mask: true,
          duration: 0, // 持续展示 toast
          message: '加载中...'
        })
        const data = await getArticleDetails(this.$route.params.articleId)
        this.articleList = data
      } catch (error) {
        this.$toast.fail('加载失败')
      }
      this.$toast.clear()
    }

  }
}
</script>

<style lang="less" scoped>
.van-nav-bar__text {
  color: #fff;
}

.articlebody {
  padding: 50px 50px;
  padding-top: 100px;
}

.articletitle {
  font-size: 50px;
  font-weight: 400;
}

.article-content {
  font-size: 32px;
  margin-top: 50px;
}

.van-nav-bar {
  position: fixed;
  width: 100%;
  top: 0;
}
</style>
