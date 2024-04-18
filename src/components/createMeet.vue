<template>
  <div class="createMeetMain" v-if="isCreateMeet">
    <el-dialog title="选择联系人" :visible.sync="isCreateMeet" width="540px" :before-close="() => { isCreateMeet = false; }">
      <p class="meetTheme">会议主题</p>
      <input class="themeInput" @input="meetNameInput" type="text" v-model="meetName" placeholder="请输入会议主题">
      <div class="middle">
        <div class="name" v-if="userName">{{ userName.substring(userName.length - 2) }}</div>
      </div>
      <footer>
        <div class="operaBox">
          <div class="operaBoxItem" @click="() => { isAudio = !isAudio }">
            <!-- <div class="operaBoxImg"> -->
            <img class="pointer" v-if="isAudio" src="../assets/image/audio.svg" alt="">
            <img class="pointer" v-if="!isAudio" src="../assets/image/noaudio.svg" alt="">
            <!-- </div> -->
            <span>麦克风</span>
          </div>
          <div class="operaBoxItem" @click="() => { isVidio = !isVidio }">
            <!-- <div class="operaBoxImg"> -->
            <img class="pointer" v-if="isVidio" src="../assets/image/video.svg" alt="">
            <img class="pointer" v-if="!isVidio" src="../assets/image/novideo.svg" alt="">
            <!-- </div> -->
            <span>摄像头</span>
          </div>
        </div>
        <button class="jumpmeetBtn pointer" @click="createMeet">进入会议</button>
      </footer>
      <!-- <div class="unuse"></div> -->
      <!-- <van-field v-model="meetName" label="文本" placeholder="请输入用户名" /> -->
    </el-dialog>
    <ExcessReminder v-if="showTips" tipsText="当前账号已失效，请联系我们升级正式版，升级后将享有不限人数不限时长的高清会议权益"
      @afterConfirm="showTips = false" />
  </div>
</template>
<script>
import ExcessReminder from "./ExcessReminder.vue"
import { jmeetingWebAPI } from '../services/jmeeting'
import { tools } from "../tools/tool";
// import requestJpaas from '../tools/jpaas_request'
import { jpassConfig } from '../common/config.js'
import imMethods from '../tools/imMethods'
export default {
  components: {
    ExcessReminder
  },
  data() {
    return {
      userName: '',
      meetName: "",//会议名称
      isAudio: true,//麦克风
      isVidio: false,//摄像头
      isCreateMeet: false,//是否显示创会页面
      timeout: null,//创建会议防抖
      electron: false,
      showTips: false,
    }
  },
  methods: {
    //监听会议名称不超过30个字
    meetNameInput() {
      if (this.meetName.length > 30) {
        this.meetName = this.meetName.slice(0, 30);
        this.$toast('视频会议名称不能超过30个字');
      }
    },
    open() {
      this.isCreateMeet = true;
    },
    createMeet() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        let friendIds = [];
        friendIds.push(tools.encrypt(this.phoneNumber, jpassConfig.publicKey));
        console.log(friendIds);
        jmeetingWebAPI
          .externalCreate({
            // friendIds:friendIds,//会话好友ids
            groupIds: [],
            liveName: this.meetName,//会议名称
            liveSponsorId: tools.encrypt(this.phoneNumber, jpassConfig.publicKey),//发起人id
            // jmeeting:tools.encrypt(this.phoneNumber,jpassConfig.publicKey),
            jmeeting: '12345678901234567890123456789012',
            liveSponsorName: this.userName,//发起人姓名
            liveType: 1,    //0语音，1视频
            clientType: 3,  //1安卓 2ios 3web
            // userId: this.userId,
            audioOpen: this.isAudio,//麦克风
            videoOpen: this.isVidio,//摄像头
            liveCreatorId: tools.encrypt(this.phoneNumber, jpassConfig.publicKey),
            liveCreatorName: this.userName,
            userType: -1,//用户类型，-1外部用户 0内部用户
            liveMode: -1,//会议模式，-1外部会议 0内部会议 1混合会议
          })
          .then(async (res) => {
            console.log(res);
            if (res.success && res.code == '200') {
              // this.$router.replace({ path: '/index', query: { liveId: res.data.webrtcCallLink.roomId, userName: this.userName, phoneNumber: this.phoneNumber, audioOpen: this.isAudio, videoOpen: this.isVidio, liveMode: -1 } })
              this.jumpMeet(res)
            } else if (res.code == '201') {
              this.showTips = true;
            } else {
              this.$message.error(res.message);
            }
          })
      }, 1000)
    },
    //进入会议
    jumpMeet(res) {
      // this.$router.replace({path:'/index',query: {liveId:res.data.webrtcCallLink.roomId,userName:this.userName,phoneNumber:this.phoneNumber,audioOpen:this.isAudio,videoOpen:this.isVidio,liveMode:-1}})
      if (this.electron) {
        let url = `${location.pathname}#/index?liveId=${res.data.webrtcCallLink.roomId}&phoneNumber=${this.phoneNumber}&userName=${this.userName}&liveMode=-1&audioOpen=${this.isAudio}&videoOpen=${this.isVidio}`
        // IM ifream嵌入后检测不到openMeeting，使用open跳转
        if (window.electron) {
          window.electron.openMeeting(url)
        } else {
          window.open(url)
        }
        // 刷新页面
        this.isCreateMeet = false;
        this.$emit('reloadList')
      } else {
        this.$router.replace({
          path: '/index',
          query: {
            liveId: res.data.webrtcCallLink.roomId,
            phoneNumber: this.phoneNumber,
            userName: this.userName,
            liveMode: '-1',
            audioOpen: this.isAudio,
            videoOpen: this.isVidio
          }
        })
      }
    },
  },
  created() {
    // 判断是否在盒子
    let userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('electron') > -1) {
      this.electron = true;
    }
  },
  mounted() {
    this.phoneNumber = imMethods.getUrlParams('phoneNumber');
    this.userName = imMethods.getUrlParams('userName');
    this.meetName = this.userName + '发起的视频会议';
    // this.userId = imMethods.getUrlParams('userId');
    // console.log(this.userName,this.userId);
  }
}
</script>
<style lang='less' scoped>
.createMeetMain {
  // display: flex;
  // flex-direction: column;
  // background: #171A1D;
  // align-items: center;
  // height: 100vh;

  ::v-deep .el-dialog {
    border-radius: 4px;
    overflow: hidden;
  }

  ::v-deep .el-dialog__header {
    display: none;
  }

  ::v-deep .el-dialog__body {
    background: #333333;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
  }

  .meetTheme {
    font-size: 18px;
    color: #FFFFFF;
    opacity: 0.5;
    font-weight: 500;
  }

  .themeInput {
    width: 250px;
    background: #333333;
    border-bottom: 1px solid #1890FF;
    text-align: center;
    font-size: 24px;
    color: #FFFFFF;
    margin: 8px 0 24px;
    padding: 4px 0;
  }

  .middle {
    width: 100%;
    height: 240px;
    background: #232425;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    .name {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #0088FE;
      color: #fff;
      font-size: 22px;
      text-align: center;
      line-height: 70px;
    }
  }

  input::-webkit-input-placeholder {
    color: #fff;
  }

  input:-moz-placeholder {
    color: #fff;
  }

  input::-moz-placeholder {
    color: #fff;
  }

  input:-ms-input-placeholder {
    color: #fff;
  }

  // .unuse{
  //   flex: 1;
  // }
  footer {
    display: flex;
    padding: 20px 0 8px;
    width: 100%;
    justify-content: space-between;
  }

  .operaBox {
    display: flex;

    .operaBoxItem {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 24px;
        height: 24px;
      }

      span {
        margin-top: 6px;
        font-size: 14px;
        color: #FFFFFF;
        /* text-align: center; */
        font-weight: 500;
      }
    }

    .operaBoxItem:nth-of-type(2) {
      margin-left: 30px;
    }
  }

  .jumpmeetBtn {
    background: #1890FF;
    border-radius: 4px;
    width: 100px;
    height: 32px;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    line-height: 22px;
  }
}
</style>
