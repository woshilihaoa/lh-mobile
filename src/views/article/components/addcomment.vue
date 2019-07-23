<template>
  <div class="search">
    <form action="/">
      <van-search v-model="value" left-icon placeholder="请输入回复内容" show-action @search="onSearch">
        <div slot="action" @click="onSearch">回复</div>
      </van-search>
    </form>
  </div>
</template>

<script>
import { replyComment } from '@/api/comment'

export default {
  name: 'AddComment',

  data () {
    return {
      value: ''
    }
  },

  methods: {
    async onSearch () {
      if (!this.$checkLogin) {
        return
      }
      try {
        await replyComment(this.$route.params.articleId, this.value)
      } catch (error) {
        this.$toast.fail('加载失败')
      }
    }
  }
}
</script>

<style>
.search {
  position: fixed;
  bottom: 0;
}

.van-search--show-action {
  width: 660px;
  padding-bottom: 30px;
}
</style>
