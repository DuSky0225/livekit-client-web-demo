<template>
  <div>
    <div style="position: relative" v-show="flag">
      <img class="bg" src="../assets/download/bg.png" alt="" />
      <div class="content">
        <span class="text bold">{{ $basic.jmeetingName }}</span>
        <span class="text1 bold">让企业会议更高效</span>
        <span class="text2 regulr"></span>
        <span class="button bold" @click="js_method">立即获取</span>
        <img src="../assets/download/pic.png" alt="" />
      </div>
      <div class="content1" v-show="show4 && $basic.isNeedFooter">
        <div class="text1 regular">
          <p style="margin-bottom:5px;">
            全国客户服务热线：
            <span style="margin-right:10px;">400-969-0828</span>
            <br />
            南京总公司：南京市玄武区玄武大道699-40号
          </p>
          <p>
            2000-2022 大汉软件股份有限公司
            <br />
            版权所有
            <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">苏ICP备 05075050号</a>
            <br />
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32010202010709" target="_blank"
              style="display: flex;justify-content: center;align-items: center;"><img
                src="@/assets/download/icon2.png" />苏公网安备
              32010202010709号</a>
          </p>
        </div>
      </div>
    </div>
    <div v-show="!flag">
      <div class="page">
        <img class="bg" src="../assets/download/bg1.jpg" alt="" />
        <div class="box">
          <div>
            <span class="text bold">{{ $basic.jmeetingName }}</span>
            <span class="text1 bold">让企业会议更高效</span>
          </div>
          <span class="text2 regular"></span>
          <span class="button bold" @click="js_method">立即获取</span>
          <div class="download">
            <!-- <div class="item-box">
              <div class="clientErr" v-if="androidError">即将上线，敬请期待！</div>
              <div class="type">
                <img src="../assets/download/android2.png" alt="" />
                <span class="regular">Android 版下载</span>
              </div>
              <img :src="'data:image/png;base64,' + androidImg" :onerror="errorImage" alt="">
              <span class="regular">打开手机扫一扫</span>
            </div> -->
            <!-- <div class="item-box">
              <div class="clientErr" v-if="iosError">即将上线，敬请期待！</div>
              <div class="type">
                <img src="../assets/download/iphone2.png" alt="" />
                <span class="regular">iPhone 版下载</span>
              </div>
              <img :src="'data:image/png;base64,' + iosImg" :onerror="errorImage" alt="">
              <span class="regular">打开手机扫一扫</span>
            </div> -->
            <div class="item-box">
              <div class="type">
                <img src="../assets/download/phone.png" alt="" />
                <span class="regular">移动端下载</span>
              </div>
              <img :src="'data:image/png;base64,' + phoneImg" :onerror="errorImage" alt="">
              <span class="regular">打开手机扫一扫</span>
            </div>
            <div class="item-box">
              <div class="type">
                <img src="../assets/download/wxIcon.png" alt="" />
                <span class="regular">微信小程序</span>
              </div>
              <img src="../assets/download/wx.png" alt="">
              <span class="regular">打开微信扫一扫</span>
            </div>
            <div class="items-box">
              <div class="item" @click="getAPK(0)">
                <img src="../assets/download/win2.png" alt="" />
                <span class="regular">Windows 版下载</span>
              </div>
              <div class="item" @click="getAPK(1)">
                <img src="../assets/download/mac2.png" alt="" />
                <span>Mac 版下载</span>
              </div>
              <div class="item" @click="getAPK(2)">
                <img src="../assets/download/linux1.png" alt="" />
                <span>Linux 版下载</span>
              </div>
            </div>
          </div>
        </div>
        <!-- <img class="pic" src="../assets/download/pic.png" alt="" /> -->
      </div>
      <div class="foot regular" v-if="$basic.isNeedFooter">
        <p style="margin-bottom:5px;">
          全国客户服务热线：<span style="margin-right:10px;">400-969-0828</span>
          南京总公司：江苏省南京市玄武区玄武大道699-40号
        </p>
        <p>
          2000-2022 大汉软件股份有限公司 版权所有
          <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">苏ICP备 05075050号</a>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32010202010709" target="_blank"><img
              src="@/assets/download/icon2.png" />苏公网安备
            32010202010709号</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { accountAPI } from '../api/account/account';
export default {
  data() {
    return {
      flag: true,
      show: true,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: false,
      base64Img: null,
      iosImg: "",
      iosUrl: "",
      androidImg: '',
      androidUrl: '',
      androidError: false,
      iosError: false,
      phoneImg:"",
      errorImage: ' this.src=" ' + require('../assets/download/zwt.png') + ' " ',
    };
  },
  methods: {
    js_method() {
      let ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        //ios
        if (this.iosError) this.$toast("即将上线，敬请期待！")
        else window.open(this.iosUrl);
        // let nowTime = new Date().valueOf();
        // setTimeout(function () {
        //   let launchTime = new Date().valueOf() - nowTime;
        //   if (launchTime < 28) {
        //     //28是调试估算出来的打开本地app基本需要的时间
        //     window.location = "https://testflight.apple.com/join/vf2H7hIa"; //下载app页面
        //   } else {
        //     window.location.href =
        //       "itms-beta://testflight.apple.com/join/vf2H7hIa";
        //   }
        // }, 25);
        // this.getAPK(3)
      } else if (/android/.test(ua)) {
        // window.open("http://im.hanweb.com/download/app/apk/vlink.apk");
        // this.getAPK(4)
        if (this.androidError) this.$toast("即将上线，敬请期待！")
        else window.open(this.androidUrl);
      } else if (/mac/.test(ua)) {
        this.getAPK(1);
      } else if (/win/.test(ua)) {
        this.getAPK(0);
      } else {
        this.getAPK(2);
      }
    },
    meetingDownLoad() {
      accountAPI.meetingDownLoad({}).then(res => {
        console.log(res);
        this.phoneImg = res?.data;
      })
    },
    // 0:windows; 1:mac; 2:linux; 3:ios; 4:android
    getAPK(systemType) {
      accountAPI.downLoad({
        systemType
      }).then(res => {
        console.log(res);
        if (res.success) {
          let { data, downloadData } = res.data;
          if (systemType == 3) {
            this.iosImg = data;
            this.iosUrl = downloadData.fullDownloadUrl;
          } else if (systemType == 4) {
            this.androidImg = data;
            this.androidUrl = downloadData.fullDownloadUrl;
          } else {
            window.open(data.fullDownloadUrl)
          }
        } else {
          if (systemType == 3) {
            this.iosError = true
          } else if (systemType == 4) {
            this.androidError = true
          } else {
            this.$toast("获取安装包失败，请稍后再试！")
          }
        }
      })
    },
  },
  created() {
    // 获取客户端下载地址
    this.getAPK(3)
    this.getAPK(4)
    // 获取移动端下载页二维码
    this.meetingDownLoad()
  },
  async mounted() {
    const width = document.body.clientWidth;
    width < 750 ? this.flag = true : this.flag = false;
    window.addEventListener("resize", () => {
      const width = document.body.clientWidth;
      width < 750 ? this.flag = true : this.flag = false;
    });
  },
};
</script>

<style lang="less" scoped>
.page {
  position: relative;

  .pic {
    position: absolute;
    top: 3.57333rem;
    right: 1.38667rem;
    width: 11.21333rem;
  }

  .box {
    position: absolute;
    top: 3.36rem;
    left: 4.21333rem;
    z-index: 1;
    display: flex;
    flex-direction: column;

    .text {
      font-size: 1.14667rem;
      margin-right: .34667rem;
      line-height: 1.09333rem;
    }

    .text1 {
      font-size: 0.74667rem;
      line-height: 0.70667rem;
    }

    .text2 {
      font-size: 0.34667rem;
      letter-spacing: 0.01867rem;
      margin-top: 0.64rem;
      margin-bottom: 0.04rem;
      line-height: 0.33333rem;
      margin-left: 0.04rem;
      height: 0.33333rem;
    }

    .download {
      margin-top: 1.73333rem;
      display: flex;

      .item-box {
        width: 3.41333rem;
        height: 3.33333rem;
        border: 0.01333rem solid #fff;
        border-radius: 0.32rem;
        background-color: rgba(255, 255, 255, 0.4);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin-right: 0.53333rem;
        position: relative;

        .clientErr {
          width: 3.41333rem;
          height: 0.45333rem;
          line-height: 0.45333rem;
          font-size: 0.16rem;
          color: #fff;
          text-align: center;
          background: url("../assets/download/jbs.jpg");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 999;
        }

        .type {
          display: flex;
          align-items: center;

          img {
            width: 0.29333rem;
            margin-right: 0.2rem;
          }

          span {
            font-size: 0.32rem;
            color: #000;
            line-height: 0.32rem;
          }
        }

        >img {
          width: 1.74667rem;
          height: 1.74667rem;
          border-radius: 4px;
        }

        >span {
          font-size: 0.21333rem;
          color: #666;
          line-height: 0.22667rem;
        }
      }

      .items-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .item {
          width: 3.54667rem;
          height: 0.85333rem;
          border: 0.01333rem solid #fff;
          border-radius: 0.32rem;
          background-color: rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          cursor: pointer;

          img {
            width: 0.53333rem;
            margin-left: 0.26667rem;
            margin-right: 0.18667rem;
          }

          span {
            font-size: 0.32rem;
            color: #000;
            line-height: 0.32rem;
          }
        }
      }
    }
  }

  .bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 11.5px 190px;
    padding-bottom: 14px;
    display: flex;
    justify-content: space-between;

    .icon-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 100px;

      >img {
        height: 26px;
        margin-bottom: 7.5px;
      }

      >span {
        font-size: 14px;
        font-family: Arial Regular, Arial Regular-Regular;
        font-weight: 400;
        color: #000;
        line-height: 11px;
      }

      .code-box {
        position: absolute;
        top: -135px;
        left: -10px;
        z-index: 1;

        >img {
          height: 130px;
        }

        .contents {
          position: absolute;
          left: 15px;
          right: 15px;
          top: 0;
          bottom: 7px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;

          img {
            width: 72px;
          }

          span {
            font-size: 8px;
            width: 55px;
            text-align: center;
          }
        }
      }

      .tip {
        position: absolute;
        top: -39px;
        width: 176px;
        height: 25.5px;
        border: 0.5px solid #eee;
        border-radius: 12.5px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #575f66d8;

        img {
          width: 12.5px;
        }

        .text {
          font-size: 8px;
          color: #fff;
        }
      }
    }

    .icon-box:first-child .tip {
      width: 192px;
    }
  }
}

.page1 {
  position: relative;
  height: 460.5px;

  .box {
    position: absolute;
    top: 198.5px;
    right: 191.5px;
    display: flex;
    flex-direction: column;

    span {
      font-size: 24px;
      line-height: 23px;
    }

    img {
      width: 214.5px;
      margin-top: 24px;
    }
  }

  >img {
    position: absolute;
    top: 92px;
    right: 459px;
    height: 369px;
  }
}

.foot {
  padding-top: 44.5px;
  padding-bottom: 26px;
  font-size: 12px;
  text-align: center;

  p {
    color: unset;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      color: unset;
      display: inline-flex;
      align-items: center;

      img {
        margin-left: 10px;
        margin-right: 5px;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.bg {
  display: block;
  width: 100%;
  // height: 100vh;
}

.bold {
  font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;
  font-weight: 700;
  color: #000;
}

.regular {
  font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
  font-weight: 400;
  color: #666;
}

.button {
  width: 4.01333rem;
  line-height: 1.32rem;
  border: 0.01333rem solid #eee;
  border-radius: 0.65333rem;
  font-size: 0.42667rem;
  color: #fff;
  background-color: #e71919;
  text-align: center;
  cursor: pointer;
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .text {
    font-size: 42px;
    margin-top: 67.5px;
  }

  .text1 {
    font-size: 25px;
    margin-top: 14.5px;
  }

  .text2 {
    width: 240px;
    height: 40px;
    font-size: 16px;
    text-align: center;
    margin-top: 21.5px;
    margin-bottom: 54.3px;
  }

  img {
    width: 358.5px;
    margin-top: 50.3px;
  }
}

.content1 {
  display: flex;
  flex-direction: column;
  align-items: center;

  .text {
    font-size: 25px;
    line-height: 24px;
    margin-top: 43px;
  }

  .text3 {
    width: 239px;
    margin-top: 21.5px;
  }

  .pic1 {
    width: 305.3px;
    margin-top: 33.8px;
    margin-bottom: 24.5px;
  }

  .text1 {
    font-size: 0.34667rem;
    margin-top: 0.96rem;
    margin-bottom: 1.16rem;

    p {
      color: unset;
      text-align: center;

      a {
        color: unset;

        img {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
