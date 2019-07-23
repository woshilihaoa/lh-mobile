<template>
  <div class="morearticle">
    <van-button
      class="clickgood"
      round
      :icon="isLike ? 'like' : 'like-o'"
      :loading="islikeloading"
      type="info"
      @click="handleclickgood"
    >{{ isLike ? '取消点赞' : '点赞' }}</van-button>
    <van-button
      round
      :icon="isDislike ? 'delete' : 'volume-o'"
      :loading="isDislikeLoading"
      type="info"
      @click="handleDislike"
    >{{ isDislike ? '取消' : '不喜欢' }}</van-button>
  </div>
</template>

<script>
import { likeAtricle, unLikeAtricle, disLickArticle, unDisLickArticle } from '@/api/article'

export default {
  name: 'MoreArticle',
  props: {
    articleList: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      islikeloading: false,
      isDislikeLoading: false
    }
  },

  computed: {
    isLike () {
      return this.articleList.attitude === 1
    },
    isDislike () {
      return this.articleList.attitude === 0
    }
  },
  methods: {
    async handleclickgood () { // 点赞
      if (!this.$checkLogin()) {
        return
      }
      this.islikeloading = true
      try {
        const articleId = this.articleList.art_id
        if (this.isLike) {
          await unLikeAtricle(articleId)
          this.articleList.attitude = 0
        } else {
          await likeAtricle(articleId)
          this.articleList.attitude = 1
        }
        this.islikeloading = false
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      this.islikeloading = false
    },

    async handleDislike () { // 喜欢
      if (!this.$checkLogin()) {
        return
      }
      try {
        this.isDislikeLoading = true
        const articleId = this.articleList.art_id
        if (!this.isDislike) {
          await unDisLickArticle(articleId)
          this.articleList.attitude = 0
        } else {
          await disLickArticle(articleId)
          this.articleList.attitude = 1
        }
      } catch (error) {
        this.$toast.fail('操作失败')
      }
      this.isDislikeLoading = false
    }
  }
}
</script>

<style scoped>
.morearticle {
  text-align: center;
}

.van-button {
  width: 220px;
  margin-top: 100px;
  margin-left: 50px;
}

.clickgood {
  margin: 0;
}
</style>
