<template>
  <div class="editLoginMain">
    <div class="line">
      <p>账号</p>
      <a-input v-model="formData.userName" class="text" placeholder="请输入账号" />
    </div>
    <div class="line">
      <p>密码</p>
      <a-input-password v-model="formData.password" placeholder="请输入密码" @keyup.enter="login" />
    </div>
    <!-- <a-checkbox class="rememberPassword" @change="onChange">
      记住密码
    </a-checkbox> -->
    <div class="btn" @click="login">登录</div>
  </div>
</template>
<script>
import { tools } from "@/tools/tool";
import { jmeetingLoginAPI } from '@/services/boxLogin';
import { accountAPI } from '@/services/account';
import { jmeetingWebAPI } from '../services/jmeeting';
// import Cookies from 'js-cookie'
export default {
  name: 'EditLogin',
  data() {
    return {
      // rememberPassword: false,
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
  created() {
    this.getLoginInit()
  },
  // mounted() {
  //   let formData = JSON.parse(Cookies.get('meetingAccount'));
  //   if (!!formData.password) {
  //     this.formData = formData;
  //   }
  // },
  methods: {
    // 记住密码
    // onChange(e) {
    //   this.rememberPassword = e.target.checked;
    // },
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
          // console.log('token', token)
          // tools.addCookie('access-token', token)
        } else {
          this.$message.error(res.message)
          // if (this.isVerifyCode) {
          //   this.initCode()
          // }
        }
      }).catch(err => {
        this.$message.error('登录失败，网络或系统异常，请稍后再试')
      })
    },
    getLoginUser(token) {
      jmeetingLoginAPI.getLoginUser(token).then(res => {
        if (res.success) {
          // console.log('进入了getLoginUser')
          // tools.addCookie('userName', res.data.user.name)
          // tools.addCookie('userId', res.data.user.iid)
          // 判断是否在盒子 传给盒子token
          let userAgent = navigator.userAgent.toLowerCase()
          if (userAgent.indexOf('electron') > -1) {
            window.electron.handleToken(token)
          }
          this.getUserPhone(res.data.user.iid)
        }
      })
    },
    getUserPhone(userId) {
      jmeetingWebAPI.getMobileNumber({
        jmeeting: userId,
        userId
      }).then(res => {
        console.log(res);
        if (res.success) {
          // this.$emit('land', {
          //   userName: this.formData.userName,
          //   phoneNumber: res.data,
          //   // userId
          // })
          this.$router.push({
            name: 'historyMeet',
            params: {
              isCreate: true,
            },
            query: {
              userName: this.formData.userName,
              phoneNumber: res.data,
            },
          })
          // this.formData.password = "";
        }

      })
    },
    // 初始化登录服务
    getLoginInit() {
      jmeetingLoginAPI.getLoginFunc().then(res => {
        if (res.success) {
          let pubk = res.data.pubk
          this.pubk = pubk
          // tools.addCookie('sm2_pubk', pubk)
          this.encryptLogin = res.data.encryptLogin;
          // 闪会不存在动态码 验证码 二维码
          // this.isVerifyCode = res.data.isVerifyCode
          // this.dynamicCodeLogin = res.data.dynamicCodeLogin;
          // this.qrLogin = res.data.qrcodeLogin;
          // if (res.data.isVerifyCode) {
          //   this.initCode()
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
  },
}
</script>

<style lang="less" scoped>
.editLoginMain {
  // width: 50%;
  // min-width: 450px;
  width: 498px;
  // aspect-ratio: 64/67; //宽/高
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
  padding: 32px 40px;
  box-sizing: border-box;
  background: #fff;
  // box-shadow: 0 4px 64px 0 #0000000f;
  border-radius: 15px;
}

.line {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  p {
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 18px;
    color: #262729;
    letter-spacing: 0;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .text {
    background: rgba(225, 236, 240, 0.5);
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 16px;
    color: rgba(38, 39, 41, 0.7);
    letter-spacing: 0;
    line-height: 28px;
    border: none;
  }

  /deep/ .ant-input-password {
    .ant-input {
      background: rgba(225, 236, 240, 0.5);
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 16px;
      color: rgba(38, 39, 41, 0.7);
      letter-spacing: 0;
      line-height: 28px;
      border: none;
    }
  }

}

.btn {
  // width: 418px;
  height: 56px;
  border-radius: 50px;
  background: #1890FF;
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
  line-height: 56px;
  margin-top: 32px;
  cursor: pointer;
}
</style>
