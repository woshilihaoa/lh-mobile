<template>
  <div class="authinfo">
    <div>
      <img :src="articleList.aut_photo" alt />
      <div class="info">
        <p>{{ articleList.aut_name }}</p>
        <p>{{ articleList.pubdate | RelativeTime}}</p>
      </div>
      <van-button
        @click="handleIsFollo"
        :type="articleList.is_followed ? 'default' : 'danger'"
      >{{ articleList.is_followed ? '已关注' : '关注' }}</van-button>
    </div>
  </div>
</template>

<script>
import { CancelFollo, FolloUser } from '@/api/user'

export default {
  name: 'AuthInfo',
  props: {
    articleList: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      isloading: false
    }
  },
  created () {
  },

  methods: {
    async handleIsFollo () { // 点击关注按钮
      console.log(1)
      if (!this.$checkLogin) {
        return
      }
      try {
        if (!this.$checkLogin()) {
          return console.log(1)
        }
        if (this.articleList.is_followed) {
          await CancelFollo(this.articleList.aut_id)
          this.articleList.is_followed = false
          this.$toast.success('已取消关注')
        } else {
          await FolloUser(this.articleList.aut_id)
          this.articleList.is_followed = true
          this.$toast.success('已关注')
        }
      } catch (err) {
      }
    }
  }
}
</script>

<style lang="less">
.authinfo {
  height: 120px;
  padding: 20px;
  background-color: rgb(243, 257, 257);
  border-radius: 20px;
  img {
    width: 120px;
    height: 120px;
    float: left;
    border-radius: 50%;
  }
  .van-button--danger,
  .van-button--default {
    float: right;
    margin-top: 10px;
    width: 150px;
  }
  .info {
    float: left;
    margin-left: 20px;
    height: 120px;
    line-height: 60px;
    p {
      font-size: 26px;
      padding: 0;
      margin: 0;
    }
  }
}
.van-icon-arrow-left,
.van-nav-bar__arrow {
  color: #fff !important;
}
</style>
