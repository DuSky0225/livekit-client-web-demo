<template>
  <div>
    <a-row>
      <a-col :span="6" :offset="9">
        <div style="text-align:center;">
          <a-icon :component="IconCheckCircle" class="success-icon" />
        </div>
        <div class="success-tip">找回密码成功!</div>
        <div style="text-align:center;">
          <span style="color: #1890ff">{{ secondsToLogin }}s</span>
          后跳转到登录页面
        </div>
        <div style="text-align:center;margin-top:10px;">
          <h-button style="margin:5px;" type="primary" @click="toLogin">立即登录</h-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { HButton, HPassword } from 'jpaas-component'
import IconCheckCircle from '@ant-design/icons/svg/fill/check-circle.svg?inline'
// import { findLogoutUrl } from '@/services/login'
import Vue from 'vue'
import Cookies from 'js-cookie'
export default {
  name: 'Forget',
  components: {
    HPassword,
    HButton
  },
  data () {
    return {
      IconCheckCircle,
      secondsToLogin: 5, // 完成后跳转倒计时
      NODE_ENV: process.env.NODE_ENV
    }
  },
  methods: {
    toLogin () {
      if (this.NODE_ENV === 'development') { // 本地模式
        this.$router.push({ name: 'boxLogin' })
      } else { // 按后端返回跳转
        Vue.ls.clear()
        Cookies.remove('access-token')
        this.$router.push({ name: 'boxLogin' })
        // findLogoutUrl().then(res => {
        //   if (res.success) {
        //     const redirectUrl = res.data.logoutUrl
        //     location.href = redirectUrl
        //   }
        // })
      }
    }
  },
  mounted () {
    const _that = this
    const interval = setInterval(() => {
      --_that.secondsToLogin
    }, 1000)
    setTimeout(() => {
      clearInterval(interval)
      _that.toLogin()
    }, _that.secondsToLogin * 1000)
  }
}
</script>

<style lang="less" scoped>
.success-icon {
  width: 80px;
  height: 80px;
  color: #52c41a;
  font-size: 55px;
  line-height: 105px;
}
.success-tip {
  height: 30px;
  margin: 5px 0;
  color: rgba(0, 0, 0, .85);
  font-size: 18px;
  font-weight: bold;
  line-height: 30px;
  text-align: center;
}
</style>
