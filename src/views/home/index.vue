<template>
  <div>
    <van-nav-bar fixed title="首页">
      <van-icon
        class="btnsearch"
        name="search"
        slot="right"
        @click="$router.push({ name: 'search' })"
      ></van-icon>
    </van-nav-bar>
    <!-- activeChannelIndex 使用索引绑定当前激活的标签页 -->
    <van-tabs v-model="activeChannelIndex" class="van-tabs__content">
      <div slot="nav-right" class="icon" @click="isShow = true">
        <van-icon name="wap-nav" />
      </div>
      <van-tab v-for="channelItem in channels" :key="channelItem.id" :title="channelItem.name">
        <!-- 下拉刷新 -->
        <van-pull-refresh
          :success-text="channelItem.downPullSuccessText"
          v-model="channelItem.downPullLoading"
          @refresh="onRefresh"
        >
          <!--
          loading加载中的状态
          finished用来控制是否加载完毕
          @load 加载更多的时候触发的一个事件,会自动调用
          加载数据
          -->
          <van-list
            v-model="channelItem.upPullLoading"
            :finished="channelItem.upPullFinished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="atricleItem in channelItem.articles"
              :key="atricleItem.art_id.toString()"
              :title="atricleItem.title"
              @click="$router.push({ name: 'article', params: { articleId: atricleItem.art_id } })"
            >
              <!-- 文章项 -->
              <div slot="label">
                <van-grid :border="false">
                  <van-grid-item v-for="(item, index) in atricleItem.cover.images" :key="index">
                    <van-image class="atricleImages" :src="item" lazy-load />
                  </van-grid-item>
                </van-grid>
                <p>
                  <span>{{ atricleItem.aut_name }}</span>
                  &nbsp;
                  <span>{{ atricleItem.comm_count }}评论</span>
                  &nbsp;
                  <span>{{ atricleItem.pubdate | RelativeTime }}</span>
                  <van-icon
                    class="icon-more"
                    name="more-o"
                    @click="handleShowMoreAction(atricleItem)"
                  />
                </p>
              </div>
              <!-- /文章项 -->
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>

    <!-- 文章频道 -->
    <HomeChannel v-model="isShow" :channels="channels" :activeIndex.sync="activeChannelIndex" />
    <!-- /文章频道 -->

    <!-- 更多操作 -->
    <MoreAction
      v-model="moreIsShow"
      :activeItem="activeItem"
      @dislike-article="handleDisLikeArticle"
      @dislike-user="handledislikeuser"
    />
    <!-- /更多操作 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticle } from '@/api/article'
import HomeChannel from './components/channel'
import MoreAction from './components/more-action'

export default {
  name: 'HomeIndex',
  components: {
    HomeChannel,
    MoreAction
  },
  data () {
    return {
      activeChannelIndex: 0,
      channels: [], // 存储频道列表
      isShow: false,
      moreIsShow: false,
      activeItem: {}
    }
  },
  computed: { // 计算属性
    // activeChannelIndex当前频道索引
    // 拿到当前频道对象
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },

  created () { // 初始化
    this.loadChannels()
    this.onLoad()
    this.channels.upLoading = true
  },

  watch: { // 监视 凡是 this. 能点出来的成员都可以监视
    // 监视容器中的user
    // 由于路由缓存了 所以要是用户切换了账号,就要重新加载文章
    '$store.state.user' () {
      this.loadChannels()
      this.onLoad()
      this.channels.upLoading = true
    }
  },

  methods: {
    async loadChannels () { // 获取频道列表
      const { user } = this.$store.state
      // 声明一个空数组 存储频道列表
      let channels = []

      if (user) {
        const data = await getUserChannels()
        channels = data.channels
      } else {
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))

        // 如果有本地存储数据则使用本地存储  如果没有则请求获取默认推荐频道列表
        if (localChannels) {
          channels = localChannels
        } else {
          const data = await getUserChannels()
          channels = data.channels
        }
      }
      // 修改channels,(里面只有频道名与id)  因为每个频道对应不同新闻列表
      // 所以要修改数据,方便实现效果
      channels.forEach(item => {
        item.articles = [] // 存储当前文章列表
        item.downPullLoading = false // 控制当前频道的下拉刷新loing状态
        item.upLoading = false // 控制当前频道的上拉加载更多loding状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullSuccessText = ''
      })

      this.channels = channels
    },

    async onLoad () { // 上拉加载更多触发函数
      // 调用定时器
      await this.$sleep(500)
      let data = []
      data = await this.loadArticles()
      // 打印出的pre_timestamp时间戳是下一页的页码(上个时间点推荐的数据)

      // 如果时间戳是空的 并且数组是空的 则没有数据了
      if (!data.pre_timestamp && !data.results.length) {
        this.activeChannel.upPullFinished = true // 显示加载完毕
        this.activeChannel.upPullLoading = false // 取消loding状态
        return
      }

      // 解决初始化的时候没有最新数据的问题
      // 如果是当前时间戳并且长度为空 就把这次请求到的时间戳赋值给当前频道的时间戳
      // 用来请求下一次的数据 并再次发起请求
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        data = await this.loadArticles()
      }
      this.activeChannel.timestamp = data.pre_timestamp
      // 将数据push到{ name: 'home' }直接赋值会变为覆盖
      // (...展开符,把数组里的元素加入到某某里)
      this.activeChannel.articles.push(...data.results)

      this.activeChannel.upPullLoading = false
    },

    async onRefresh () { // 下拉刷新触发函数
      const { activeChannel } = this

      // 更新当前加载的数据的时间戳为最新时间
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()

      // 如果有最新数据,将数据更新到频道的文章列表中
      if (data.results.length) {
        activeChannel.articles = data.results

        // 由于重置了列表,那么你当前数据中的时间戳 就是加载更多下一页的时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'

        this.onLoad()
        this.channels.upLoading = true
      } else {
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      activeChannel.downPullLoading = false
    },

    async loadArticles () { // 获取文章列表
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticle({
        channelId, // 当前激活频道的id
        timestamp, // 当前频道下一页数据的时间戳
        withTop: 1 // 是否包含置顶数据
      })
      return data
    },

    handleShowMoreAction (item) { // 点击按钮弹出更多操作
      this.moreIsShow = true
      this.activeItem = item
    },

    handleDisLikeArticle () { // 文章不感兴趣 直接移除文章
      this.moreIsShow = false
      // activeChannel是当前频道对象(计算属性时定义的)
      // .articles拿到当前频道里的文章
      const articles = this.activeChannel.articles
      // 当前频道里的所有文章进行筛选
      // this.activeItem 当前点击的文章 拿到索引
      const delIndex = articles.findIndex(item => item === this.activeItem)
      // 删除文章所在当前行
      articles.splice(delIndex, 1)
    },

    handledislikeuser () { // 作者不感兴趣 直接移除文章
      this.moreIsShow = false
      const articles = this.activeChannel.articles
      const delIndex = articles.findIndex(item => item === this.activeItem)
      articles.splice(delIndex, 1)
    }
  }
}
</script>

<style>
.van-tabs__content {
  margin-bottom: 100px;
  margin-top: 50px;
}

.van-tabs__wrap {
  position: fixed;
  top: 92px;
}

.van-popup--bottom {
  border-radius: 12px 12px 0 0;
}

.icon {
  position: fixed;
  right: 0;
  margin-top: 15px;
  background-color: #fff;
  padding-left: 5px;
}

.van-tabs__nav--line {
  margin-right: 40px;
}

.van-image img {
  width: 180px;
  height: 180px;
}

.icon-more {
  float: right;
  font-size: 30px;
}

.btnsearch {
  color: #fff !important;
  font-size: 40px;
}
</style>
