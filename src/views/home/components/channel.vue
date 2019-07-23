<template>
  <div>
    <van-popup
      :value="value"
      @input="$emit('input',$event)"
      position="bottom"
      :style="{ height: '93%' }"
    >
      <div>
        <div class="my-channel">
          我的频道
          <span class="channel-hint">点击进入频道</span>
          <van-button
            class="edit-btn"
            type="primary"
            size="small"
            round
            @click="btnEdit=!btnEdit"
          >{{ btnEdit ? '完成' : '编辑' }}</van-button>
        </div>
        <van-grid>
          <van-grid-item v-for="(channelItem, index) in channels " :key="channelItem.id">
            <span
              :class="btnEdit? '' : index == activeIndex && 'red'"
              slot="text"
              class="list"
              @click="handleDeleteChannel(channelItem,index)"
            >
              {{ channelItem.name }}
              <van-icon
                v-show="btnEdit && !channelName.includes(channelItem.name)"
                class="icon-close"
                name="close"
              />
            </span>
          </van-grid-item>
        </van-grid>
      </div>

      <div>
        <div class="my-channel">
          频道推荐
          <span class="channel-hint">点击添加频道</span>
        </div>
        <van-grid>
          <van-grid-item
            icon="plus"
            v-for="item in recommendChannels"
            @click="handleAddChannel(item)"
            :key="item.id"
          >
            <span slot="text" class="list">{{ item.name }}</span>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels, deleteUserChannels, resetUserChannels } from '@/api/channel'
import { mapState } from 'vuex'

export default {
  name: 'HomeChannel',
  props: {
    value: { // 控制是否显示频道栏
      type: Boolean,
      default: false
    },
    channels: { // 用户频道列表
      type: Array,
      default: () => []
    },
    activeIndex: { // 当前用户频道索引
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      btnEdit: false,
      allchannels: [],
      channelName: ['推荐']
    }
  },

  computed: {
    recommendChannels () { // 拿到筛选后的所有数据(不包含用户频道的)
      const duplicates = this.channels.map(item => item.id)
      return this.allchannels.filter(item => !duplicates.includes(item.id))
    },

    // vuex的一个方法,用来将 state中的数据映射到组件的计算属性中
    // user = this.$store.state.user
    ...mapState(['user'])
  },

  created () {
    this.loadAllChannels()
  },

  methods: {

    // 获取所有频道列表
    async loadAllChannels () {
      const data = await getAllChannels()
      data.channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.allchannels = data.channels
    },

    async handleAddChannel (item) { // 添加频道
      this.channels.push(item)
      if (this.user) {
        // 已登录
        const data = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        await resetUserChannels(data)
      }

      // 未登录 保持到本地
      window.localStorage.setItem('channels', JSON.stringify(this.channels))
    },

    changeChannel (item, index) { // 非编辑
      this.$emit('update:activeIndex', index)
      this.$emit('input', false)
    },

    async deleteChannel (item, index) { // 编辑状态
      this.channels.splice(index, 1)
      if (this.user) {
        // 如果登录了 发送请求删除
        await deleteUserChannels(item.id)
      } else {
        // 没登录 删除本地存储(就是覆盖掉)
        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    },

    handleDeleteChannel (item, index) {
      if (!this.btnEdit) {
        // 非编辑状态
        this.changeChannel(item, index)
      } else {
        // 编辑状态
        // this.deleteChannel(item, index)
        !this.channelName.includes(item.name) && this.deleteChannel(item, index)
      }
    }
  }
}

</script>

<style>
.edit-btn {
  float: right;
}

.my-channel {
  padding: 20px 20px;
  height: 60px;
  line-height: 60px;
  font-size: 35px;
  font-weight: 700;
}

.list {
  font-size: 16px;
}

.red {
  color: red;
}

.channel-hint {
  font-size: 8px;
  font-weight: 400;
  color: #999;
  margin-left: 10px;
}

.icon-close {
  position: absolute;
  right: 5px;
  top: 5px;
}

.van-grid-item__content .van-icon-plus {
  font-size: 30px;
  margin-bottom: 10px;
}
</style>
