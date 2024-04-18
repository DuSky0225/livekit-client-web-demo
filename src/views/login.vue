<template>
  <div class="loginMain">
    <div class="nav">
      <img class="logoIcon" :src="$basic.jmeetingIcon ? $basic.jmeetingIcon : require('@/assets/meeting/company.png')"
        alt="">
      <span>{{ $basic.jmeetingName }}</span>
    </div>
    <div class="mainCss">
      <!-- <div class="flex"> -->
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
      <EditLogin v-if="isChoose == 1" @land="landFn"></EditLogin>
      <CodeLogin v-if="isChoose == 2" :userMessage="userMessage"></CodeLogin>
      <!-- </div> -->
    </div>
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
import EditLogin from '../components/editLogin'
import CodeLogin from '../components/codeLogin'
import HanwebFooter from "@/components/HanwebFooter.vue";
export default {
  name: 'App',
  components: {
    CodeLogin,
    EditLogin,
    HanwebFooter
  },
  data() {
    return {
      isChoose: 1,//1-登录页 2-扫码页
      userMessage: {},//用户信息-phoneNumber
    }
  },
  methods: {
    //登录-切换页面至扫码页
    landFn(data) {
      this.isChoose = 2;
      this.userMessage = data;
    },
  },
}
</script>

<style lang="less" scoped>
.loginMain {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  justify-content: space-between;
  // background-image: url('../assets/image/bg.png');
  background-image: linear-gradient(to bottom right, rgb(255, 255, 255), rgb(217, 232, 255));

  .nav {
    width: 100%;
    display: flex;
    // position: fixed;
    // top: 0;
    align-items: center;
    padding: 60px 0 0 50px;

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

  .mainCss {
    display: flex;
    // height: calc(100% - 200px);
    // padding: 70px 0 110px 0;
    align-items: center;
    padding-bottom: 20px;
    box-sizing: border-box;
    width: 62%;
    height: auto;
    min-width: 900px;
    max-width: 1280px;
    max-height: calc(100% - 200px);

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

    .middleIcon {
      width: 50%;
      min-width: 450px;
      object-fit: contain;
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
</style>
