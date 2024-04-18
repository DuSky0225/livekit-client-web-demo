<template>
  <div>
    <a-row>
      <a-col :span="24" v-if="isChangeModifiedMode">
        <div style="margin:5px;font-size:18px;">正在为您找回密码, 请选择身份验证方式:</div>
        <a-alert style="margin:10px 0px;" message="友情提示：当通过以下方式验证身份时，无法接收到验证码，请尽快联系管理员修改个人信息。" type="info" closable />
        <a-card v-if="mpushState" style="margin:20px 0px;" >
          <div class="pwd-card-con">
            <div style="float: left;" class="pwd-card-container">
              <div class="pwd-card-label"><strong>通过 手机验证码</strong></div>
              <div style="clear: both;"></div>
              <div class="pwd-card-description">您已绑定手机号{{ lastData.mobile }}，请选择此方式</div>
            </div>
            <h-button type="primary" class="pwd-card-button" @click="modifyBy('mobile')">立即验证</h-button>
          </div>
        </a-card>
        <a-card v-if="mpushState" style="margin:20px 0px;">
          <div class="pwd-card-con">
            <div style="float: left;" class="pwd-card-container">
              <div class="pwd-card-label"><strong>通过 邮箱验证码</strong></div>
              <div style="clear: both;"></div>
              <div class="pwd-card-description">您已绑定邮箱号{{ lastData.email }}，请选择此方式</div>
            </div>
            <h-button type="primary" class="pwd-card-button" @click="modifyBy('mail')">立即验证</h-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12" :offset="6" v-if="!isChangeModifiedMode" style="margin-top:30px;">
        <a-form
          :form="form"
          layout="horizontal"
        >
          <p v-if="isMobile">手机号:{{ lastData.mobile }}</p>
          <a-row v-if="isMobile">
            <a-col :span="16">
              <a-form-item :span="24" has-feedback>
                <a-input
                  placeholder="短信验证码"
                  :maxLength="6"
                  v-decorator="['PYZM', { rules: [{required: true, message: '请输入验证码'},{validator:checkCaptcha }]}]"
                  style="width:95%;"
                >
                  <a-icon slot="prefix" :component="IconMobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <h-button
                @click="getPYZM"
                :disabled="btnDisabled"
                style="margin-top:3px;"
              >
                <span >{{ btnDisabled && smsTime + '(s)' || '获取验证码' }}</span>
              </h-button>
            </a-col>
          </a-row>

          <p v-if="!isMobile">邮箱号:{{ lastData.email }}</p>
          <a-row v-if="!isMobile">
            <a-col :span="16">
              <a-form-item :span="24" has-feedback>
                <a-input
                  placeholder="邮箱验证码"
                  :maxLength="6"
                  v-decorator="['YXYZM', { rules: [{required: true, message: '请输入验证码'},{validator:checkCaptcha }]}]"
                  style="width:95%;"
                >
                  <a-icon slot="prefix" :component="IconMail" :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <h-button
                @click="getYXYZM"
                :disabled="btnDisabled"
                style="margin-top:3px;"
              >
                <span >{{ btnDisabled && smsTime + '(s)' || '获取验证码' }}</span>
              </h-button>
            </a-col>
          </a-row>
          <a-form-item style="margin-top:10px;">
            <h-button style="margin:5px;" type="primary" @click="nextStep">下一步</h-button>
            <a style="margin:5px;" @click="changeModifiedMode" href="javascript:;">更换其他的验证方式</a>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="12" :offset="21" >
        <h-button @click="backStep">返回</h-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { HButton, HPassword } from 'jpaas-component'
import { accountAPI } from '@/services/account'
import IconMobile from '@ant-design/icons/svg/outline/mobile.svg?inline'
import IconMail from '@ant-design/icons/svg/outline/mail.svg?inline'
import { getLoginProp } from '@/services/login'
export default {
  name: 'Forget',
  components: {
    HPassword,
    HButton,
    accountAPI
  },
  data () {
    return {
      IconMobile,
      IconMail,
      isChangeModifiedMode: true,
      isMobile: true,
      form: this.$form.createForm(this),
      smsTime: 60, // 禁止点击时间
      btnDisabled: false, // 验证码按钮状态
      token: '',
      mpushState: 2
    }
  },
  props: {
    lastData: {
      type: Object,
      default: null
    }
  },
  methods: {
    async getmpushState () {
      const res = await getLoginProp()
      this.mpushState = res.data.mpushState || 0
    },
    nextStep () {
      accountAPI.checkVerifyCode({ verifyCodeId: this.token, ticket: this.lastData.ticket }).then((res) => {
        if (res.success) {
          this.$emit('setTicket', this.lastData.ticket)
          this.$emit('nextStep')
        }
      })
    },
    backStep() {
      this.$emit('pref')
    },
    modifyBy (item) {
      console.log('进入了')
      this.changeModifiedMode()
      if (item === 'mail') {
        this.isMobile = false
      } else {
        this.isMobile = true
      }
    },
    changeModifiedMode () {
      this.isChangeModifiedMode = !this.isChangeModifiedMode
    },
    checkCaptcha (rule, value, callback) {
      if (value === '' || value === undefined || value === null) {
        callback()
      } else if (value.length !== 6) {
        callback(new Error('请输入六位验证码!'))
      } else {
        const queryData = {
          inputcode: value,
          token: this.token
        }
        accountAPI.checkCode(queryData).then(res => {
          this.token = res.data.token
          if (res.success) {
            callback()
          } else {
            callback(new Error('请输入正确的验证码!'))
          }
        })
      }
    },
    // 获取手机验证码
    getPYZM () {
      this.btnDisabled = true
      this.smsTime = 60
      const time = window.setInterval(() => {
        if (this.smsTime-- <= 0) {
          window.clearInterval(time)
          this.btnDisabled = false
          this.smsTime = 60
        }
      }, 1000)
      accountAPI.findMobileCode({ ticket: this.lastData.ticket }).then(res => {
        if (res.success) {
          // 用户账号状态校验
          if (res.data.result) { // 发送验证码成功
            this.token = res.data.token
          } else { // 发送验证码失败
            this.$notification.error({
              message: '失败',
              description: res.data.unsentReason || '请求验证码失败'
            })
            window.clearInterval(time)
            this.btnDisabled = false
          }
        } else {
          window.clearInterval(time)
          this.btnDisabled = false
        }
      })
    },
    getYXYZM () {
      this.btnDisabled = true
      this.smsTime = 60
      const time = window.setInterval(() => {
        if (this.smsTime-- <= 0) {
          window.clearInterval(time)
          this.btnDisabled = false
          this.smsTime = 60
        }
      }, 1000)
      accountAPI.findEmailCode({ ticket: this.lastData.ticket }).then(res => {
        if (res.success) {
          // 用户账号状态校验
          if (res.data.result) { // 发送验证码成功
            this.token = res.data.token
          } else { // 发送验证码失败
            this.$notification.error({
              message: '失败',
              description: res.data.unsentReason || '请求验证码失败'
            })
            window.clearInterval(time)
            this.btnDisabled = false
          }
        } else {
          window.clearInterval(time)
          this.btnDisabled = false
        }
      })
    }
  },
  mounted () {
    this.getmpushState()
  }
}
</script>

<style lang="less" scoped>
  .pwd-card-icon, .pwd-card-label {
    float: left;
  }
  .pwd-card-icon {
    width: 80px;
    height: 80px;
    line-height: 80px;
    font-size: 80px;
  }
  .pwd-card-button {
    float: right;
    margin: 24px 0;
    font-size: 15px;
  }
  .pwd-card-con {
    overflow: hidden;
  }
  .pwd-card-label {
    height: 20px;
    line-height: 20px;
    margin: 30px;
    margin-right: 0;
    font-size: 18px;
    cursor: default;
  }
  .pwd-card-container .pwd-card-label {
    margin: 15px 0 15px 30px;
  }
  .pwd-card-container .pwd-card-description {
    line-height: 30px;
    color: #666;
    font-size: 14px;
    height: 30px;
    margin-left: 30px;
  }
</style>
