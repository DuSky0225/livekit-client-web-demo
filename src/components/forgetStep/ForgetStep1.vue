<template>
  <div style="max-width: 300px; margin: 40px auto 0;">
    <a-form
      :form="form"
      layout="horizontal"
    >
      <a-form-item
        label="登录账号"
      >
        <a-input
          placeholder="请输入用户名/手机号/邮箱"
          :maxLength="100"
          v-decorator="['account', { rules: [{required: true, message: '请输入您的用户名/手机号/邮箱'}] }]"
        />
      </a-form-item>
      <a-form-item
        label="验证码"
        has-feedback
      >
        <a-input
          size="large"
          type="text"
          placeholder="请填写图形验证码"
          :maxLength="4"
          @focus.stop.prevent="loadCaptcha"
          v-decorator="[
            'imgCode',
            {rules: [{ required: true, message: '请输入验证码' },{validator:checkImgCaptcha }]}
          ]"
        >
          <a-icon slot="prefix" :component="IconSafety" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
        <a-tooltip title="点击刷新验证码">
          <img v-show="imgShow" alt="" class="imgCaptcha" @click.stop.prevent="refreshCaptcha" />
        </a-tooltip>
      </a-form-item>
      <a-form-item>
        <h-button style="margin:5px;" type="primary" @click="nextStep">下一步</h-button>
        <h-button style="margin:5px;" @click="backLogin">返回</h-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {tools} from '@/tools/tool'
import { HButton } from 'jpaas-component'
import { accountAPI } from '@/services/account'
import IconSafety from '@ant-design/icons/svg/outline/safety.svg?inline'
// import { findLogoutUrl } from '@/services/login'

export default {
  name: 'Forget',
  components: {
    HButton,
    accountAPI
  },
  data () {
    return {
      IconSafety,
      form: this.$form.createForm(this),
      imgToken: '',
      pubk: '',
      imgShow: '',
      NODE_ENV: process.env.NODE_ENV
    }
  },
  methods: {
    nextStep () {
      const {
        form: { validateFields }
      } = this
      validateFields((err, values) => {
        if (!err) {
          const parameter = {
            verifyCodeId: this.imgToken,
            account: tools.encrypt(values.account, this.pubk)
          }
          accountAPI.findUserAuthinfo(parameter).then(res => {
            if (res.success) {
              if (res.data.status === 3) {
                this.$emit('setLastData', res.data)
                this.$emit('nextStep')
              } else if (res.data.status === 2) {
                let secondsToGo = 5
                const _that = this
                let isTrue = true
                const modal = this.$confirm({
                  title: '您的账号尚未激活，无法执行忘记密码流程！',
                  content: `倒计时 ${secondsToGo}s跳转用户激活页面`,
                  onOk () {
                    _that.$router.push({ path: '/user/setting/activation' })
                  },
                  onCancel () {
                    isTrue = false
                    _that.btnDisabled = false
                  }
                })
                const interval = setInterval(() => {
                  --secondsToGo
                  modal.update({
                    content: `倒计时 ${secondsToGo}s跳转用户激活页面`
                  })
                }, 1000)
                setTimeout(() => {
                  if (isTrue) {
                    clearInterval(interval)
                    this.$router.push({ path: '/user/setting/activation' })
                    modal.destroy()
                  }
                }, secondsToGo * 1000)
              }
            }
          })
        }
      })
    },
    backLogin () {
      if (this.NODE_ENV === 'development') { // 本地模式
        this.$router.push({ name: 'boxLogin' })
      } else { // 按后端返回跳转
        this.$router.push({ name: 'boxLogin' })
      }
    },
    refreshCaptcha () {
      // 刷新验证码
      accountAPI.getTokens({ num: 1 }).then(res => {
        this.imgShow = true
        if (res.success) {
          this.imgToken = res.data.tokens[0]
          document.querySelector('.imgCaptcha').src =
            '/api-gateway/common-captcha-server/interface/code/imageCode?token=' + this.imgToken
        }
      })
    },
    loadCaptcha () {
      if (!document.querySelector('.imgCaptcha').src) {
        this.refreshCaptcha()
      }
    },
    checkImgCaptcha (rule, value, callback) {
      if (value === '' || value === undefined || value === null) {
        callback()
      } else if (value.length !== 4) {
        callback(new Error('请输入四位验证码!'))
      } else {
        const queryData = {
          inputcode: value,
          token: this.imgToken
        }
        accountAPI.checkCode(queryData).then(res => {
          this.imgToken = res.data.token
          if (res.success) {
            callback()
          } else {
            callback(new Error('请输入正确的验证码!'))
            this.$nextTick(() => {
              this.refreshCaptcha()
            })
          }
        })
      }
    }
  },
  mounted () {
    // 获取修改密码时的加密公钥
    accountAPI.getOpenPubk().then(res => {
      if (res.success) {
        this.pubk = res.data.pubk
      }
    })
  }
}
</script>

<style lang="less" scoped>
.imgCaptcha {
  position: absolute;
  top: -6px;
  right: 30px;
  width: 80px;
  height: 30px;
  background-size: 80px 30px;
  cursor: pointer;
}
</style>
