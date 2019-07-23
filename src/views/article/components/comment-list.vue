<template>
  <div class="commentlist">
    <van-list :finished="finished" v-model="loading" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in comment" :key="item.aut_name">
        <div class="usernav">
          <img :src="item.aut_photo" alt />
          <span class="apple">{{ item.aut_name }}</span>
          <van-button
            @click="handlelikecomment(item)"
            class="goodstar"
            type="default"
            :icon="item.is_liking ? 'star' : 'star-o'"
            size="mini"
          >{{ item.like_count }}</van-button>
        </div>
        <div class="content">
          <p>{{ item.content }}</p>
          <span class="time">{{ item.pubdate | RelativeTime }}</span>
          <van-button
            class="goodstar"
            type="default"
            size="mini"
            round
            @click="handleisshow(item)"
          >{{ item.reply_count ? item.reply_count + '回复' : '回复' }}</van-button>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getCommentList, clickCommentLike, unClickCommentLike } from '@/api/comment'
import globalbus from '@/utils/globalbus'

export default {
  name: 'CommentList',
  props: {
    articleList: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      comment: [],
      offset: null,
      isliking: null
    }
  },
  created () {
  },

  methods: {
    async onLoad () {
      await this.$sleep(500)
      try {
        this.loading = true
        const data = await getCommentList(true, this.$route.params.articleId, this.offset)
        this.comment.push(...data.results)
        this.offset = data.last_id
        if (!data.last_id) {
          this.finished = true
        }
      } catch (error) {
        this.$toast.fail('加载失败')
      }
      this.loading = false
      this.finished = true
    },

    handleisshow (item) {
      globalbus.$emit('isShow', true)
      globalbus.$emit('comment', item)
    },

    async handlelikecomment (item) {
      if (!item.is_liking) {
        await clickCommentLike(item.com_id)
        item.is_liking = true
        item.like_count += 1
      } else {
        await unClickCommentLike(item.com_id)
        item.is_liking = false
        item.like_count = -1
        if (item.like_count <= 0) {
          item.like_count = 0
        }
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
</style>
