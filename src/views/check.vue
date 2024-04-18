<template>
  <div class="checkMain" v-if="isShow">
    <nav>
      <!-- <img class="logoIcon" src="../assets/image/logo.png" alt="" /> -->
      <img class="logoIcon" :src="$basic.jmeetingIcon ? $basic.jmeetingIcon : require('../assets/meeting/company.png')"
        alt="">
      <span>{{ $basic.jmeetingName }}</span>
    </nav>
    <div class="mainCheck">
      <!-- <img class="middleIcon" src="../assets/image/login.svg" alt="" /> -->
      <!-- <div class="middleIcon middleBgIcon">
        <h3>闪会</h3>
        <p><span>即时</span><span>高效</span><span>便捷</span></p>
        <div class="lbox">
          <div class="wbox">
            <img class="js" src="../assets/image/js.png" alt="">
            <div class="nbox">
              <h4>即时</h4>
              <span>无需注册，即开即用</span>
            </div>
          </div>
          <div class="wbox">
            <img class="gx" src="../assets/image/gx.png" alt="">
            <div class="nbox">
              <h4>高效</h4>
              <span>多种分享方式，提升工作效率</span>
            </div>
          </div>
          <div class="wbox">
            <img class="bj" src="../assets/image/bj.png" alt="">
            <div class="nbox">
              <h4>便捷</h4>
              <span>电脑/手机/浏览器/微信小程序等一键入会</span>
            </div>
          </div>
        </div>
      </div> -->
      <div class="leftMain">
        <h3 class="leftTitle">闪会</h3>
        <div class="leftTipsBox">
          <div class="leftTips">
            <h4>即时</h4>
            <span>无需注册</span>
            <span>即开即用</span>
          </div>
          <div class="leftTips">
            <h4>便捷</h4>
            <span>电脑/手机/浏览器/微信小程序等一键入会</span>
          </div>
          <div class="leftTips">
            <h4>高效</h4>
            <span>多种分享方式</span>
            <span>提升工作效率</span>
          </div>
        </div>
        <img class="leftImg" src="../assets/image/leftMain.jpg" alt="">
      </div>
      <div class="checkInfo">
        <p class="title">填写信息，立即体验</p>
        <el-form id="inputBox" class="inputBox" ref="form" :model="form" label-position="left" :rules="rules">
          <el-form-item prop="nameInput" :rules="rules.nameInput" ref="nameInput">
            <el-input placeholder="请填写您的姓名" v-model="form.nameInput" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item prop="phoneInput" :rules="rules.phoneInput" ref="phone" v-if="liveMode == 1">
            <el-input placeholder="请输入您的手机号" v-model="form.phoneInput" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item prop="codeInput" :rules="rules.codeInput" ref="phone" v-if="liveMode == 1 && yzmOpen">
            <el-input class="check-code-box" v-model="form.codeInput" placeholder="请输入短信验证码">
              <div class="getCodeBtn" v-if="isFirst && istimeout" slot="suffix" @click="getCode">获取验证码</div>
              <div class="getCodeBtn" v-if="!isFirst && istimeout" slot="suffix" @click="getCode">重新获取</div>
              <div class="againCodeBtn" v-if="!istimeout" slot="suffix">重新发送({{ time }})</div>
            </el-input>
          </el-form-item>
          <el-form-item prop="randCode" :rules="rules.randCode" ref="phone" v-if="liveMode == 1 && !yzmOpen">
            <el-input class="check-code-box" v-model="form.randCode" placeholder="验证码" maxlength="4">
              <img class="getYzm imgCaptcha" slot="suffix" alt="" @click.stop.prevent="initCode" />
            </el-input>
          </el-form-item>
        </el-form>
        <!-- <button class="jumpMeetBtn" @click="isMeetingFull">进入会议</button> -->
        <div class="btn" @click="isMeetingFull">进入会议</div>
      </div>
    </div>
    <ExcessReminder v-if="showTips" tipsText="当前会议人数已达上限，建议升级正式版，升级后将享有不限人数不限时长的高清会议权益" @afterConfirm="showTips = false" />

    <!-- 上海计量 -->
    <HanwebFooter />
    <!-- <footer v-if="$basic.isNeedFooter">
      <p class="footerMes">
        <span>全国客户服务热线:&nbsp;&nbsp;400-969-0828&nbsp;&nbsp;南京总公司:&nbsp;&nbsp;江苏省南京市玄武区玄武大道699-40号</span>
      </p>
      <p class="footerMes">
        <span>2000-2020&nbsp;大汉软件股份有限公司&nbsp;版权所有&nbsp;苏ICP备&nbsp;05075050号&nbsp;&nbsp;
        </span>
        <img src="../assets/image/plice.png" alt="" />
        <span>&nbsp;苏公网安备&nbsp;32010202010709号</span>
      </p>
    </footer> -->
  </div>
</template>
<script>
import ExcessReminder from "../components/ExcessReminder.vue";
import HanwebFooter from "@/components/HanwebFooter.vue";
import { jmeetingWebAPI } from '../services/jmeeting'
import { jmeetingWebAPI as jmeetingAPI } from '../services/meeting';
// import EditLogin from '../components/editLogin'
// import CodeLogin from '../components/codeLogin'
import { tools } from "../tools/tool";
import { jpassConfig, meetUrl_h5 } from '../common/config.js'
import imMethods from '../tools/imMethods'
import { mapState } from 'vuex'
import { accountAPI } from '@/services/account'
export default {
  name: 'App',
  components: {
    ExcessReminder,
    HanwebFooter
  },
  computed: {
    ...mapState(['userId']),//与state中的名字相同,在template中可以直接使用name,age
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'))
      }
      // 使用正则表达式进行验证手机号码
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机格式'))
      }
      // 自定义校验规则 需要调用callback()函数！
      callback()
    }
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('姓名不能为空'))
      }
      // 使用正则表达式进行验证手机号码
      if (!this.checkSpecialKey(value)) {
        callback(new Error('不能含有特殊字符'))
      }
      if (value.length > 10) {
        callback(new Error('姓名长度最多10个字符'))
      }
      // if (!/^(([a-zA-Z+\.?\·?a-zA-Z+]{1,10}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{1,10}$))/.test(value)) {
      //   callback(new Error('请输入正确的姓名格式'))
      // }
      // 自定义校验规则 需要调用callback()函数！
      callback()
    }
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('验证码不能为空'))
      }
      // 使用正则表达式进行验证手机号码
      if (!/^[0-9]+$/.test(value) || !/^\d{6}$/.test(value)) {
        callback(new Error('请输入6位数字的验证码'))
      }
      // 自定义校验规则 需要调用callback()函数！
      callback()
    }
    const validateRandCode = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        callback(new Error('验证码不能为空'))
      }
      if (value.length != 4) {
        callback(new Error('请输入正确的验证码'))
      }
      // 自定义校验规则 需要调用callback()函数！
      callback()
    }
    return {
      // liveMode:0,//会议模式 1-混合 0-内部 -1-外部
      istimeout: true,
      isFirst: true,//是否首次进入
      time: 60,
      isShow: false,
      form: {
        nameInput: '',//姓名
        phoneInput: '',//手机号
        codeInput: '',//验证码
        randCode: "",//图形验证码
      },
      yzmOpen: false,//是否开启验证码登录
      rules: {
        nameInput: [
          { required: true, validator: validateName, trigger: 'blur' },
        ],
        phoneInput: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        codeInput: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        randCode: [
          { required: true, validator: validateRandCode, trigger: 'blur' }
        ]
      },
      showTips: false,//超额提示
    }
  },
  methods: {
    initCode() {
      accountAPI.getTokens({ num: 1 }).then(res => {
        this.imgShow = true
        if (res.success) {
          this.imgToken = res.data.tokens[0]
          console.log(document.querySelector('.imgCaptcha'));
          document.querySelector('.imgCaptcha').src =
            '/api-gateway/common-captcha-server/interface/code/imageCode?token=' + this.imgToken
        }
      })
    },
    checkCode() {
      // console.log('this.formData.randCode', this.form.randCode)
      if (this.form.randCode === '' || this.form.randCode === undefined || this.form.randCode === null) {
        this.$toast("验证码不能为空")
        return
      } else {
        const queryData = {
          inputcode: this.form.randCode,
          token: this.imgToken
        }
        accountAPI.checkCode(queryData).then(res => {
          this.imgToken = res.data.token
          if (res.success) {
            this.jumpMeeting()
          } else {
            this.$toast("验证码错误")
            this.$nextTick(() => {
              this.initCode()
            })
          }
        })
      }
    },
    //校验特殊字符
    checkSpecialKey(str) {
      let specialKey =
        "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？@]‘'";
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    },
    //获取验证码
    getCode() {
      if (!this.form.phoneInput) {
        this.$toast('手机号不能为空');
        return
      }
      jmeetingWebAPI
        .sendValidateCode({
          phoneNumber: tools.encrypt(this.form.phoneInput, jpassConfig.publicKey),
          // jmeeting:tools.encrypt(this.form.phoneInput,jpassConfig.publicKey),
          jmeeting: '12345678901234567890123456789012',
        })
        .then((res) => {
          if (res.success || !res.success && res.message == '发送过于频繁，请稍等！') {
            this.istimeout = false;
            this.isFirst = false;
            this.$toast('验证码已发送');
            // console.log(res);
            this.istimeout = false;
            this.time = res.data.ttl;
            let timeout = setInterval(() => {
              this.time--;
              if (this.time == 0) {
                this.istimeout = true;
                this.time = 60;
                clearInterval(timeout);
              }
            }, 1000)
          } else {
            this.$toast(res.message);
            console.log(res.message);
          }
        })
        .catch(err => console.log(err))
    },
    isMeetingFull() {
      jmeetingAPI.isMeetingFull({
        jmeeting: "12345678901234567890123456789012",
        liveId: this.liveId
      }).then(res => {
        console.log(res);
        if (res.success) {
          if (res.data.joinNumber && (res.data?.joinNumber >= res.data?.singleMaxJoinNumber)) {
            this.showTips = true
          } else {
            this.jumpMeet()
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //进入会议-混合会议（1），校验电话号码验证码 外网会议（-1）直接姓名入会
    jumpMeet() {
      if (this.liveMode == -1) {
        if (!this.form.nameInput) {
          this.$toast('姓名不能为空');
          return
        }
        this.$router.push({ path: '/index', query: { liveId: this.liveId, userName: this.form.nameInput, liveMode: this.liveMode } })
      } else if (this.liveMode == 1) {
        if (!this.form.nameInput || !this.form.phoneInput) {
          let message = !this.form.nameInput ? '姓名不能为空' : '电话号码不能为空';
          this.$toast(message);
          return
        }
        // 开启验证码短信机验证
        if (this.yzmOpen) {
          if (!this.form.codeInput) {
            this.$toast('验证码不能为空');
            return
          } else {
            this.codeCheck();
          }
        } else {
          // 图形验证码
          this.checkCode()
        }
      }
    },
    //校验验证码
    codeCheck() {
      jmeetingWebAPI
        .check({
          // jmeeting:tools.encrypt(this.form.phoneInput,jpassConfig.publicKey),
          jmeeting: '12345678901234567890123456789012',
          phoneNumber: tools.encrypt(this.form.phoneInput, jpassConfig.publicKey),
          validateCode: this.form.codeInput
        })
        .then((res) => {
          if (res.success) {
            // console.log(res);
            this.jumpMeeting()
          } else {
            this.$toast('验证码错误');
            // console.log(res.message);
          }
        })
        .catch(err => console.log(err))
    },
    jumpMeeting() {
      this.$router.push({ path: '/index', query: { liveId: this.liveId, liveMode: this.liveMode, userName: this.form.nameInput, phoneNumber: this.form.phoneInput } })
    },
    //是否开启短信机验证码校验
    getMeetingSetting() {
      jmeetingWebAPI
        .meetingSetting({
          // jmeeting:this.userIdJoin,
          jmeeting: '12345678901234567890123456789012',
          myId: this.userId,
        })
        .then((res) => {
          if (res.success) {
            // console.log(res.data);
            this.yzmOpen = res.data.meetingSetting.open;
          }
        })
    },
  },
  created() {
    this.liveId = imMethods.getUrlParams('liveId');
    this.liveMode = imMethods.getUrlParams('liveMode');//会议模式 1-混合 0-内部 -1-外部
    //如果是移动端入会 跳转至移动端地址
    let is_mobile = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
    // this.$toast(is_mobile);
    if (is_mobile) {
      let url = `${meetUrl_h5 + 'checkInfo?liveId=' + this.liveId + '&liveMode=' + this.liveMode}`;
      window.location.href = url;
    } else {
      this.isShow = true;
    }
    this.getMeetingSetting()
  },
  mounted() {
    this.initCode();
    this.$nextTick(() => {
      document.getElementById('inputBox').addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          e.preventDefault();
          // this.jumpMeet()
          this.isMeetingFull()
        }
      })
    })
  },
}
</script>

<style lang="less" scoped>
.checkMain {
  height: 100vh;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  justify-content: space-between;
  align-items: center;
  // background-image: url('../assets/image/bg.png');
  background-image: linear-gradient(to bottom right, rgb(255, 255, 255), rgb(217, 232, 255));

  nav {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 60px 0 0 100px;
    // position: fixed;
    // top: 0;

    .logoIcon {
      width: 50px;
      height: 50px;
      // margin: 60px 0 0 100px;
    }

    span {
      margin-left: 20px;
      color: #333;
      font-size: 30px;
      font-weight: 600;
    }
  }

  .mainCheck {
    display: flex;
    align-items: center;
    // padding: 70px 0 110px 0;
    padding-bottom: 20px;
    box-sizing: border-box;
    width: 62%;
    min-width: 860px;
    max-width: 1280px;

    // height: calc(100% - 200px);
    .middleIcon {
      width: 50%;
      min-width: 450px;
      object-fit: cover;
    }

    .middleBgIcon {
      background: url(../assets/image/login2.png);
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      h3 {
        font-family: SourceHanSansCN-Bold;
        font-weight: 700;
        // font-size: 25.31px;
        font-size: 0.48rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        // margin-bottom: 20px;
        margin-bottom: 0.4rem;
      }

      p {
        // margin-bottom: 49px;
        width: 3.5rem;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.93rem;

        span {
          font-family: SourceHanSansCN-Regular;
          font-weight: 400;
          // font-size: 14px;
          font-size: 0.27rem;
          color: #ffffffcc;
          letter-spacing: 0;
          text-align: center;
        }
      }

      // .lbox {
      //   margin-left: 20%;
      // }

      .wbox {
        display: flex;
        align-items: center;
        // margin-bottom: 34.51px;
        margin-bottom: 0.65rem;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .nbox {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        // margin-left: 26px;
        margin-left: 0.49rem;

        h4 {
          font-family: SourceHanSansCN-Bold;
          font-weight: 700;
          // font-size: 15.47px;
          font-size: 0.29rem;
          color: #FFFFFF;
          letter-spacing: 0;
          margin-bottom: 0;
        }

        span {
          font-family: SourceHanSansCN-Regular;
          font-weight: 400;
          // font-size: 11.25px;
          font-size: 0.21rem;
          color: #ffffff99;
          letter-spacing: 0;
        }
      }

      .js {
        width: 0.79rem;
        height: 0.85rem;
        // width: 41.48px;
        // height: 45px;
      }

      .gx {
        width: 0.79rem;
        height: 0.79rem;
        // width: 41.48px;
        // height: 41.48px;
      }

      .bj {
        // width: 9%;
        // height: 7.8%;
        width: 0.77rem;
        height: 0.67rem;
      }
    }
  }

  .leftMain {
    width: 50%;
    min-width: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .leftTitle {
      font-family: SourceHanSansCN-Regular;
      // font-size: 38px;
      font-size: 0.5rem;
      color: #333333;
      // letter-spacing: 1.27px;
      letter-spacing: 0.016rem;
      text-align: left;
      font-weight: 400;
    }

    .leftTipsBox {
      width: 70%;
      display: flex;
      justify-content: space-around;
      margin-bottom: 30px;

      .leftTips {
        flex: 1;
        // margin-right: 60px;
        margin-right: 0.8rem;
        display: flex;
        flex-direction: column;

        &:last-child {
          margin-right: 0;
        }

        h4 {
          font-family: SourceHanSansCN-Regular;
          // font-size: 22px;
          font-size: 0.293rem;
          color: #333333;
          letter-spacing: 0;
          font-weight: 400;
          text-align: center;
        }

        span {
          font-family: SourceHanSansCN-Regular;
          // font-size: 16px;
          font-size: 0.213rem;
          color: rgba(153, 153, 153, 1.00);
          letter-spacing: 0;
          // line-height: 24px;
          line-height: 0.32rem;
          font-weight: 400;
          text-align: center;
        }
      }
    }

    .leftImg {
      width: 70%;
    }
  }

  .checkInfo {
    width: 50%;
    min-width: 450px;
    // aspect-ratio: 64/67; //宽/高
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // padding: 0 60px;
    padding: 32px 60px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 15px;

    .title {
      // font-weight: 500;
      // font-size: 30px;
      // color: #333333;
      font-family: PingFangSC-SNaNpxibold;
      font-weight: 400;
      font-size: 24px;
      color: #262729;
      letter-spacing: 0;
      line-height: 30px;
      margin-bottom: 30px;
    }

    .inputBox {
      width: 100%;
      // margin: 20px 24px 0;
      // width: calc(100% - 48px);
    }

    .jumpMeetBtn {
      width: 100%;
      height: 72px;
      background: #277AFF;
      border-radius: 5px;
      font-weight: 500;
      font-size: 24px;
      color: #FFFFFF;
      text-align: center;
      line-height: 72px;
      cursor: pointer;
    }

    .btn {
      // width: 418px;
      width: 100%;
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
      // margin-top: 32px;
      cursor: pointer;
    }
  }

  ::v-deep .el-input__inner {
    color: #999;
    font-size: 18px;
    height: 50px;
  }

  ::v-deep .el-form-item {
    margin-bottom: 30px;
  }

  ::v-deep .el-input-group__prepend {
    width: 28%;
    background: #fff;
  }

  ::v-deep .el-select-dropdown__item {
    display: flex;
    justify-content: space-between;
  }

  ::v-deep .el-input__suffix {
    color: #277AFF;
    display: flex;
    align-items: center;
    right: 10px;
    font-size: 16px;
  }

  footer {
    font-size: 16px;
    line-height: 22px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #191f31;
    padding: 20px 0;
    width: 100%;
    position: fixed;
    bottom: 0;
  }

  .footerMes {
    color: white;
  }

  footer p:nth-child(1) {
    margin-bottom: 5px;
  }

  footer p:nth-child(2) {
    display: flex;

    img {
      width: 18px;
      height: 20px;
    }
  }
}

.getCodeBtn {
  color: #277AFF;
}

.againCodeBtn {
  color: #999;
}

.getYzm {
  width: 120px;
  height: 40px;
}

::v-deep input::-webkit-input-placeholder {
  color: #999;
}

::v-deep input:-moz-placeholder {
  color: #999;
}

::v-deep input::-moz-placeholder {
  color: #999;
}

::v-deep input:-ms-input-placeholder {
  color: #999;
}
</style>
