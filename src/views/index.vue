<template>
  <div class='clearfix'>
    <JmeetingWeb v-if="ishow" :meetingObj=meetingObj :basic="basic" @leaveMeeting="goBack('quitMeet')"
      @closeMeeting="goBack('closeMeeting')" @recordStart="recordStart" @recordEnd="recordEnd" @callFailed="goBack()"
      @callSuccess="callSuccess" />
  </div>
</template>
<script>
import imMethods from '../tools/imMethods';
import { tools } from "../tools/tool";
import { jpassConfig } from '../common/config.js';
import { jmeetingWebAPI as jmeetingAPI } from "../services/meeting";
export default {
  data() {
    return {
      meetingObj: {
        "liveId": "",
        "liveMode": 1,
        "userId": "",
        "userIdJoin": "",
        "liveCreatorId": "",
        "liveName": "",
        "liveType": "",
        "Initiator": 0,
        "userName": "",
        "mainWindowUserid": "",
        "isScreenShare": [false, "", ""],
        "phoneNumber": "",
        "isDisconnected": true,
        "audioOpen": false,
        "videoOpen": false,
        "allUserList": [],
        "unOnline": [],
        "listActive": 0,
        "isRecord": false,
        "isAllowTips": true,
        "isAllowInvite": true,
        "isShowControlls": true,//会议解答
        recordBtnControl: true,//录制按钮
      },
      basic,
      electron: "",
      ishow: false
    };
  },
  watch: {
    'meetingObj.audioOpen'(newVal) {
      this.rememberStatus('audioOpen', newVal)
    },
    'meetingObj.videoOpen'(newVal) {
      this.rememberStatus('videoOpen', newVal)
    },
    'meetingObj.liveMode'(newVal) {
      this.rememberStatus('liveMode', newVal)
    },
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    window.removeEventListener('visibilitychange', this.handleVisibilityChange);
    // window.removeEventListener('online', this.liveIdClick());
  },
  mounted() {
    // window.addEventListener("online", this.liveIdClick());
    window.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  methods: {
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        console.log('电脑从睡眠状态唤醒了');
        this.liveIdClick()
      }
    },
    init() {
      sessionStorage.removeItem('isSharing')
      let userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.indexOf('electron') > -1) {
        // 判断是否在盒子，显示 停止共享
        this.electron = 1
      }
      this.meetingObj.audioOpen = imMethods.getUrlParams('audioOpen')
      this.meetingObj.videoOpen = imMethods.getUrlParams('videoOpen')
      this.meetingObj.liveId = imMethods.getUrlParams('liveId')
      this.meetingObj.liveMode = imMethods.getUrlParams('liveMode')
      this.meetingObj.phoneNumber = imMethods.getUrlParams('phoneNumber')
      if (imMethods.getUrlParams('userId')) {
        this.meetingObj.userId = imMethods.getUrlParams('userId')
        this.meetingObj.userIdJoin = imMethods.getUrlParams('userId')
        this.meetingObj.userName = imMethods.getUrlParams('userName')
      } else if (imMethods.getUrlParams('phoneNumber')) {
        this.meetingObj.userIdJoin = tools.encrypt(imMethods.getUrlParams('phoneNumber'), jpassConfig.publicKey)
        this.meetingObj.userName = imMethods.getUrlParams('userName')
        this.meetingObj.recordBtnControl = false;
      } else if (!imMethods.getUrlParams('userId') && !imMethods.getUrlParams('phoneNumber')) {
        //外网参会人员
        this.meetingObj.userIdJoin = ""
        this.meetingObj.userName = imMethods.getUrlParams('userName')
        this.meetingObj.recordBtnControl = false;
      }
      this.ishow = true;
    },
    // 会议是否结束以及是否和其他端冲突
    liveIdClick(e) {
      console.log('liveIdClick');

      let paramas = {
        myId: this.meetingObj.userId,
        jmeeting: this.meetingObj.userId,
        liveId: this.meetingObj.liveId,
        clientType: 3,//3:pc
      }
      jmeetingAPI.clientIsConflict(paramas)
        .then((res) => {
          if (res.success) {
            if (res.data.isClosed) {
              this.$toast("会议已结束")
              this.goBack()
            }
            // 已在其他设备接听
            if (res.data.isConflict) {
              this.$toast("当前账号有其他设备正在会议中")
              this.goBack()
            }
          }
        })
    },
    // 返回首页
    goBack(data) {
      console.log('goBack,goBack');
      console.log(data);
      // 内部-原来   外部-主持人-历史 其他-登录页   混合-主持人-原来 其他人-有电话-首页-无-原来
      if (!this.meetingObj.liveMode || this.meetingObj.liveMode == 0 || this.meetingObj.liveMode == 1 && !this.meetingObj.phoneNumber) {
        let userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.indexOf('electron') > -1) {
          window.electron.closeMeeting(location.href)
        } else {
          window.location.href = jpassConfig.backUrl
        }
      } else if (this.meetingObj.liveMode == 1 && this.meetingObj.phoneNumber || this.meetingObj.liveMode == -1 && !this.meetingObj.phoneNumber) {
        //如果是离开会议 跳转验证页面 
        if (data == 'quitMeet') {
          this.$router.push({ path: '/check', query: { liveId: this.meetingObj.liveId, liveMode: this.meetingObj.liveMode } })
        } else {
          this.$router.replace({ path: '/login' })
        }
      } else if (this.meetingObj.liveMode == -1 && this.meetingObj.phoneNumber) {
        let userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.indexOf('electron') > -1) {
          window.electron.closeMeeting(location.href)
        } else {
          this.$router.replace({ path: '/historyMeet', query: { userName: this.meetingObj.userName, phoneNumber: this.meetingObj.phoneNumber } })
        }
      } else {
        let userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.indexOf('electron') > -1) {
          window.electron.closeMeeting(location.href)
        } else {
          history.back()
        }
      }
    },
    //记录摄像头麦克风状态 记录路径上参数
    rememberStatus(status, newValue) {
      const query = this.$router.history.current.query;
      const path = this.$router.history.current.path;
      // 对象的拷贝
      const newQuery = JSON.parse(JSON.stringify(query));
      // 地址栏的参数值赋值
      newQuery[status] = newValue;
      this.$router.replace({ path, query: newQuery });
    },
    // 录制开始
    recordStart(res) {
      if (!res.success) {
        this.$message.error(res.message)
      }
    },
    // 录制结束
    recordEnd() {
      console.log('录制结束');
    },
    callSuccess() {
      console.log('接受会议成功');
    }
  },
};
</script>
<style lang="less" scoped>
.clearfix {
  height: 100vh;
}
</style>