<template>
  <div class="bottomOperaMain">
    <div class="mainLeft">
      <div class="itemOpera" v-if="!btn_muteShowOhide" @click="btn_mute">
        <img class="itemOperaImg" src="../assets/bottomOpera/jcjyx.png" alt />
        <span style="padding-top: 3px" class="itemOperaText">静音</span>
      </div>
      <div class="itemOpera" v-if="btn_muteShowOhide" @click="btn_unmute">
        <img class="itemOperaImg" src="../assets/bottomOpera/jyx.png" alt />
        <span style="padding-top: 3px" class="itemOperaText">解除静音</span>
      </div>
      <div class="itemOpera" v-if="enableWebcamShowOhide" @click="btn_disableWebcam()" style="margin-left: 20px;">
        <img class="itemOperaImg" src="../assets/bottomOpera/gbspx.png" alt />
        <span class="itemOperaText">关闭视频</span>
      </div>
      <div :class="meetingObj.liveType == 1 ? 'itemOpera' : 'itemOpera itemOperaAudio'" v-if="!enableWebcamShowOhide"
        @click="btn_enableWebcam()">
        <img class="itemOperaImg" src="../assets/bottomOpera/kqspx.png" alt />
        <span class="itemOperaText">开启视频</span>
      </div>
      <div :class="meetingObj.liveType == 1 ? 'itemOpera' : 'itemOpera itemOperaAudio'" v-if="isSharing"
        @click="newSharing">
        <img class="itemOperaImg" src="../assets/bottomOpera/shareScreenOther.svg" alt />
        <span class="itemOperaText">新的共享</span>
      </div>
      <div class="itemOpera" v-if="isSharing" @click="btn_dissharing"
        style="margin-left: 20px; cursor: pointer; margin-top: 14px">
        <img class="itemOperaImgs" src="../assets/bottomOpera/shareScreen.svg" alt />
        <span class="itemOperaText">关闭共享</span>
      </div>
      <div :class="meetingObj.liveType == 1 ? 'itemOpera' : 'itemOpera itemOperaAudio'" v-if="!isSharing"
        @click="shareScreen">
        <img class="itemOperaImg" src="../assets/bottomOpera/shareScreenOther.svg" alt />
        <span class="itemOperaText">开启共享</span>
      </div>
    </div>
    <div class="mainMiddle">
      <div class="itemOpera" v-if="meetingObj.isAllowInvite" @click="selectContactFn">
        <img class="itemOperaImg" src="../assets/bottomOpera/yq.png" alt />
        <span class="itemOperaText">邀请</span>
      </div>
      <div class="itemOpera" @click="memberShow">
        <img class="itemOperaImg" src="../assets/bottomOpera/cy.png" alt />
        <span class="itemOperaText">成员</span>
      </div>
      <template v-if="meetingObj.recordBtnControl && meetingObj.hostId === meetingObj.userIdJoin">
        <div v-if="!meetingObj.isRecord" class="itemOpera" @click="btn_record">
          <!-- meetingObj.Initiator == '1' &&  -->
          <img class="itemOperaImg" src="../assets/bottomOpera/recordIconWhite.png" alt />
          <span class="itemOperaText">录制</span>
          <!-- <div class="modeBox" v-if="isShowRecordSelect">
          <div class="modeItem">
            <span class="modeName">云录制</span>
          </div>
          <div class="modeItem">
            <span class="modeName">本地录制</span>
          </div>
        </div> -->
        </div>
        <div v-if="meetingObj.isRecord" class="itemOpera" @click="btn_record">
          <!-- meetingObj.Initiator == '1' &&  -->
          <img class="itemOperaImg" src="../assets/bottomOpera/recordIconRed.png" alt />
          <span class="itemOperaText">结束录制</span>
        </div>
      </template>
      <div v-if="meetingObj.Initiator == '1' && meetingObj.liveMode !== -1" class="itemOpera setmodeBtn">
        <img class="itemOperaImg" src="../assets/bottomOpera/set.png" alt @click="() => { isSetMode = !isSetMode }" />
        <span class="itemOperaText" @click="() => { isSetMode = !isSetMode }">设置</span>
        <div class="modeBox" v-if="isSetMode">
          <span class="modeTitle">入会范围</span>
          <div class="modeItem" v-for="(item, index) in modeList" @click="modeChange(item, index)">
            <div v-if="item.active" class="modeActive">
              <div class="modeInner"></div>
            </div>
            <div v-if="!item.active" class="modeNotactive"></div>
            <span class="modeName">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mainRight">
      <span class="mainRightText" :class="isQuitGroup ? 'mainRightTextActive' : ''" @click="clickQuitGroup">{{
        !isQuitGroup ?
        (meetingObj.Initiator == 1 ? '结束' : '离开') : "取消" }}</span>
      <!-- 结束会议弹窗 -->
      <QuitMeet :Initiator="meetingObj.Initiator" ref="quitMeetingRef" :meetingObj="meetingObj" :stlist="stlist"
        @goBack="goBack" @transferHost="openTransferHost">
      </QuitMeet>
      <!-- 转移主持人弹窗 -->
      <transfer-host :visible.sync="isShowTransfer" @changeBtn="changeBtn" :stlist="stlist" :meetingObj="meetingObj"
        @goBack="goBack"></transfer-host>
    </div>
    <!-- 邀请弹窗 -->
    <SelectContact v-if="isSelectContact" :liveMode="meetingObj.liveMode" :selectType=6 :maxUser="maxUser" :type="2"
      :isSelectContact.sync="isSelectContact" @closeSelectContact="closeSelectContact" :chooseMemebers="stlist"
      :meetingObj="meetingObj" :initLiveInfo="initLiveInfo" :basic="basic">
      <template slot="selectContactSlot">
        <slot v-if="$slots.selectContact" name="selectContact"></slot>
      </template>
    </SelectContact>
    <share-screen :visible.sync="isShowScreen" :videoObj="videoObj" @shareScreen="shareScreenEnd"></share-screen>
  </div>
</template>
<script>
import { jmeetingWebAPI } from '../services/jmeeting'
import { Modal } from 'ant-design-vue'
import QuitMeet from './CloseMeeting'
import SelectContact from './SelectContact'
import TransferHost from './TransferHost'
import ShareScreen from './ShareScreen'
// import imMethods from '../tools/imMethods'
const { RoomEvent } = require('livekit-client')//, Room, RemoteParticipant
const decoder = new TextDecoder()
const encoder = new TextEncoder()
export default {
  name: 'BottomOpera',
  components: {
    SelectContact,
    QuitMeet,
    TransferHost,
    ShareScreen
  },
  props: ['localParticipant', 'stlist', 'isSharing', 'meetingObj', 'initLiveInfo', "basic"],
  data() {
    return {
      btn_muteShowOhide: true,//是否开启麦克风 false为开启
      enableWebcamShowOhide: false,//是否开启摄像头 true为开启
      // isSharing: false,//todo
      isSelectContact: false,
      // active: 'margin-left:20px;cursor:pointer;',//todo
      maxUser: 0,
      isSetMode: false,//是否展示入会设置
      // isShowRecordSelect: false,//是否展示录制选择框
      isQuitGroup: false,
      modeList: [{ label: 1, name: '所有人', active: false }, { label: 0, name: '仅企业内人员', active: true }],
      isShowTransfer: false,
      isShowScreen: false,
      videoObj: {}
    }
  },
  methods: {
    // DataReceived(payload, publication, kind) {
    //   // console.log('DataReceived--接收消息', decoder.decode(payload));
    //   let receivedData = JSON.parse(decoder.decode(payload)).data;
    //   if (receivedData.event != 'network') {
    //     console.log(receivedData);
    //   }
    //   //muteAll 全员静音
    //   if (receivedData.event == 'muteAll' && receivedData.liveId == this.liveId) {
    //     if (this.userId != receivedData.userId) {
    //       this.btn_mute();
    //     }
    //   }
    //   //mute 某人静音
    //   else if (receivedData.event == 'mute' && receivedData.liveId == this.liveId && receivedData.userId == this.userId) {
    //     this.btn_mute();
    //   }
    //   //changeLiveMode 修改会议模式
    //   else if (receivedData.event == 'changeLiveMode' && receivedData.liveId == this.liveId) {
    //     this.$store.commit('changeLiveMode', receivedData.liveMode);
    //     this.rememberStatus('liveMode', this.liveMode)
    //   }
    // },
    DataReceived(payload, publication, kind) {
      // console.log('DataReceived--接收消息', decoder.decode(payload));
      let receivedData = JSON.parse(decoder.decode(payload)).data;
      if (receivedData.event != 'network') {
        console.log(receivedData);
      }
      //muteAll 全员静音
      if (receivedData.event == 'muteAll' && receivedData.liveId == this.meetingObj.liveId) {
        if (this.meetingObj.userId != receivedData.userId) {
          this.btn_mute();
        }
      }
      //mute 某人静音
      else if (receivedData.event == 'mute' && receivedData.liveId == this.meetingObj.liveId && receivedData.userId == this.meetingObj.userId) {
        this.btn_mute();
      }
      //changeLiveMode 修改会议模式
      else if (receivedData.event == 'changeLiveMode' && receivedData.liveId == this.meetingObj.liveId) {
        this.meetingObj.liveMode = receivedData.liveMode
        this.rememberStatus('liveMode', this.meetingObj.liveMode)
      }
    },
    // async ininRoom() {
    //   //重连后获取路径中摄像头麦克风状态
    //   if (imMethods.getUrlParams('videoOpen') == 'true') {
    //     this.btn_enableWebcam();
    //   }
    //   if (imMethods.getUrlParams('audioOpen') == 'true') {
    //     this.btn_unmute();
    //   }
    //   //接受消息
    //   this.$room.on(RoomEvent.DataReceived, this.DataReceived);
    // },
    async ininRoom() {
      //重连后获取路径中摄像头麦克风状态
      if (this.meetingObj.videoOpen == 'true' || (typeof (this.meetingObj.videoOpen) === 'boolean' && this.meetingObj.videoOpen)) {
        console.log('<---this.meetingObj.videoOpen--->', this.meetingObj.videoOpen)
        this.btn_enableWebcam();
      }
      if (this.meetingObj.audioOpen == 'true') {
        this.btn_unmute();
      }
      //接受消息
      this.$room.on(RoomEvent.DataReceived, this.DataReceived);
    },
    selectContactFn() {
      // this.isSelectContact = true;
      if(this.meetingObj.singleMaxParticipants && this.stlist.length && !(this.meetingObj.singleMaxParticipants > this.stlist.length)) {
        this.$emit('showPeopleOver')
      } else {
        this.getMaxUser();
      }
    },
    closeSelectContact() {
      this.isSelectContact = false
    },
    //获取会议允许最大人数
    // getMaxUser() {
    //   jmeetingWebAPI
    //     .meetingSetting({
    //       // jmeeting:this.userIdJoin,
    //       jmeeting: '12345678901234567890123456789012',
    //       myId: this.userId,
    //     })
    //     .then((res) => {
    //       console.log('getMaxUser', res);
    //       this.isSelectContact = true;
    //       if (res.success) {
    //         this.maxUser = res.data.meetingSetting.maxUser;
    //         console.log(this.maxUser);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(`离开会议err`, err)
    //     })
    // },
    //获取会议允许最大人数 组件化
    getMaxUser() {
      jmeetingWebAPI
        .meetingSetting({
          // jmeeting:this.userIdJoin,
          jmeeting: '12345678901234567890123456789012',
          myId: this.meetingObj.userId,
        })
        .then((res) => {
          console.log('getMaxUser', res);
          this.isSelectContact = true;
          if (res.success) {
            this.maxUser = res.data.meetingSetting.maxUser;
            console.log(this.maxUser);
          }
        })
        .catch((err) => {
          console.log(`离开会议err`, err)
        })
    },
    //记录摄像头麦克风状态 记录路径上参数
    // rememberStatus(status, newValue) {
    //   const query = this.$router.history.current.query;
    //   const path = this.$router.history.current.path;
    //   // 对象的拷贝
    //   const newQuery = JSON.parse(JSON.stringify(query));
    //   // 地址栏的参数值赋值
    //   if (status == 'liveMode') {
    //     newQuery.liveMode = newValue;
    //   } else if (status == 'audio') {
    //     newQuery.audioOpen = newValue;
    //   } else {
    //     newQuery.videoOpen = newValue;
    //   }
    //   this.$router.replace({ path, query: newQuery });
    // },
    //记录摄像头麦克风状态 记录路径上参数 组件化
    rememberStatus(status, newValue) {
      // 地址栏的参数值赋值
      if (status == 'liveMode') {
        this.meetingObj.liveMode = newValue;
      } else if (status == 'audio') {
        this.meetingObj.audioOpen = newValue;
      } else {
        this.meetingObj.videoOpen = newValue;
      }
      // this.$router.replace({ path, query: newQuery });
    },
    btn_disableWebcamB() {
      this.localParticipant.setCameraEnabled(false)
        .then((res) => { })
    },
    // 关闭摄像头
    // btn_disableWebcam() {
    //   if (this.isSharing) {
    //     this.$message['warning']('屏幕共享中,无法操作')
    //     return
    //   }
    //   this.localParticipant.setCameraEnabled(false)
    //     .then((res) => {
    //       console.log('disableWebcam--------------------->关摄像头')
    //       this.enableWebcamShowOhide = false
    //       this.rememberStatus('video', false)
    //       let index = this.stlist.findIndex((item) => { return this.userId == item.identity })
    //       this.$parent.setVideo(index, false);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       // this.$toast('关闭摄像头失败')
    //       this.$parent.errTipText = "关闭摄像头失败";
    //       this.$parent.showErrTips = true;
    //       this.enableWebcamShowOhide = true
    //       this.rememberStatus('video', true)
    //     })
    // },
    // 关闭摄像头 组件式
    btn_disableWebcam() {
      console.log('关闭摄像头 通知-----------------')
      // if (this.isSharing) {
      //   this.$message['warning']('屏幕共享中,无法操作')
      //   return
      // }
      this.localParticipant.setCameraEnabled(false)
        .then((res) => {
          console.log('disableWebcam--------------------->关摄像头')
          this.enableWebcamShowOhide = false
          this.rememberStatus('video', false)
          let index = this.stlist.findIndex((item) => { return this.meetingObj.userId == item.identity })
          this.$parent.setVideo(index, false);
        })
        .catch((err) => {
          console.log('关闭摄像头失败', err.name + ": " + err.message);
          // this.$toast('关闭摄像头失败')
          this.$parent.errTipText = "关闭摄像头失败";
          this.$parent.showErrTips = true;
          this.enableWebcamShowOhide = true
          this.rememberStatus('video', true)
        })
    },
    // 开启摄像头
    // btn_enableWebcam() {
    //   //语音会议 无法开启摄像头
    //   if (this.liveType !== 1) return
    //   if (this.isSharing) {
    //     this.$message['warning']('屏幕共享中,无法操作')
    //     return
    //   }
    //   //视频推流
    //   this.localParticipant.setCameraEnabled(true, {
    //     facingMode: 'user'
    //   }, {
    //     audioPreset: 'musicHighQualityStereo',//musicHighQualityStereo telephone
    //     forceStereo: true,//立体声音轨
    //     videoCodec: 'VP9' | 'AV1' | 'H264' | 'VP8',//视频解码器
    //   })
    //     .then((res) => {
    //       console.log('liveket--------------------->开摄像头', res)
    //       this.enableWebcamShowOhide = true;
    //       this.rememberStatus('video', true);
    //       console.log(this.stlist, this.userId);
    //       let index = this.stlist.findIndex((item) => { return this.userId == item.identity })
    //       this.$parent.setVideo(index, true, res);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       // this.$toast('打开摄像头失败')
    //       if (err.message.indexOf('Permission denied') != '-1') {
    //         Modal.warning({
    //           title: '设备访问受限!',
    //           closable: true,
    //           content: '检测到摄像头未开启，请检查摄像头设置及应用是否被授权摄像头权限。',
    //           okText: '确定'
    //         })
    //       } else {
    //         this.$parent.errTipText = err.message;
    //         this.$parent.showErrTips = true;
    //       }
    //       this.enableWebcamShowOhide = false;
    //       this.rememberStatus('video', false);
    //     })
    // },
    // 开启摄像头 组件式
    btn_enableWebcam() {
      //语音会议 无法开启摄像头
      if (this.meetingObj.liveType !== 1) return
      // if (this.isSharing) {
      //   this.$message['warning']('屏幕共享中,无法操作')
      //   return
      // }
      //视频推流
      this.localParticipant.setCameraEnabled(true, {
        facingMode: 'user',
        resolution: {
          frameRate: { ideal: 10, max: 15 },//帧率
        }
      }, {
        audioPreset: 'musicHighQualityStereo',//musicHighQualityStereo telephone
        forceStereo: true,//立体声音轨
        videoCodec: 'VP9' | 'AV1' | 'H264' | 'VP8',//视频解码器
      })
        .then((res) => {
          console.log('liveket--------------------->开摄像头', res)
          this.enableWebcamShowOhide = true;
          this.rememberStatus('video', true);
          console.log(this.stlist, this.userId);
          let index = this.stlist.findIndex((item) => { return this.meetingObj.userId == item.identity })
          this.$parent.setVideo(index, true, res);
        })
        .catch((err) => {
          console.log('打开摄像头失败', err.name + ": " + err.message);
          // this.$toast('打开摄像头失败')
          if (err.message.indexOf('Permission denied') != '-1') {
            Modal.warning({
              title: '设备访问受限!',
              closable: true,
              content: '检测到摄像头未开启，请检查摄像头设置及应用是否被授权摄像头权限。',
              okText: '确定'
            })
          } else {
            this.$parent.errTipText = err.message;
            this.$parent.showErrTips = true;
          }
          this.enableWebcamShowOhide = false;
          this.rememberStatus('video', false);
        })
    },
    // 关闭屏幕共享
    // btn_dissharing() {
    //   this.$parent.isSharing = false;
    //   setTimeout(() => {
    //     console.log(this.isSharing);
    //     if (imMethods.getUrlParams('videoOpen') == 'true') {
    //       this.btn_disableWebcam()
    //     }
    //     this.localParticipant.setScreenShareEnabled(false)
    //     this.$store.commit('changeScreenShare', [false, "", ""]);
    //   }, 0)
    // },
    // 关闭屏幕共享 组件式
    btn_dissharing() {
      this.$parent.isSharing = false;
      let that = this
      setTimeout(() => {
        console.log(this.isSharing);
        // if (this.meetingObj.videoOpen == 'true' || (typeof (this.meetingObj.videoOpen) === 'boolean' && this.meetingObj.videoOpen)) {
        //   this.btn_disableWebcam()
        // }
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if(this.$parent.select.identity === this.stlist[i].identity) {
            console.log('关闭共享---userId',this.stlist[i].identity,this.stlist[i].name)
            this.stlist[i].ShareStream = null
          }
        }
        this.localParticipant.setScreenShareEnabled(false)
        this.meetingObj.isScreenShare = [false, "", ""]
      }, 0)
    },
    async newSharing() {
      await this.btn_dissharing()
      let timer = setInterval(() => {
        console.log('开启定时器')
        if (this.meetingObj.isScreenShare[0] === false) {
          this.shareScreen()
          clearInterval(timer)
        }
      }, 100)
    },
    // 开启 屏幕共享
    // btn_sharing() {
    //   if (this.isScreenShare[0]) {
    //     this.$message['warning'](`当前${this.isScreenShare[1]}正在屏幕共享中`)
    //     return
    //   }
    //   //语音会议 无法开启屏幕共享
    //   if (this.liveType !== 1) return
    //   if (this.isSharing == true) {
    //     this.$message['warning']('屏幕共享中')
    //     return
    //   }
    //   // 开启屏幕共享后关闭摄像头
    //   if (imMethods.getUrlParams('videoOpen') == 'true') {
    //     this.btn_disableWebcam()
    //   }
    //   // 无摄像头推送桌面流
    //   this.localParticipant.setScreenShareEnabled(true,
    //     // {
    //     //   audio:true,//共享屏幕时，若该屏幕正在播放音频，其他人也可听到（兼容性有限）
    //     // }
    //   )
    //     .then((data) => {
    //       // console.log(this.localParticipant, this.stlist, this.isSharing);
    //       // 自己共享没有通知 需要开启
    //       this.$store.commit('changeScreenShare', [true, this.localParticipant.name, this.localParticipant.identity]);
    //       this.$parent.isSharing = true;
    //     })
    //     .catch((err) => {
    //       // if (err.message == 'Permission denied by system') {
    //       if (err.message.indexOf('Permission denied') != '-1' || err.message == 'Could not start video source') {
    //         Modal.warning({
    //           title: '设备访问受限!',
    //           closable: true,
    //           content: '应用未被授权屏幕录制的访问权限，请在系统偏好设置中授权访问权限。',
    //           okText: '确定'
    //         })
    //       } else {
    //         Modal.warning({
    //           title: '设备访问受限!',
    //           closable: true,
    //           content: err.message,
    //           okText: '确定'
    //         })
    //       }
    //       console.log(err, 'error')
    //     })
    // },

    // 屏幕共享前置判断
    async shareScreen() {
      if (this.meetingObj.isScreenShare[0]) {
        this.$message['warning'](`当前${this.meetingObj.isScreenShare[1]}正在屏幕共享中`)
        return
      }
      //语音会议 无法开启屏幕共享
      if (this.meetingObj.liveType !== 1) return
      if (this.isSharing == true) {
        this.$message['warning']('屏幕共享中')
        return
      }
      let userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('electron') > -1) {
        this.isShowScreen = true
      } else {
        this.btn_sharing()
      }
    },
    // 开启 屏幕共享 组件式
    btn_sharing(screenObj) {
      // 开启屏幕共享后关闭摄像头
      // if (this.meetingObj.videoOpen == 'true' || (typeof (this.meetingObj.videoOpen) === 'boolean' && this.meetingObj.videoOpen)) {
      //   this.btn_disableWebcam()
      // }
      console.log('触发共享前置,this.localParticipant', this.localParticipant)
      // 无摄像头推送桌面流
      this.localParticipant.setScreenShareEnabled(screenObj ? screenObj : '', true,
        {
          audio: true,//共享屏幕时，若该屏幕正在播放音频，其他人也可听到（兼容性有限）
        }
      )
        .then((data) => {
          // console.log(this.localParticipant, this.stlist, this.isSharing);
          // 自己共享没有通知 需要开启
          this.meetingObj.isScreenShare = [true, this.localParticipant.name, this.localParticipant.identity]
          this.$parent.isSharing = true;
          // // 判断是否在盒子 共享后缩小弹窗
          // let userAgent = navigator.userAgent.toLowerCase()
          // if (userAgent.indexOf('electron') > -1) {
          //   window.electron.handleMeetMinimize()
          // }
        })
        .catch((err) => {
          // if (err.message == 'Permission denied by system') {
          if (err.message.indexOf('Permission denied') != '-1' || err.message == 'Could not start video source') {
            Modal.warning({
              title: '设备访问受限!',
              closable: true,
              content: '应用未被授权屏幕录制的访问权限，请在系统偏好设置中授权访问权限。',
              okText: '确定'
            })
          } else {
            Modal.warning({
              title: '设备访问受限!',
              closable: true,
              content: err.message,
              okText: '确定'
            })
          }
          console.log('btn_sharing', err.name + ": " + err.message);
        })
    },
    //成员列表展示
    memberShow() {
      this.$parent.memberShowOhide = !this.$parent.memberShowOhide;
      // if (this.$parent.memberShowOhide == false) {
      //   // this.getMeetingUsers()
      //   this.$parent.memberShowOhide = true
      //   // this.active = "background-color: #eee;margin-left:20px;cursor:pointer;";
      // } else {
      //   // this.active = 'margin-left:20px;cursor:pointer;'
      //   this.$parent.memberShowOhide = false
      // }
    },

    //修改会议模式
    // modeChange(item, index) {
    //   // this.liveMode = item.label;
    //   jmeetingWebAPI
    //     .changeLiveMode({
    //       // jmeeting:this.userIdJoin,
    //       jmeeting: '12345678901234567890123456789012',
    //       liveId: this.liveId,
    //       userId: this.userIdJoin,
    //       liveMode: item.label//1-混合 0-内部 -1-外部
    //     })
    //     .then((res) => {
    //       if (res.success) {
    //         console.log(res);
    //         this.$store.commit('changeLiveMode', item.label);
    //         this.rememberStatus('liveMode', item.label);
    //         this.isSetMode = false;
    //         const strData = JSON.stringify({
    //           event: 'notify',
    //           data: {
    //             event: 'changeLiveMode',
    //             liveId: this.liveId,
    //             liveMode: this.liveMode
    //           },
    //         })
    //         const data = encoder.encode(strData);
    //         this.$room.localParticipant.publishData(data, 0);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(`err`, err)
    //     })
    // },
    //修改会议模式 组件式
    modeChange(item, index) {
      // this.liveMode = item.label;
      jmeetingWebAPI
        .changeLiveMode({
          // jmeeting:this.userIdJoin,
          jmeeting: '12345678901234567890123456789012',
          liveId: this.meetingObj.liveId,
          userId: this.meetingObj.userIdJoin,
          liveMode: item.label//1-混合 0-内部 -1-外部
        })
        .then((res) => {
          if (res.success) {
            console.log(res);
            // this.$store.commit('changeLiveMode', item.label);
            this.meetingObj.liveMode = item.label
            this.modeList.map((item, index) => {
              item.active = item.label == this.meetingObj.liveMode ? true : false;
            })
            this.rememberStatus('liveMode', item.label);
            this.isSetMode = false;
            const strData = JSON.stringify({
              event: 'notify',
              data: {
                event: 'changeLiveMode',
                liveId: this.meetingObj.liveId,
                liveMode: this.meetingObj.liveMode
              },
            })
            const data = encoder.encode(strData);
            this.$room.localParticipant.publishData(data, 0);
          }
        })
        .catch((err) => {
          console.log(`err`, err)
        })
    },
    //展示结束会议弹窗
    clickQuitGroup() {
      if (!this.isQuitGroup) {
        this.isQuitGroup = true;
        this.$refs.quitMeetingRef.open();
      } else {
        this.isQuitGroup = false;
        this.$refs.quitMeetingRef.isQuitGroup = false;
      }
      if (this.isShowTransfer) {
        this.isShowTransfer = false
      }
    },
    goBack(data) {
      this.$parent.goBack(data);
    },
    //静音
    // btn_mute() {
    //   this.localParticipant.setMicrophoneEnabled(false)
    //     .then(res => {
    //       console.log('静音');
    //       for (let i = 0; i < this.stlist.length; i++) {
    //         if (this.userId == this.stlist[i].identity) {
    //           this.$parent.setMute(i, true);
    //           this.btn_muteShowOhide = true
    //           this.rememberStatus('audio', false)
    //         }
    //       }
    //     })
    //     .catch(
    //       err => {
    //         console.log('关闭麦克风失败', err)
    //         // this.$toast('关闭麦克风失败')
    //         this.$parent.errTipText = "关闭麦克风失败";
    //         this.$parent.showErrTips = true;
    //         for (let i = 0; i < this.stlist.length; i++) {
    //           if (this.userId == this.stlist[i].identity) {
    //             this.$parent.setMute(i, false);
    //             this.btn_muteShowOhide = false;
    //             this.rememberStatus('audio', true)
    //           }
    //         }
    //       }

    //     )
    // },
    //静音 组件式
    btn_mute() {
      this.localParticipant.setMicrophoneEnabled(false)
        .then(res => {
          console.log('静音');
          for (let i = 0; i < this.stlist.length; i++) {
            if (this.meetingObj.userId == this.stlist[i].identity) {
              this.$parent.setMute(i, true);
              this.btn_muteShowOhide = true
              this.rememberStatus('audio', false)
            }
          }
        })
        .catch(
          err => {
            console.log('关闭麦克风失败', err.name + ": " + err.message)
            // this.$toast('关闭麦克风失败')
            this.$parent.errTipText = "关闭麦克风失败";
            this.$parent.showErrTips = true;
            for (let i = 0; i < this.stlist.length; i++) {
              if (this.meetingObj.userId == this.stlist[i].identity) {
                this.$parent.setMute(i, false);
                this.btn_muteShowOhide = false;
                this.rememberStatus('audio', true)
              }
            }
          }

        )
    },
    // 取消静音
    // btn_unmute() {
    //   console.log('取消静音');
    //   this.localParticipant.setMicrophoneEnabled(true, {
    //     echoCancellation: true,//回声取消
    //     noiseSuppression: true,//噪音抑制
    //     sampleRate: "48000Hz",//每秒采样的次数
    //     sampleSize: "32bit",//每个采样点的位数
    //   }, {
    //     audioPreset: 'musicHighQualityStereo',//musicHighQualityStereo telephone
    //   })
    //     .then((res) => {
    //       console.log('打开麦克风');
    //       this.isSetMute()
    //       for (let i = 0; i < this.stlist.length; i++) {
    //         if (this.userId == this.stlist[i].identity) {
    //           this.$parent.setMute(i, false);
    //           this.btn_muteShowOhide = false
    //           this.rememberStatus('audio', true)
    //         }
    //       }
    //     })
    //     .catch(
    //       err => {
    //         console.log('打开麦克风失败', err)
    //         if (err.message.indexOf('Permission denied') != '-1') {
    //           Modal.warning({
    //             title: '设备访问受限!',
    //             closable: true,
    //             content: '应用未被授权麦克风权限，请前往系统设置中授权。',
    //             okText: '确定'
    //           })
    //         } else {
    //           this.$parent.errTipText = err.message;
    //           this.$parent.showErrTips = true;
    //         }
    //         // 重新关闭
    //         for (let i = 0; i < this.stlist.length; i++) {
    //           if (this.userId == this.stlist[i].identity) {
    //             this.$parent.setMute(i, true);
    //             this.btn_muteShowOhide = true;
    //             this.rememberStatus('audio', false)
    //           }
    //         }
    //       }
    //     )
    // },
    // 取消静音 组件式
    btn_unmute() {
      console.log('取消静音');
      this.localParticipant.setMicrophoneEnabled(true, {
        autoGainControl: true,//自动增益控制
        // channelCount: 2,//1表示单声道，2为立体声
        echoCancellation: true,//回声取消
        latency: 1,//延时
        noiseSuppression: true,//噪音抑制
        sampleRate: 44100,//每秒采样的次数
        sampleSize: 16,//每个采样点的位数
      }, {
        audioPreset: 'musicHighQualityStereo',//musicHighQualityStereo telephone
      })
        .then((res) => {
          console.log('打开麦克风');
          this.isSetMute()
          for (let i = 0; i < this.stlist.length; i++) {
            if (this.meetingObj.userId == this.stlist[i].identity) {
              this.$parent.setMute(i, false);
              this.btn_muteShowOhide = false
              this.rememberStatus('audio', true)
            }
          }
        })
        .catch(
          err => {
            console.log('打开麦克风失败', err.name + ": " + err.message)
            if (err.message.indexOf('Permission denied') != '-1') {
              Modal.warning({
                title: '设备访问受限!',
                closable: true,
                content: '应用未被授权麦克风权限，请前往系统设置中授权。',
                okText: '确定'
              })
            } else {
              this.$parent.errTipText = err.message;
              this.$parent.showErrTips = true;
            }
            // 重新关闭
            for (let i = 0; i < this.stlist.length; i++) {
              if (this.meetingObj.userId == this.stlist[i].identity) {
                this.$parent.setMute(i, true);
                this.btn_muteShowOhide = true;
                this.rememberStatus('audio', false)
              }
            }
          }
        )
    },
    // 检测声音输入音量是否关闭
    // isSetMute() {
    //   if (navigator.mediaDevices) {
    //     navigator.mediaDevices.getUserMedia({ audio: true })
    //       .then((stream) => {
    //         const audioContext = new AudioContext();
    //         const audioSource = audioContext.createMediaStreamSource(stream);
    //         const analyser = audioContext.createAnalyser();
    //         audioSource.connect(analyser);

    //         let arr = [];
    //         this.computerMute = setInterval(() => {
    //           const dataArray = new Uint8Array(analyser.frequencyBinCount);
    //           analyser.getByteFrequencyData(dataArray);
    //           arr.push(...dataArray);
    //         }, 1000);


    //         setTimeout(() => {
    //           clearInterval(this.computerMute)
    //           console.log(arr);
    //           const allZeros = arr.every(item => item === 0);
    //           if (allZeros && imMethods.getUrlParams('audioOpen') == 'true') {
    //             this.$parent.errTipText = '检测到麦克风声音较小，请检查麦克风设置。';
    //             this.$parent.showErrTips = true;
    //           }
    //         }, 5000)
    //       })
    //       .catch((err) => {
    //         console.error(err);
    //       });
    //   }

    // },
    // 检测声音输入音量是否关闭
    isSetMute() {
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            audioSource.connect(analyser);

            let arr = [];
            this.computerMute = setInterval(() => {
              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(dataArray);
              arr.push(...dataArray);
            }, 1000);


            setTimeout(() => {
              clearInterval(this.computerMute)
              console.log(arr);
              const allZeros = arr.every(item => item === 0);
              if (allZeros && this.meetingObj.audioOpen == 'true') {
                this.$parent.errTipText = '检测到麦克风声音较小，请检查麦克风设置。';
                this.$parent.showErrTips = true;
              }
            }, 5000)
          })
          .catch((err) => {
            console.error(err);
          });
      }

    },
    btn_record() {
      // this.isShowRecordSelect = true
      if (!this.meetingObj.isRecord) {
        this.$emit('recordStart')
      } else {
        this.$emit('recordEnd')
      }
    },
    // 打卡转移主持人弹窗
    openTransferHost() {
      this.$refs.quitMeetingRef.isQuitGroup = false
      let numList = []
      JSON.parse(JSON.stringify(this.stlist)).forEach((item, index) => {
        if (this.stlist[index].identity === this.meetingObj.hostId) {
          numList.push(item.identity)
        }
        if (item.userType == '-1') {
          numList.push(item.identity)
        }
      })
      let arr = JSON.parse(JSON.stringify(this.stlist))
      numList.forEach(item => {
        arr.forEach((item2, index2) => {
          if (item2.identity === item) {
            arr.splice(index2, 1)
          }
        })
      })
      if (arr.length === 1) {
        let targetUserId = arr[0].identity
        let data = {
          liveId: this.meetingObj.liveId,
          userId: this.meetingObj.hostId,
          targetUserId: targetUserId,
          jmeeting: '12345678901234567890123456789012'
        }
        jmeetingWebAPI.transferHost(data).then(async (res) => {
          if (res.success) {
            // this.$message['success']('屏幕共享中,无法操作')
            const strData = JSON.stringify({
              event: 'notify',
              data: {
                event: 'designateMeetingHost',
                userId: targetUserId
              },
            })
            this.isQuitGroup = false
            const data = encoder.encode(strData);
            // 给其他人发消息自己的网络状态
            await this.$room.localParticipant.publishData(data, 0);
            // 离开会议
            this.meetingObj.isDisconnected = false
            this.$busMeeting.$emit('btn_disableWebcam');
            if (this.meetingObj.liveMode != '-1') {
              jmeetingWebAPI
                .leaveMeeting({
                  liveId: this.meetingObj.liveId,
                  myId: this.meetingObj.userId,
                  // jmeeting: imMethods.getUrlParams('userId'),
                  jmeeting: '12345678901234567890123456789012',
                  clientType: '3',
                })
                .then((res) => {
                  if (res.success) {
                    this.$room.disconnect()
                    this.goBack()
                  } else {
                    // 入会失败返回消息列表
                    this.goBack()
                  }
                })
                .catch((err) => {
                  console.log(`离开会议err`, err)
                })
            } else {
              this.$room.disconnect()
              this.goBack('quitMeet')
            }
          }
        })
        return;
      }
      this.isShowTransfer = true
    },
    changeBtn() {
      this.isQuitGroup = false
    },
    // 盒子共享屏幕返回
    shareScreenEnd(data) {
      this.isShowScreen = false
      // 传递给盒子共享屏幕数据
      window.electron.selectSharingWindow(data)
      this.btn_sharing(data)
    }
  },
  watch: {
    'meetingObj.liveMode'(newd, oldd) {
      if (newd !== oldd) {
        this.modeList.map((item, index) => {
          item.active = item.label == newd ? true : false;
        })
      }
    },
  },
  created() {
  },
  mounted() {
    console.log(this.$refs.quitMeetingRef.isQuitGroup);
    // btn_disableWebcam
    this.$busMeeting.$on('btn_disableWebcam', () => {
      this.btn_disableWebcamB();
    })
    this.$busMeeting.$on('selectContactFn', () => {
      this.selectContactFn();
    })
    this.$busMeeting.$on('btn_mute', () => {
      this.btn_mute();
    })
    //点击屏幕 关闭设置页面
    this.$busMeeting.$on('mainClick', (e) => {
      this.isSetMode = false;
      // this.isShowTransfer = false
      // this.isShowRecordSelect = false
    })
  },
  // 销毁事件监听
  beforeDestroy() {
    this.$busMeeting.$off('btn_disableWebcam')
    this.$busMeeting.$off('selectContactFn')
    this.$busMeeting.$off('btn_mute')
    this.$busMeeting.$off('mainClick')
  }

}
</script>
<style lang='less' scoped>
.bottomOperaMain {
  width: 100%;
  height: 70px;
  // background: #fff;
  background-image: linear-gradient(-89deg, #232425 7%, #3F4041 16%, #3D3D3F 100%);
  position: absolute;
  bottom: 0;
  z-index: 99;
  display: flex;
  box-sizing: border-box;
  padding-left: 16px;
}

.mainLeft {
  flex: 1;
  display: flex;
}

.itemOpera {
  display: flex;
  flex-direction: column;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 56px;
  height: 56px;
  // display: flex;
  align-items: center;
  margin-top: 11px;
  border-radius: 4px;
  margin-left: 20px;
  cursor: pointer
}

.mainRightText {
  border-radius: 4px;
  font-family: PingFangSC-Regular, Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #FFFFFF;
  text-align: left;
  line-height: 24px;
  font-weight: 400;
  padding: 4px 16px;
  margin-right: 20px;
  background: #F85119;
}

.mainRightTextActive {
  background: #484949;
}

.itemOperaText {
  font-family: PingFangSC-Medium, Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #999999;
  text-align: center;
  font-weight: 500;
  padding-top: 4px;
}

.bottom_left_item_text_audio {
  color: #999;
}

.itemOperaImg {
  width: 24px;
  height: 24px;
}

.itemOperaImgs {
  width: 24px;
  height: 21px;
}

.itemOperaAudio {
  cursor: not-allowed;
}

.itemOperaAudio .itemOperaText {
  color: #666;
}

.mainRight {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  position: relative;
}

.mainMiddle {
  flex: 1;
  display: flex;
  justify-content: center;
}

.modeBox {
  position: absolute;
  bottom: 68px;
  left: -40px;
  width: 148px;
  display: flex;
  flex-direction: column;
  background: #202122;
  border: 0.5px solid rgba(77, 78, 78, 1);
  border-radius: 8px;
}

.modeTitle {
  padding: 8px 16px 0;
  font-size: 14px;
  color: #CCCCCC;
  line-height: 22px;
  font-weight: 500;
  margin-bottom: 10px;
}

.modeItem {
  color: #D8D8D8;
  display: flex;
  padding: 0 16px;
  margin-bottom: 12px;
  align-items: center;
}

.modeActive {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1890FF;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modeInner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}

.modeNotactive {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #fff;
}

.modeName {
  margin-left: 12px;
  font-size: 14px;
  display: inline-block;
}

.vjs-modal-dialog-content {
  display: none;
}

.vjs-error .vjs-error-display:before {
  display: none;
}

.vjs-fluid:not(.vjs-audio-only-mode) {
  padding-top: 0 !important;
}
</style>
