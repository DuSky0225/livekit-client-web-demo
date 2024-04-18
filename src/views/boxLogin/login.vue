<template>
  <div class="loginLayout">
    <div class="loginIndex">
      <div class="logoImg">
        <img class="logoIcon" :src="$basic.jmeetingIcon ? $basic.jmeetingIcon : require('@/assets/meeting/company.png')"
          alt="" srcset="">
        <span class="title">{{ $basic.jmeetingName }}</span>
      </div>
      <div class="loginBox">
        <div class="changeLogin" @click="changeLoginType">
          <template v-if="qrLogin && !loginType">
            <img class="changeLoginImg" src="../../assets/image/zhlogin.svg" alt="" srcset="">
            <img class="changeLoginImgs" src="../../assets/image/zhLogin.png" alt="" srcset="">
          </template>
          <template v-else>
            <img class="changeLoginImg" src="../../assets/image/smlogin.svg" alt="" srcset="">
            <img class="changeLoginImgs" src="../../assets/image/smLogin.png" alt="" srcset="">
          </template>
        </div>
        <div class="loginTxtBox" v-if="!isSuccessScan">
          <span class="loginTxt">{{ loginType ? '登录' : '快速安全登录' }}</span>
        </div>
        <template v-if="loginType">
          <input class="loginInput" type="text" placeholder="请输入登录名" v-model="formData.userName">
          <input class="loginInput" type="password" placeholder="密码" v-model="formData.password">
          <input v-if="dynamicCodeLogin" class="loginInput" type="password" placeholder="动态码"
            v-model="formData.dynamicCode">
          <div v-show="isVerifyCode" style="display: flex;justify-content: space-between;width: 324px;margin-top: 30px;">
            <input v-show="isVerifyCode" class="loginInputs" type="password" placeholder="验证码" v-model="formData.randCode"
              @input="checkCode">
            <img v-show="imgShow" alt="" class="imgCaptcha" @click.stop.prevent="refreshCaptcha" />
          </div>
          <div v-show="isVerifyCode" style="height: 10px;width: 324px;position: relative;">
            <span v-show="isCodeErr" style="color: red;position: absolute;top:-30px;right: 0;">请输入正确的验证码</span>
          </div>
          <span class="loginForgetBtn" @click="goToForgetPwd">忘记密码</span>
          <button class="loginBtn" @click="isExternalApplicant">确定</button>
        </template>
        <template v-else>
          <img v-if="!isSuccessScan" class="codeImg" :src="imgUrl" alt="" srcset="">
          <div class="expiredBox" v-if="isCodeFail">
            <span class="expiredTips">二维码已失效</span>
            <span class="reload" @click="getQrcode">刷新</span>
          </div>
          <div v-if="!isSuccessScan" class="scanBox">
            <img class="scanImg" src="../../assets/image/scan.png" alt="" srcset="">
            <div class="scanTxtBox" @click="goToDownload">
              <span>点击此处下载<span style="color: #387EE8;">最新{{ $basic.jmeetingName }}</span></span>
              <span>"扫一扫"登录</span>
            </div>
          </div>
          <div v-if="isSuccessScan" class="scanSuccessBox">
            <span class="title">扫码成功</span>
            <span class="msg">请在手机端确认登录</span>
            <img class="smSuccess" src="../../assets/image/smSuccess.png" alt="" srcset="">
            <span class="backCode" @click="backCode">返回二维码</span>
          </div>
        </template>
      </div>
      <span class="tips">2000-2020 大汉软件股份有限公司 版权所有</span>
    </div>
  </div>
</template>

<script>
import { jmeetingLoginAPI } from '@/services/boxLogin'
import { jmeetingWebAPI } from '@/services/meeting';
import { tools } from "../../tools/tool"
import { accountAPI } from '@/services/account'
// var timer = function (func) {
//   setInterval(func(), 1000)
// }
export default {
  name: 'loginIndex',
  data() {
    return {
      formData: {
        userName: '',
        password: '',
        dynamicCode: '',
        randCode: '',
      },
      imgUrl: '',
      loginType: true,
      pubk: '',
      isCodeFail: false,
      isSuccessScan: false,
      imgShow: false,
      isVerifyCode: false,
      isCodeErr: false,
      imgToken: '',
      dynamicCodeLogin: false,
      encryptLogin: true,
      qrLogin: true,
    }
  },
  methods: {
    // 判断是否为外网用户
    isExternalApplicant() {
      jmeetingWebAPI.isExternalApplicant({
        jmeeting: '12345678901234567890123456789012',
        loginName: this.formData.userName,
      })
        .then((res) => {
          if (res.success) {
            if (res.data == "internalUser") {
              this.login()
            } else {
              // "externalUser"
              this.$message.error("外部人员")
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(err => console.log(err))
    },
    login() {
      let data = {
        name: this.encryptLogin ? tools.encrypt(this.formData.userName, this.pubk) : this.formData.userName,
        password: this.encryptLogin ? tools.encrypt(this.formData.password, this.pubk) : this.formData.password,
        dynamicCode: this.dynamicCode ? this.dynamicCode : '验证码',
        randCode: this.formData.randCode
      }
      jmeetingLoginAPI.login(data, `sm2_pubk=${this.pubk}`, this.imgToken).then(res => {
        if (res.success) {
          let token = res.data['access-token']
          this.getLoginUser(token)
          console.log('token', token)
          tools.addCookie('access-token', token)
        } else {
          this.$toast(res.message)
          if (this.isVerifyCode) {
            this.initCode()
          }
        }
      }).catch(err => {
        this.$toast('登录失败，网络或系统异常，请稍后再试')
      })
    },
    getLoginUser(token) {
      jmeetingLoginAPI.getLoginUser(token).then(res => {
        if (res.success) {
          console.log('进入了getLoginUser')
          tools.addCookie('userName', res.data.user.name)
          tools.addCookie('userId', res.data.user.iid)
          // 判断是否在盒子 传给盒子token
          let userAgent = navigator.userAgent.toLowerCase()
          if (userAgent.indexOf('electron') > -1) {
            window.electron.handleToken(token)
          }
          this.$router.replace({
            path: '/boxIndex'
          })
        }
      })
    },
    goToForgetPwd() {
      this.$router.push({
        path: '/forgetPwd'
      })
    },
    getQrcode() {
      this.isCodeFail = false
      this.isSuccessScan = false
      let time = new Date().getTime()
      return jmeetingLoginAPI.loginQrcode(time).then((res) => {
        this.imgUrl = `data: image/jpeg;base64,${btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`
        this.checkLogin()
      })
    },
    // 轮询登陆状态
    checkLogin() {
      let that = this
      if (this.loginType) return
      jmeetingLoginAPI.checkLogin().then(res => {
        if (res.data.state == -1) {
          console.log('已失效---', res.data)
          this.isCodeFail = true
          clearInterval(timer)
        } else if (res.data.state == 0) {
          setTimeout(() => {
            that.checkLogin()
          }, 1000)
        } else if (res.data.state == 1) {
          console.log('已扫描待定---', res.data)
          this.isSuccessScan = true
          setTimeout(() => {
            that.checkLogin()
          }, 1000)
        } else if (res.data.state == 2) {
          let token = res.data['access-token']
          tools.addCookie('access-token', token)
          this.getLoginUser(token)
        } else if (res.data.state == 3) {
          console.log('已扫描取消---', res.data)
          this.$toast('已取消登录')
          this.isCodeFail = true
          this.isSuccessScan = false
        }
      })
    },
    // 初始化登录服务
    getLoginInit() {
      jmeetingLoginAPI.getLoginFunc().then(res => {
        if (res.success) {
          let pubk = res.data.pubk
          this.pubk = pubk
          tools.addCookie('sm2_pubk', pubk)
          this.isVerifyCode = res.data.isVerifyCode
          this.dynamicCodeLogin = res.data.dynamicCodeLogin;
          this.encryptLogin = res.data.encryptLogin;
          this.qrLogin = res.data.qrcodeLogin;
          if (res.data.isVerifyCode) {
            this.initCode()
          }
          // if (res.data.dynamicCodeLogin) {
          //   this.initDynamicCode()
          // }
        }
      })
    },
    initCode() {
      accountAPI.getTokens({ num: 1 }).then(res => {
        this.imgShow = true
        if (res.success) {
          this.imgToken = res.data.tokens[0]
          document.querySelector('.imgCaptcha').src =
            '/api-gateway/common-captcha-server/interface/code/imageCode?token=' + this.imgToken
        }
      })
    },
    // 
    goToDownload() {
      const { href } = this.$router.resolve({
        name: "download",
      });
      window.open(href, '_blank');
    },
    checkCode() {
      console.log('this.formData.randCode', this.formData.randCode)
      if (this.formData.randCode === '' || this.formData.randCode === undefined || this.formData.randCode === null) {
        return
      } else if (this.formData.randCode.length !== 4) {
        this.isCodeErr = true
        return
      } else {
        const queryData = {
          inputcode: this.formData.randCode,
          token: this.imgToken
        }
        accountAPI.checkCode(queryData).then(res => {
          this.imgToken = res.data.token
          if (res.success) {
            this.isCodeErr = false
          } else {
            this.isCodeErr = true
            this.$nextTick(() => {
              this.initCode()
            })
          }
        })
      }
    },
    isLogin() {
      if (tools.getCookie('access-token')) {
        jmeetingLoginAPI.checkUsers(tools.getCookie('access-token')).then(res => {
          if (res.success) {
            console.log('checkUsers', res)
            this.getLoginUser(tools.getCookie('access-token'))
          }
        })
      }
    },
    // 切换登录方式
    changeLoginType() {
      this.loginType = !this.loginType
      if (!this.loginType) {
        this.getQrcode()
      }
    },
    // 返回二维码
    backCode() {
      this.getQrcode()
    },
    keyDown() {
      document.onkeydown = (e) => {
        //事件对象兼容
        let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
        //键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
        //左
        if (e1.code === 'Enter') {
          // this.login()
          this.isExternalApplicant()
        }
      }
    },
    refreshCaptcha() {
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
  },
  created() {
    // this.getQrcode()
    tools.removeCookie()
    this.getLoginInit()
  },
  beforeDestroy() {
    document.onkeydown = null
  },
  mounted() {
    this.isLogin()
    this.keyDown()
  }
}
</script>

<style lang="less" scoped>
.loginLayout {
  // width: 1920px;
  // height: 1080px;
  // position: relative;
  // background-color: red;
  // overflow: auto;
}

.loginIndex {
  background-image: url('../../assets/image/backgroup.png');
  background-size: cover;
  background-attachment: local;
  // background-repeat:no-repeat;
  background-position: 50%, 50%;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  // position: absolute;
  // left: 50%;
  // transform: translateX(-50%);
  overflow-y: auto;

  .loginBox {
    background-color: #fff;
    width: 405px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 48px 0 41px 0;
    position: relative;

    .changeLogin {
      position: absolute;
      top: 3px;
      right: 4px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .changeLoginImg {
        height: 32px;
        width: 80px;
        margin-right: 6px;
      }

      .changeLoginImgs {
        width: 40px;
        height: 40px;
      }
    }

    .loginTxtBox {
      width: 324px;
      text-align: center;
      border-bottom: 1px solid #D8D8D8;
      margin-bottom: 40px;

      .loginTxt {
        display: inline-block;
        font-family: MicrosoftYaHei;
        font-size: 20px;
        color: #333333;
        letter-spacing: 0.34px;
        font-weight: 400;
        padding-bottom: 12px;
        border-bottom: 2px solid #387EE8;
      }
    }

    .loginInput {
      width: 324px;
      height: 48px;
      border: 1px solid rgba(216, 216, 216, 1);
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #999999;
      letter-spacing: 0.27px;
      font-weight: 400;
      padding: 0 20px;
      margin-bottom: 30px;
    }

    .loginInput:last-of-type {
      margin-bottom: 0;
    }

    .loginInputs {
      width: 180px;
      height: 48px;
      border: 1px solid rgba(216, 216, 216, 1);
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #999999;
      letter-spacing: 0.27px;
      font-weight: 400;
      padding: 0 20px;
      // margin-bottom: 30px;
    }

    .loginBtn {
      background-color: #387EE8;
      width: 324px;
      height: 48px;
      line-height: 48px;
      font-family: MicrosoftYaHei;
      font-size: 20px;
      color: #FFFFFF;
      letter-spacing: 0.34px;
      font-weight: 400;
      cursor: pointer;
    }

    .loginForgetBtn {
      color: green;
      // width: 100%;
      // position: absolute;
      // bottom: 89px;
      // right: 42px;
      // transform: translateX(50%);
      padding: 15px 40px;
      text-align: right;
      cursor: pointer;
      align-self: flex-end;
    }

    .codeImg {
      width: 166px;
      height: 166px;
      // background-color: red;
      margin-bottom: 40px;
    }

    .expiredBox {
      width: 170px;
      height: 170px;
      // background-color: red;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      top: 132px;
      padding-top: 55px;
      align-items: center;

      .expiredTips {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0.26px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      .reload {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #387EE8;
        letter-spacing: 10px;
        font-weight: 400;
        // text-decoration: underline;
        padding-left: 10px;
        cursor: pointer;
      }
    }

    .scanBox {
      display: flex;
      align-items: center;

      .scanImg {
        width: 40px;
        height: 40px;
        margin-right: 13px;
      }

      .scanTxtBox {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0.23px;
        line-height: 17px;
        font-weight: 400;
        cursor: pointer;
      }
    }

    .scanSuccessBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 28px;

      .title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0.26px;
        font-weight: 400;
        margin-bottom: 16px;
      }

      .msg {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0.23px;
        font-weight: 400;
        margin-bottom: 45px;
      }

      .smSuccess {
        width: 64px;
        height: 64px;
        margin-bottom: 117px;
      }

      .backCode {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #387EE8;
        letter-spacing: 0.26px;
        font-weight: 400;
        cursor: pointer;
      }
    }
  }

  .logoImg {
    height: 55px;
    margin-bottom: 30px;
    margin-top: 206px;
    display: flex;
    align-items: center;

    .logoIcon {
      height: 55px;
      width: 55px;
    }

    .title {
      margin-left: 10px;
      font-size: 40px;
      font-weight: 600;
    }
  }

  .tips {
    // position: absolute;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.27px;
    font-weight: 400;
    margin-top: 263px;
    margin-bottom: 60px;
  }
}

.imgCaptcha {
  width: 80px;
  height: 30px;
  background-size: 80px 30px;
  cursor: pointer;
}

// @media screen {

// }
</style>