<template>
  <div class="loginindex">
    <van-nav-bar title="欢迎使用" />
    <van-cell-group>
      <van-field
        v-model="user.mobile"
        left-icon="phone"
        v-validate="'required'"
        name="mobile"
        :error-message="errors.first('mobile')"
        clearable
        label="手机号"
      />

      <van-field
        v-model="user.code"
        left-icon="star"
        v-validate="'required'"
        name="code"
        :error-message="errors.first('code')"
        type="code"
        label="验证码"
        placeholder="请输入验证码"
      />
    </van-cell-group>
    <div class="loginin">
      <!-- <van-button type="info" @click="handellogin">登陆</van-button> -->
      <van-button class="btn" type="info" @click.prevent="handleLogin" :loading="loginLoading">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user.js'

export default {
  name: 'LoginIndex',

  data () {
    return {
      user: {
        mobile: '15041262456',
        code: '246810'
      },
      loginLoading: false // 控制登录请求的 loading 状态
    }
  },
  created () {
    this.configCustomMessages()
  },

  methods: {
    async handleLogin () {
      this.loginLoading = true
      try {
        // 这个插件的 JavaScript 验证方法设计的不好，并没有在验证失败的时候抛出异常
        const valid = await this.$validator.validate()
        // 如果表单验证失败，则什么都不做
        if (!valid) {
          // 验证失败，代码不会往后执行了，所以在这里也要取消 loading
          this.loginLoading = false
          return
        }
        // 表单验证通过，提交表单
        const data = await login(this.user)
        this.$store.commit('setUser', data)

        // 登录成功，跳转到首页
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败！')
      }
      this.loginLoading = false
    },

    configCustomMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: () => '验证码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
    }
  }
}
</script>

<style lang="less">
.van-field__left-icon {
  padding-right: 5px;
  color: #999;
}
.van-button--info {
  width: 100%;
}
.loginin {
  margin-top: 20px;
  text-align: center;
  padding: 0 20px;
}
</style>
