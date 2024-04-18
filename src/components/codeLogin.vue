<template>
  <div class="codeLoginMain">
    <span class="title">{{ userMessage.userName }}发起的会议</span>
    <span class="time">{{ date }}&nbsp;&nbsp;{{ day }}</span>
    <!-- <span class="time">{{time}}</span> -->
    <!-- <span class="title">会议体验入口</span> -->
    <div class="codeBox">
      <div class="code" ref="codeRef"></div>
      <span>扫码入会</span>
    </div>
    <button @click="jumpMeet">
      <span>立即入会</span>
      <img src="../assets/image/rightArrow.png" alt="">
    </button>
  </div>
</template>
<script>
import { meetUrl_h5 } from '../common/config.js'
import QRCode from 'qrcodejs2'
export default {
  name: 'CodeLogin',
  props: ['userMessage'],
  components: {},
  data() {
    return {
      // userMessage:{
      //   userName: '陈畅',
      //   phoneNumber: '17356174080'
      // },
      day: '',//星期几
      date: '',//日期
      time: '',//时间
    }
  },
  methods: {
    weekDay(time) {
      let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六',]
      return datelist[new Date(time).getDay()];
    },
    getDate() {
      let date = new Date();
      console.log(date);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      this.date = Y + M + D;
      this.time = date.getHours() + ':00' + '-' + (date.getHours() + 1) + ':00';
      this.day = this.weekDay(this.date);
    },
    creatQrCode() {
      let url = meetUrl_h5 + 'createMeet' + '?userName=' + this.userMessage.userName + '&phoneNumber=' + this.userMessage.phoneNumber + '&liveMode=-1';
      var code = new QRCode(this.$refs.codeRef, {
        text: url, // 需要转换为二维码的内容
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    //跳转至创建会议页面
    jumpMeet() {
      this.$router.push({ path: '/historyMeet', query: { userName: this.userMessage.userName, phoneNumber: this.userMessage.phoneNumber, isCreate: true } })
    }
  },
  computed: {},
  watch: {},
  beforeDestroy() { },
  created() { },
  mounted() {
    this.getDate();
    this.creatQrCode();
  },
}
</script>

<style lang="less" scoped>
.codeLoginMain {
  width: 50%;
  min-width: 450px;
  aspect-ratio: 64/67; //宽/高
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // box-shadow: 0 4px 64px 0 #0000000f;
  border-radius: 15px;

  .title {
    font-weight: 500;
    font-size: 30px;
    // font-size: 0.4rem;
    color: #333333;
    margin-bottom: 20px;
    // margin-bottom: 0.26rem;
  }

  .time {
    font-weight: 400;
    font-size: 16px;
    // font-size: 0.213rem;
    color: #333333;
  }

  .codeBox {
    display: flex;
    flex-direction: column;
    margin-top: 22px;
    border: 1px solid #ddd;
    padding: 30px 30px 20px;
    align-items: center;

    .code {
      width: 180px;
      height: 180px;
    }

    span {
      font-weight: 400;
      font-size: 16px;
      color: #999999;
      margin-top: 20px;
    }
  }

  button {
    margin-top: 30px;
    // margin-top: 0.4rem;
    display: flex;
    align-items: center;
    cursor: pointer;

    span {
      font-weight: 500;
      font-size: 24px;
      // font-size: 0.32rem;
      color: #297DFF;
    }

    img {
      width: 22px;
      height: 20px;
      margin-left: 12px;
      // width: 0.293rem;
      // height: 0.266rem;
      // margin-left: 0.16rem;
    }
  }
}</style>
