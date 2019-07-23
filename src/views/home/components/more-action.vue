<template>
  <div>
    <van-dialog
      :value="value"
      @input="$emit('input',$event)"
      closeOnClickOverlay
      :showConfirmButton="false"
    >
      <div>
        <van-cell-group v-if="show">
          <van-cell
            @click="disLikeArticle"
            icon="close"
            title="不感兴趣"
          />
          <van-cell
            @click="show=false"
            icon="warning-o"
            title="反馈垃圾内容"
            is-link
          />
          <van-cell
            icon="fire-o"
            @click="handleDeleteUser"
            title="拉黑作者"
          />
        </van-cell-group>

        <van-cell-group v-else>
          <van-cell
            icon="arrow-left"
            @click="show=true"
          />
          <van-cell
            v-for="(item, index) in report"
            :key="item"
            @click="handleReport(index)"
            :title="item"
          />
        </van-cell-group>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { disLickArticle, reportAtricle } from '@/api/article'
import { DeleteUser } from '@/api/user'

export default {
  name: 'MoreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    activeItem: {
      type: Object
    }
  },
  data () {
    return {
      show: true,
      report: ['其他问题', '标题夸张', '低俗色情', '错别字多', '旧闻重复', '广告软文', '内容不实', '涉嫌违法范围', '侵权']
    }
  },

  updated () {
    if (!this.value) {
      this.show = true
    }
  },

  methods: {
    async disLikeArticle () { // 不敢兴趣
      try {
        await disLickArticle(this.activeItem.art_id)
        this.$emit('dislike-article')
        this.$toast('操作成功')
      } catch (err) {
        console.log(err)
        this.$toast('操作失败')
      }
    },

    async handleDeleteUser () { // 拉黑作者
      try {
        await DeleteUser(this.activeItem.aut_id)
        this.$emit('dislike-user', false)
        this.$toast('操作成功')
      } catch (err) {
        this.$toast('操作失败')
        console.log(err)
      }
    },

    async handleReport (type) { // 反馈垃圾内容
      const atricleId = this.activeItem.art_id
      // console.log(this.activeItem.art_id)
      try {
        await reportAtricle(atricleId, type)
        this.$emit('input', false)
        this.$toast('举报成功')
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.$toast('该文章已被举报过')
        } else {
          this.$toast('操作失败')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
