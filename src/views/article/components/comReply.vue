<template>
  <div>
    <van-popup v-model="show" round position="bottom" :style="{ height: '80%' }">
      <van-nav-bar title="回复" />
      <van-list :finished="finished" v-model="loading" finished-text="没有更多了" @load="onLoad">
        <van-cell>
          <div class="usernav">
            <img :src="comment.aut_photo" alt />
            <span class="apple">{{ comment.aut_name }}</span>
            <van-tag>楼主</van-tag>
            <van-button
              class="goodstar"
              type="default"
              :icon="comment.is_liking ? 'star' : 'star-o'"
              size="mini"
            >{{ comment.like_count }}</van-button>
          </div>
          <div class="content">
            <p>{{ comment.content }}</p>
            <span class="time">{{ comment.pubdate | RelativeTime }}</span>
          </div>
        </van-cell>

        <!-- <van-cell v-for="item in replycommentList" :key="item.aut_name">
          <div class="usernav">
            <img :src="item.aut_photo" alt />
            <span class="apple">{{ item.aut_name }}</span>
            <van-button
              class="goodstar"
              type="default"
              :icon="item.is_liking ? 'star' : 'star-o'"
              size="mini"
            >{{ item.like_count }}</van-button>
          </div>
          <div class="content">
            <p>{{ item.content }}</p>
            <span class="time">{{ item.pubdate | RelativeTime }}</span>
          </div>
        </van-cell>-->
      </van-list>
      <AddComment />
    </van-popup>
  </div>
</template>

<script>
import globalbus from '@/utils/globalbus'
import { getCommentList } from '@/api/comment'
import AddComment from './addcomment'

export default {
  name: 'ComReply',
  components: {
    AddComment
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      show: false,
      offset: null,
      comment: {},
      replycommentList: {}
    }
  },
  created () {
    globalbus.$on('isShow', (data) => {
      this.show = data
    })

    globalbus.$on('comment', (data) => {
      this.comment = data
    })
  },

  deactivated () { // 离开时销毁当前组件
    this.$destroy()
  },

  methods: {
    async onLoad () {
      const data = await getCommentList(false, parseInt(this.comment.com_id), this.offset)
      if (!data.results.length) {
        this.finished = true
        this.loading = false
      } else {
        this.replycommentList = data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.commentlist {
  margin-top: 100px;
  margin-bottom: 100px;
}

.usernav {
  height: 70px;
  padding-bottom: 10px;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    float: left;
  }
  .apple {
    margin-left: 20px;
    margin-top: 14px;
    float: left;
    color: rgb(168, 148, 148);
  }
  .goodstar {
    float: right;
    margin-top: 15px;
  }
  .good {
    font-size: 10px;
    float: right;
    margin-top: 12px;
    margin-left: 10px;
  }
}
.content {
  margin-left: 70px;
  .time {
    margin-right: 30px;
    font-size: 8px;
    color: rgb(105, 92, 92);
  }
}

.van-icon-star {
  color: red;
}

.van-tag {
  margin-top: 15px;
  margin-left: 20px;
}
</style>
