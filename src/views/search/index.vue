<template>
  <div>
    <!-- 搜索 -->
    <form action="/">
      <van-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        @search="handleSearch(searchText)"
        show-action
        @cancel="$router.back()"
      />
      <!-- /搜索 -->
    </form>

    <!-- 联想建议 -->
    <van-cell-group v-if="suggestShow">
      <van-cell
        v-for="(item,index) in suggestList.options"
        @click="handleSearch(item)"
        :key="index"
        icon="search"
      >
        <div slot="title" v-html="highlight(item,searchText)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell class="lsjl" icon="search">
        历史记录
        <van-icon
          v-if="deleteicon"
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          @click="deleteicon=false"
        />
        <van-button class="isokbtn" @click="deleteicon=true" v-else size="mini">完成</van-button>
        <van-button class="isokbtn" v-show="!deleteicon" size="mini">全部删除</van-button>
      </van-cell>
      <van-cell
        v-for="(item,index) in SearchHistories"
        @click="handleSearch(item)"
        :key="index"
        :title="item"
      >
        <van-icon name="close" v-show="!deleteicon" @click="hanDledeleteHistory(item)" />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import { searchTextSuggest, searchHistories } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '', // 当前输入框内容
      suggestList: {}, // 存储当前联想搜索数据
      SearchHistories: [],
      suggestShow: false,
      deleteicon: true
    }
  },
  watch: {
    searchText: debounce(async function (newval) {
      newval = newval.trim() // 去掉首尾空格
      if (!newval.length) {
        this.suggestList = {}
        this.suggestShow = false
      } else {
        this.suggestShow = true
        try {
          const data = await searchTextSuggest(this.searchText)
          this.suggestList = data
        } catch (err) {
          console.log(err)
        }
      }
    }, 800)
  },

  created () {
    this.getUserSearchHistories()
  },

  deactivated () { // 离开页面时销毁数据 防止缓存
    this.$destroy()
  },

  methods: {
    async getUserSearchHistories () { // 获取历史记录
      const data = await searchHistories()
      this.SearchHistories = data.keywords
    },

    handleSearch (text) { // 获取搜索结果
      if (text.length) {
        if (this.deleteicon) {
          this.$router.push({
            name: 'serach-result',
            params: {
              q: text
            }
          })
          this.searchText = ''
        }
      } else {
        this.$toast.fail('输入框不能为空')
      }
    },

    highlight (text, keyword) { // 联想搜索结果  未完 以后完善
      if (this.suggestList.options.length) {
        console.log(this.suggestList.options.length)
        return text.toLowerCase().split(keyword)
          .join(`<span style="color: red">${keyword}</span>`)
      }
      console.log(this.suggestList.options.length)
      return `<p>123</p>`
    },

    hanDledeleteHistory (item) {
      this.SearchHistories.splice(item, 1)
    }
  }
}
</script>

<style scoped>
.lsjl {
  font-weight: 700;
  /* font-size: 30px; */
}

.isokbtn {
  float: right;
  margin-left: 20px;
  color: #999;
}
</style>
