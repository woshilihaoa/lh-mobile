<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar title="搜索结果" fixed left-arrow @click-left="$router.back()" />
    <!-- /标题 -->

    <!-- 文章列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell
        v-for="item in searchList"
        :key="item.art_id"
        @click="$router.push({name:'article',params: {articleId: item.art_id}})"
      >
        <div slot="title">
          <span class="searchTitle">{{ item.title }}</span>
          <van-grid :border="false" :column-num="3">
            <van-grid-item v-for="(img, index) in item.cover.images" :key="index">
              <van-image src="https://img.yzcdn.cn/vant/apple-1.jpg" />
            </van-grid-item>
          </van-grid>
          <div class="timeanddate">
            <span>{{ item.aut_name }}</span>&nbsp;
            <span>评论 {{ item.comm_count }}</span>&nbsp;
            <span>{{ item.pubdate | RelativeTime }}</span>&nbsp;
            <span class="icon-default-star">
              <van-button
                icon="comment-o"
                type="default"
                size="mini"
                @click="$isLogin() && commentAtricle(item)"
              />
              <van-button
                icon="star-o"
                type="default"
                size="mini"
                @click="$isLogin() && clickLikeAtricle(item)"
              />
            </span>
          </div>
        </div>
      </van-cell>
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
import { likeAtricle } from '@/api/article'

export default {
  name: 'SerachResult',

  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      searchList: [],
      star: null
    }
  },
  created () {
    console.log(this.searchList)
  },

  deactivated () { // 离开页面时销毁数据 防止缓存
    this.$destroy()
  },

  methods: {

    async onLoad () { // 加载搜索结果列表
      await this.$sleep(500)
      const data = await getSearch(this.page, this.$route.params.q)
      if (!data.results.length) {
        this.loading = false
        this.finished = true
      } else {
        this.searchList.push(...data.results)
        this.page++
        this.loading = false
      }
    },

    async clickLikeAtricle (actId) {
      // console.log(actId)
      await likeAtricle(actId.art_id)
      this.star = true
    }
  }
}
</script>

<style scoped>
.van-nav-bar__text,
.van-icon-arrow-left {
  color: #fff;
}
.van-list {
  margin-top: 94px;
  margin-bottom: 100px;
}

.timeanddate {
  color: #999;
  font-size: 12px;
}

.searchTitle {
  font-size: 30px;
}

.icon-default-star {
  float: right;
}
</style>
