<template>
  <div class="main" @click="mainClick">
    <div class="left">
      <!-- <div v-if="meetingObj.isAllowTips" style="cursor: pointer" @click="seeting" class="setting_desc">会议常见问题解答</div> -->
      <!-- <img class="setting_desc" @click="seeting" v-if="meetingObj.isAllowTips" src="./assets/images/problemQuery.svg" alt="" srcset=""> -->
      <div class="meeting">
        <el-tooltip class="item" effect="dark" :content="meetingObj.liveName" placement="bottom">
          <span class="meeting_text">{{ meetingObj.liveName }}</span>
        </el-tooltip>
        <div class="meeting_timeBox">
          <span class="meeting_time" style="margin-left: 38px">{{ ele_timer }}</span>
          <span class="meeting_time">｜{{ stlist.length }}人在会议中</span>
        </div>
        <div class="recordBox" v-if="isRecording">
          <!-- <span class="meeting_time" style="margin-left: 38px">{{ recordTime }}</span> -->
          <img class="redCircle" src="./assets/images/recordVideo.png" alt="" srcset="">
          <span class="meeting_time">录制中</span>
        </div>
        <div class="setting_desc_box">
          <img class="setting_desc" @click="seeting" v-if="meetingObj.isAllowTips" src="./assets/images/problemQuery.svg"
            alt="" srcset="">
        </div>
      </div>
      <!-- 视频列表 -->
      <VideoManage ref="videoManageRef" :localParticipant='localParticipant' :stlist='stlist' :isSharing='isSharing'
        :meetingObj="meetingObj" @inviteSuccess="inviteSuccess" @inviteFailed="inviteFailed">
      </VideoManage>
      <div>
        <div class="shareName" v-if="select.identity == meetingObj.isScreenShare[2]">
          <img class="itemShare" src="./assets/bottomOpera/sharingGreen.png" alt="" />
          <img class="itemImg" v-show="select.audioOpen == true" src="./assets/images/whiteqxjy.svg" alt />
          <img class="itemImg" v-show="select.audioOpen == false || select.audioOpen == null"
            src="./assets/images/whitejy.svg" alt />
          <!-- {{ select.identity == userId ? '我（'+select.name+'）' : select.name }} -->
          <span class="itemPerson">{{ select.name }}</span>
        </div>
        <div class="spackName" v-show="spackName.length > 0">
          <div v-for="item in spackName.length > 3 ? spackName.splice(0, 3) : spackName" style="color:rgb(22, 119, 255)">
            {{ item.name }} &nbsp;
          </div>
          <div v-show="spackName.length > 3">等</div>
          <div>正在讲话</div>
        </div>
        <div v-if="audioMask" class="audio-mask bigvideo_box_span">
          <div class="audio-center">
            <img src="./assets/images/audiomask.png" alt="">
            <!-- 点击屏幕获取音视频权限的授权 -->
            <span>点我播放会议声音</span>
          </div>
        </div>
        <div v-if="showErrTips" class="audio-mask bigvideo_box_span">
          <div class="audio-center">
            <img src="./assets/images/audiomask.png" alt="">
            <span>{{ errTipText }}</span>
          </div>
        </div>
        <div v-if="ishowNetTips" class="audio-mask bigvideo_box_span">
          <div class="audio-center">
            <img :src="icon" alt="">
            <span>您当前网络信号不佳</span>
          </div>
        </div>
        <div v-if="showTipsData.isShowTips" class="audio-mask bigvideo_box_span">
          <div class="audio-center">
            <img v-if="showTipsData.type === 'warning'" src="./assets/images/audiomask.png" alt="">
            <span>{{ showTipsData.text }}</span>
          </div>
        </div>
        <div id="videoBox">
        <video id="bigvideo" controlsList="nodownload" disablePictureInPicture controls autoplay muted playsinline="true"
          webkit-playsinline="true" style="object-fit: contain"></video>
          <template v-if="this.waterConfig.inputText">
      <h-water-mark :inputText="this.waterConfig.inputText" :type="this.waterConfig.type"></h-water-mark>
    </template>
        </div>
        <div class="bigvideo_box_span" v-if="!select.videoOpen">
          <div class="select" v-if="select && !select.videoOpen">
            <div class="select_img_name"
              v-if="meetingObj.liveMode == -1 && select.name || (select.userType && select.userType !== 0 && select.name)">
              {{ select.name.substring(select.name.length - 2) }}</div>
            <img v-else class="select_img" :src="select.icon ? select.icon : './assets/images/ic_default_avatar.png'"
              :onerror="errorImage" alt />
          </div>
        </div>
        <div class="bigvideo_box_span_share" v-if="isSharing && select.identity == meetingObj.userId">
          <img class="bigvideo_box_span_share_img" src="./assets/images/sharingBlack.svg" alt="">
          <span class="bigvideo_box_span_share_span">桌面共享中</span>
        </div>
      </div>
      <!-- 底部操作 -->
      <BottomOpera ref="bottomOperaRef" :localParticipant='localParticipant' :stlist='stlist' :isSharing='isSharing'
        :meetingObj="meetingObj" :initLiveInfo="initLiveInfo" @recordStart="recordStart" @recordEnd="recordEnd" @showPeopleOver="showPeopleOverFunc"
        :basic="basic">
        <!-- <template slot="selectContact">
          saaaaaaaaaacacacacacsss
        </template> -->
      </BottomOpera>
    </div>
    <!-- 成员管理 -->
    <Management ref="managementRef" v-if="memberShowOhide" :localParticipant='localParticipant' :stlist='stlist'
      :isSharing='isSharing' :meetingObj="meetingObj" :initLiveInfo="initLiveInfo"></Management>
    <!-- 隐私设置 -->
    <PrivacySet ref="privacySetRef"></PrivacySet>
    <!-- <div class="recordTips" v-if="isRecording">
      <span class="txt">会议云录制已开启</span>
    </div> -->
    <div class="recordEndPage" v-if="isRecordEnd">
      <div class="recordEndBox">
        <span class="recordTitle">结束录制</span>
        <span class="recordMsg">云录制文件可前往[视频会议-会议详情]以及[录制回放]中查看</span>
        <div class="btnGroup" v-loading="recordLoading">
          <button v-show="!recordLoading" class="continueBtn" @click="isRecordEnd = false">继续录制</button>
          <button v-show="!recordLoading" class="endBtn" @click="endRecord">结束录制</button>
        </div>
      </div>
    </div>
    <div class="recordEndPage" v-if="isRecordEndOther">
      <div class="recordEndBox">
        <span class="recordTitle">此会议正在录制中</span>
        <span class="recordMsg">主持人发起了录制，如果留在会议中，则表示你同意录制</span>
        <div class="btnGroup">
          <button class="continueBtn" @click="recordLeaveMeeting">离开会议</button>
          <button class="endBtn" @click="isRecordEndOther = false">确定</button>
        </div>
      </div>
    </div>
    <div class="whiteTips" v-if="rightTipsData.isShow">
      <i v-if="rightTipsData.type === 'success'" class="el-icon-success icon"></i>
      <span class="text">{{ rightTipsData.text }}</span>
      <i class="el-icon-close deletIcon" @click="() => { rightTipsData.isShow = false }"></i>
    </div>
    <div class="timeOverPage" v-if="showTimeOver">
      <div class="timeOverBox">
        <div class="timeOverTop">
          <span class="timeOverTitle">超额提示</span>
          <span class="timeOverMsg">当前会议时长已超出试用版限额，会议将在倒计时结束后自动结束。升级正式版后将享有不限人数不限时长的高清会议权益</span>
        </div>
        <div class="btnGroup">
          <button class="endBtn" @click="closeMeetingByOther">{{meetingObj.Initiator == '1' ? '立即结束':'立即离开'}}({{ timeOverNum }})</button>
        </div>
      </div>
    </div>
    <div class="timeOverPage" v-if="showPeopleOver">
      <div class="timeOverBox">
        <div class="timeOverTop">
          <span class="timeOverTitle">超额提示</span>
          <span class="timeOverMsg">当前会议人数已达上限，建议升级正式版，升级后将享有不限人数不限时长的高清会议权益</span>
        </div>
        <div class="btnGroup">
          <button class="endBtn" @click="showPeopleOver = false">我知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HWaterMark from './components/HWaterMark.vue';
import icon from './assets/icon';
import BottomOpera from './components/BottomOpera'
import Management from './components/Management'
import VideoManage from './components/VideoManage'
import PrivacySet from './components/PrivacySet'
import { jmeetingWebAPI } from './services/jmeeting'
// import requestJpaas from '../tools/jpaas_request'
import { tools } from "./tools/tool";
import $ from 'jquery'
import { jpassConfig } from './config.js'
import { testSpeed } from "./tools/testSpeed";
import QueryWebSocket from "./tools/websocket";
const { RoomEvent } = require('livekit-client')//, Room, RemoteParticipant
const decoder = new TextDecoder()
const encoder = new TextEncoder()
export default {
  name: 'JmeetingWeb',
  components: {
    PrivacySet, // 已处理
    BottomOpera,
    VideoManage, // 已处理
    Management, // 已处理
    HWaterMark
  },
  // 组件入参
  props: {
    meetingObj: {
      type: Object,
      default: function () {
        return {
          liveId: '',
          liveMode: 0,
          userId: '',
          userIdJoin: '',
          liveCreatorId: '',
          liveName: '',
          liveType: '',
          Initiator: 0,
          userName: '',
          mainWindowUserid: '',
          isScreenShare: [false, "", ""],
          phoneNumber: '',
          isDisconnected: true,
          audioOpen: 'false',
          videoOpen: 'false',
          allUserList: [],
          unOnline: [],
          listActive: 0,
          isRecord: false,
          isAllowTips: true,
          isAllowInvite: true,
          recordBtnControl: false,
        }
      }
    },
    basic: {
      type: Object,
      default: function () {
        return {
          isNeedGroup: true, // 是否需要群组（邀请人员）
          // 组织架构选项
          structureOptions: {
            icon: "", //组织架构图标
            name: "", //组织名称
            // 第一级为整个公司架构
            levelList: [
              {
                pid: "", //
                name: "",
              },
            ],
            pid: "",
          }
        }
      }
    }
  },
  data() {
    return {
      icon,
      localParticipant: '',
      audioMask: false,//是否获取语音授权 false-已授权
      stlist: [],//成员列表
      memberShowOhide: false,//是否展示成员列表
      computerTimer: null,
      recordTimer: null,
      ele_timer: '',//会议时长
      n_sec: 0,
      n_min: 0,
      n_hour: 0,
      electron: 0,
      select: {},
      isSharing: false,
      participants: [],
      errorImage:
        ' this.src=" ' + require('./assets/images/ic_default_avatar.png') + ' " ',
      spackName: [],
      connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
      outlineTimes: 0,
      speedTest: null,
      speed: 1,
      newPeople: false,
      ishowNetTips: false,
      showErrTips: false,
      errTipText: "",
      isRecording: false,
      isRecordEnd: false,
      recordTime: '',
      createRecordTime: null,
      showTipsData: {
        isShowTips: false,
        text: '',
        type: ''
      },
      refObj: {
        videoManageRef: null,
        bottomOperaRef: null,
        managementRef: null,
        privacySetRef: null
      },
      rightTipsData: {
        isShow: false,
        text: '',
        type: ''
      },
      liveCreatorName: '', // 创会者
      isRecordingStatus: false,
      isRecordEndOther: false,
      initLiveInfo: {},
      recordLoading: false,
      recordStartAllow: true,
      singleDuration: 0,
      singleMaxParticipants: 0,
      showTimeOver: false,
      timeOverNum: 30,
      showPeopleOver: false,
      overTimer: null,
      waterConfig: {},
      settingsBean: {}
    }
  },
  watch: {
    participants: {
      handler() {
        try {
          for (let i in this.participants) {
            for (let j = 0, len = this.stlist.length; j < len; j++) {
              if (this.stlist[j].identity == this.participants[i].identity) {
                this.stlist[j].bit = 0
                for (let key of this.participants[i].audioTracks) {
                  this.stlist[j].bit = this.participants[i].audioTracks.get(key[0]).track._currentBitrate
                }
              }
            }
          }
        } catch (error) {
          console.log(error, 'watchparticipants')
        }
      },
      deep: true,
      immediate: true,
    },
    ishowNetTips: {
      // handler(newVal, oldVal) {
      handler(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.ishowNetTips = false
          }, 3000);
        }
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
    // navigator.getUserMedia({ audio: true }, function onSuccess(stream) {
    //   console.log('已点击允许,开启成功');
    // }, function onError(error) {
    //   console.log("错误：", error);
    // })
    this.getSpeed()
    // 检测网络状态 火狐 IE safira 不支持
    // if (!this.connection) {
    //   // console.log('网络类型：', connection.effectiveType);
    //   // console.log('网络速度：', connection.downlink + 'Mbps');
    //   // console.log('往返时延：', connection.rtt + 'ms');
    //   // console.log('网络状态：', connection.saveData ? '节省流量模式' : '正常模式');
    //   console.log('当前浏览器不支持获取网络连接信息');
    // }
    this.initData()
    document.body.addEventListener("mousedown", function () {
      let audioList = document.getElementsByTagName("audio");
      for (let i = 0, len = audioList.length; i < len; i++) {
        audioList[i].play()
      }
    }, false);
    let myVid = document.getElementById("bigvideo");
    myVid.addEventListener("click", this.mouseHandler, false);
    /**
     * 自定义事件, 接收消息盒子传递的数据
     */
    window.addEventListener(
      'leaveMeeting',
      () => {
        //方法
        this.$busMeeting.$emit('quitFn')
      },
      false
    );
    // 检测离线离开
    window.addEventListener("offline", () => {
      console.log('offline');
      this.$busMeeting.$emit('quitFn')
    });
    window.addEventListener("online", () => {
      console.log('online');
    });

  },
  methods: {
    // jms消息
    createWebSocket() {
      console.log('进入jms消息')
      this.webSocket = new QueryWebSocket({
        url: `wss://${window.location.host}/jms-websocket/ws/notice/${this.meetingObj.userId}`,
        // url: `wss://workin.hanweb.com/jms-websocket/ws/notice/${this.meetingObj.userId}`,
        // createSuccess: () => { },
        queryData: (res) => {
          let arr = res.data.messageBodies.A02_02;
          let data = arr.filter(function (item) {
            return item.businessType == "jmeeting";
          })
          let { type, liveId, client } = data[0].extra;
          console.log('data[0].extra', data[0].extra);
          // 设备切换
          if (liveId && type == 1 && liveId == this.meetingObj.liveId && client != 3) {
            console.log('进来了');
            this.meetingObj.isDisconnected = false
            this.$toast({
              message: "已有其他设备接入会议，本设备即将退出会议",
              duration: 1000,
              onClose: () => {
                this.goBack();
              },
            });
          }
        },
      })
    },
    // 初始化页面 连接ws
    async initData() {
      sessionStorage.removeItem('isSharing')
      let userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.indexOf('electron') > -1) {
        // 判断是否在盒子，显示 停止共享
        console.log(`jmeetingClose`)
        this.electron = 1
      }
      this.refObj = {
        videoManageRef: this.$refs.videoManageRef,
        bottomOperaRef: this.$refs.bottomOperaRef,
        managementRef: this.$refs.managementRef,
        privacySetRef: this.$refs.privacySetRef
      }
      // this.$store.commit('changeLiveId', imMethods.getUrlParams('liveId'));
      // this.$store.commit('changeLiveMode', imMethods.getUrlParams('liveMode'));
      // this.phoneNumber = imMethods.getUrlParams('phoneNumber');

      // if (imMethods.getUrlParams('userId')) {
      //   this.$store.commit('changeUserId', imMethods.getUrlParams('userId'));
      //   this.$store.commit('changeUserIdJoin', imMethods.getUrlParams('userId'));
      // } else if (imMethods.getUrlParams('phoneNumber')) {
      //   this.$store.commit('changeUserIdJoin', tools.encrypt(imMethods.getUrlParams('phoneNumber'), jpassConfig.publicKey));
      //   this.$store.commit('setUserName', imMethods.getUrlParams('userName'));
      // } else if (!imMethods.getUrlParams('userId') && !imMethods.getUrlParams('phoneNumber')) {
      //   //外网参会人员
      //   this.$store.commit('changeUserIdJoin', '');
      //   this.$store.commit('setUserName', imMethods.getUrlParams('userName'));
      // }

      // 组件参数处理
      if (this.meetingObj.userId) {
        this.meetingObj.userIdJoin = this.meetingObj.userId
      } else if (this.meetingObj.phoneNumber) {
        this.meetingObj.userIdJoin = tools.encrypt(this.meetingObj.phoneNumber, jpassConfig.publicKey)
      } else if (!this.meetingObj.userId && !this.meetingObj.phoneNumber) {
        //外网参会人员
        this.meetingObj.userIdJoin = ''
      }
      this.meetingObj.userType = this.meetingObj.userId ? 0 : -1
      // console.log(imMethods.getUrlParams('phoneNumber'),tools.sm4Encrypt(imMethods.getUrlParams('phoneNumber')));
      jmeetingWebAPI
        .acceptMeeting({
          liveId: this.meetingObj.liveId,
          myId: this.meetingObj.userIdJoin,
          // jmeeting:this.meetingObj.userIdJoin,
          jmeeting: '12345678901234567890123456789012',
          clientType: 3,//pc 3
          // userType: this.meetingObj.liveMode == -1 ? -1 : 0,//-1外部用户 0内部用户
          userType: this.meetingObj.userId ? 0 : -1,//-1外部用户 0内部用户
          publicName: this.meetingObj.userName,//用户姓名
        })
        .then(async (res) => {
          if (res.success) {
            this.singleDuration = res.data.singleDuration && res.data.singleDuration !== '0' ? res.data.singleDuration : 0
            this.meetingObj.singleMaxParticipants = res.data.singleMaxParticipants ? res.data.singleMaxParticipants : 0
            // console.log('入会', res.data);
            let { token, liveUrl, createTime, joinId, liveMode, roomSetting } = res.data;
            console.log('token, liveUrl, createTime, joinId, liveMode, roomSetting------------------------', token, liveUrl, createTime, joinId, liveMode, roomSetting)
            this.timeFn(createTime);
            //外网会议 凭姓名入会返回userId
            // if (res.data.joinId) {
            //   this.$store.commit('changeUserId', joinId);
            // }
            // this.$store.commit('setLiveInfo', res.data);
            // this.$store.commit('changeLiveMode', liveMode);
            // this.$store.commit('changeMainWindowUserid', roomSetting.mainWindow);
            // console.log(roomSetting);
            console.log('入会', res.data);
            // this.timeFn(createTime);
            //外网会议 凭姓名入会返回userId
            if (res.data.joinId) {
              this.meetingObj.userId = joinId
            }
            // console.log('res.data.joinId------------------------',res.data.joinId)
            this.initLiveInfo = res.data;
            // console.log('1',this.initLiveInfo)
            this.meetingObj.liveCreatorId = res.data.liveCreatorId;
            // console.log('2',this.meetingObj.liveCreatorId)
            this.meetingObj.hostId = res.data.hostId;
            // console.log('3',this.meetingObj.hostId)
            this.meetingObj.liveName = res.data.liveName;
            // console.log('4',this.meetingObj.liveName)
            this.meetingObj.liveType = res.data.liveType;
            // console.log('5',this.meetingObj.liveType)
            this.meetingObj.Initiator = res.data.hostId == this.meetingObj.userId ? 1 : 0;
            // console.log('6',this.meetingObj.Initiator)
            this.meetingObj.liveMode = liveMode
            // console.log('7',this.meetingObj.liveMode)
            this.meetingObj.mainWindowUserid = roomSetting && roomSetting.mainWindow ? roomSetting.mainWindow : ''
            // console.log('8',this.meetingObj.mainWindowUserid)
            this.liveCreatorName = res.data.liveCreatorName
            // console.log('9',this.liveCreatorName)
            this.meetingObj.phoneCallList = []
            // console.log('10',this.meetingObj.phoneCallList)
            // 水印配置
            if(res.data.additionalInfoMap?.waterContent) {
              this.waterConfig = {
                inputText: res.data.additionalInfoMap.waterContent,
                type: res.data.additionalInfoMap.displayType
              } 
            }
            // 入会配置
            this.settingsBean = res.data.additionalInfoMap?.settingsBean || {}
            // console.log('res.data.additionalInfoMap.settingsBean',res.data.additionalInfoMap?.settingsBean,this.meetingObj.userId,this.meetingObj.hostId)
            if (res.data && res.data.recordingStatus === 0) {
              this.isRecordingStatus = true
              this.isRecording = true
              // if(this.meetingObj.Initiator) {
              this.meetingObj.isRecord = true
              // 提示会进入会议人录制提示
              if (this.meetingObj.userId !== this.meetingObj.hostId) {
                this.isRecordEndOther = true
              }
              // }
            }
            console.log('ininRoom前置------------------------')
            this.createWebSocket()
            // 房间预连接
            this.$room.prepareConnection(decodeURIComponent(liveUrl), token)
            await this.ininRoom(token, liveUrl)
            this.$emit('callSuccess')
          } else {
            this.$toast(res.message)
            // this.goBack()
            this.$emit('callFailed')
          }
        }).catch(err => {
          this.$emit('callFailed')
        })
    },
    // 初始化房间
    async ininRoom(token, url) {
      console.log('初始化房间--------------', token, url)
      this.localParticipant = this.$room.localParticipant
      //有新轨道
      this.$room.on(RoomEvent.TrackSubscribed, this.TrackSubscribed);
      //与服务器的连接建立时，处理人员列表，主要处理自己置顶，主持人第二位
      this.$room.on(RoomEvent.Connected, this.Connected);
      //视频流有变化的时候，处理展示问题，主要处理共享屏幕关闭时，页面展示逻辑
      this.$room.on(RoomEvent.TrackSubscriptionStatusChanged, this.TrackSubscriptionStatusChanged);
      //接受消息
      this.$room.on(RoomEvent.DataReceived, this.DataReceived);
      //活跃的扬声器变化
      this.$room.on(RoomEvent.ActiveSpeakersChanged, this.ActiveSpeakersChanged);
      // 开启音视频
      this.$room.on(RoomEvent.TrackUnmuted, this.TrackUnmuted);
      // 关闭音视频
      this.$room.on(RoomEvent.TrackMuted, this.TrackMuted);
      // join
      this.$room.on(RoomEvent.ParticipantConnected, this.ParticipantConnected);
      // leave
      this.$room.on(RoomEvent.ParticipantDisconnected, this.ParticipantDisconnected);
      //关闭本地共享后，接收相关通知 
      this.$room.on(RoomEvent.LocalTrackUnpublished, this.LocalTrackUnpublished);
      // 切换设备
      this.$room.on(RoomEvent.ConnectionStateChanged, this.ConnectionStateChanged);
      console.log('ws前置------------------------')
      await this.$room.connect(decodeURIComponent(url), token).then((res) => {
        console.log('ws连接成功', res);
        if(this.settingsBean) {
          // 共享屏幕
          console.log('【ws后操作】',this.settingsBean.screenSharingEnabled,this.meetingObj.userId,this.meetingObj.hostId)
          if(this.settingsBean.screenSharingEnabled && this.meetingObj.userId === this.meetingObj.hostId) {
            console.log('this.$refs.bottomOperaRef',this.$refs.bottomOperaRef)
            this.$refs.bottomOperaRef && this.$refs.bottomOperaRef.shareScreen()
          }
          // 录制
          if(this.settingsBean.recordingEnabled && this.meetingObj.userId === this.meetingObj.hostId) {
            this.recordStart()
          }
          // 摄像头
          if(this.settingsBean.cameraEnabled) {
            this.$refs.bottomOperaRef && this.$refs.bottomOperaRef.btn_enableWebcam()
          }
        }
      })
        .catch((err) => {
          console.log('ws连接失败', err);
          this.$toast(err.message)
        })

      // 测试
      // 音频播放状态已更改
      this.$room.on(RoomEvent.AudioPlaybackStatusChanged, this.audioPlaybackChanged);
      // this.$room.on(RoomEvent.ConnectionQualityChanged, this.connectionQualityChanged);
      // this.$room.on(RoomEvent.ConnectionStateChanged, this.connectionStateChanged);
    },
    audioPlaybackChanged(a, b, c) {
      console.log('音频播放状态已更改');
      console.log(a, b, c);
    },
    connectionQualityChanged(a, b) {
      // 会动态改变，触发方式未知； 跟网速无关，调成低速3g并不会触发
      console.log('连接质量已更改', a, b);
    },
    // 连接状态已更改
    connectionStateChanged(a) {
      // 只能检测到自己的连接状态，连接中，已连接，已断开？
      console.log('连接状态已更改', a);
    },
    // TrackSubscribed(track, publication, participant) {
    //   console.log('TrackSubscribed', participant.name, track, publication, participant);
    //   let that = this
    //   setTimeout(() => {
    //     for (let i = 0, len = that.stlist.length; i < len; i++) {
    //       // that.stlist[i].videoOpen = false
    //       if (track.kind == 'video') {
    //         if (participant.identity == that.stlist[i].identity) {
    //           /* 判断当前视频流是共享屏幕还是视频 */
    //           if (track.source == "screen_share") {
    //             that.stlist[i].ShareStream = track.mediaStream
    //             that.stlist[i].isShare = true
    //             this.$store.commit('changeScreenShare', [true, participant.name, participant.identity]);
    //             console.log('共享屏幕');
    //             // 当前是否已设置主屏幕，主屏幕优先级>共享屏幕
    //             if (!this.mainWindowUserid || this.mainWindowUserid == this.isScreenShare[2]) {
    //               that.$refs.videoManageRef.selectVideo(participant)
    //             }
    //             publication.setVideoQuality(2);
    //           } else {
    //             console.log(that.stlist[i]);
    //             that.stlist[i].VideoStream = track.mediaStream
    //             that.stlist[i].isShare = false
    //           }
    //           this.$set(this.stlist[i], 'videoOpen', !publication.metadataMuted)
    //           // that.stlist[i].videoOpen = !publication.metadataMuted;
    //           let ui = document.getElementById('player-' + that.stlist[i].identity)
    //           let video = ui.querySelector("#rtc_media_player")
    //           // let isPc = publication.trackInfo.height == 720 && publication.trackInfo.width == 1280
    //           document.getElementById('player-' + participant.identity).childNodes.forEach((item) => {
    //             if (item.id == 'rtc_media_player') {
    //               item.style.objectFit = track.source == "screen_share" ? 'contain' : 'cover';
    //             }
    //           })
    //           video.style.display = 'block'
    //           ui.style.display = 'block'
    //           // video.style.transform = track.source == "screen_share" ? 'rotateY(0deg)' : 'rotateY(180deg)'
    //           video.srcObject = track.mediaStream
    //         }
    //         if (participant.identity == that.select.identity) {
    //           let video2 = $('#bigvideo');
    //           video2.prop('srcObject', track.mediaStream);
    //           that.select.videoOpen = !publication.metadataMuted;
    //           // console.log('that.select123', that.select);
    //           // that.select.videoOpen = true
    //         }
    //       }
    //       if (track.kind == 'audio' && track.isMuted == false) {
    //         if (participant.identity == this.meetingObj.userId) {
    //           return
    //         }
    //         if (participant.identity == that.stlist[i].identity) {
    //           that.$set(that.stlist[i], 'audioOpen', true);
    //           let ui = document.getElementById('player-' + that.stlist[i].identity)
    //           let audioEle = ui.querySelector("#rtc_media_player_audio")
    //           audioEle.srcObject = track.mediaStream
    //           audioEle.load()
    //           // audioEle[0].paused = false
    //           audioEle.play()
    //           if (audioEle.paused) {
    //             this.audioMask = true
    //           }
    //           that.stlist[i].audioStream = track.mediaStream;
    //           // this.refObj.videoManageRef.audioPlay(track.mediaStream)
    //         }
    //         // this.refObj.videoManageRef.CreatedNewAudio(track.mediaStream,participant.identity)
    //       }
    //     }
    //     // console.log(this.stlist);
    //     this.$forceUpdate()
    //     this.refObj.videoManageRef.$forceUpdate()
    //   }, 2000)
    // },
    // 组件式修改方法
    TrackSubscribed(track, publication, participant) {
      // console.log('TrackSubscribed', participant.name, track, publication, participant);
      let that = this
      setTimeout(() => {
        for (let i = 0, len = that.stlist.length; i < len; i++) {
          // that.stlist[i].videoOpen = false
          if (track.kind == 'video') {
            console.log('TrackSubscribed----------------video', participant.name, track, publication, participant);
            if (participant.identity == that.stlist[i].identity) {
              /* 判断当前视频流是共享屏幕还是视频 */
              if (track.source == "screen_share") {
                if(that.stlist[i].videoOpen == false) that.stlist[i].VideoStream = null;
                that.stlist[i].ShareStream = track.mediaStream
                that.stlist[i].isShare = true
                // this.$store.commit('changeScreenShare', [true, participant.name, participant.identity]);
                this.meetingObj.isScreenShare = [true, participant.name, participant.identity]
                console.log('共享屏幕');
                // 当前是否已设置主屏幕，主屏幕优先级>共享屏幕
                if (!this.meetingObj.mainWindowUserid || this.meetingObj.mainWindowUserid == this.meetingObj.isScreenShare[2]) {
                  that.$refs.videoManageRef.selectVideo(participant)
                }
                publication.setVideoQuality(2);
              } else {
                // console.log(that.stlist[i]);
                // console.log('进入了----其他人开视频1',that.stlist[i])
                // if(that.stlist[i].videoOpen == true){
                //   console.log('进入了----其他人开视频2',that.stlist[i])
                  that.stlist[i].VideoStream = track.mediaStream
                // }
                that.stlist[i].isShare = false
              }
              this.$set(this.stlist[i], 'videoOpen', !publication.metadataMuted)
              // that.stlist[i].videoOpen = !publication.metadataMuted;
              let ui = document.getElementById('player-' + that.stlist[i].identity)
              let video = ui.querySelector("#rtc_media_player")
              // let isPc = publication.trackInfo.height == 720 && publication.trackInfo.width == 1280
              document.getElementById('player-' + participant.identity).childNodes.forEach((item) => {
                if (item.id == 'rtc_media_player') {
                  item.style.objectFit = track.source == "screen_share" ? 'contain' : 'cover';
                }
              })
              video.style.display = 'block'
              ui.style.display = 'block'
              // video.style.transform = track.source == "screen_share" ? 'rotateY(0deg)' : 'rotateY(180deg)'
              // video.srcObject = track.mediaStream
              video.srcObject = that.stlist[i].VideoStream ? that.stlist[i].VideoStream : that.stlist[i].ShareStream

              // console.log('that.stlist[i].ShareStream---1',that.stlist[i].ShareStream)
              // let video2 = $('#bigvideo');
              // // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!',publication.metadataMuted)
              // video2.prop('srcObject', that.stlist[i].ShareStream ? that.stlist[i].ShareStream : that.stlist[i].VideoStream);
              // that.select.videoOpen = !!(that.stlist[i].ShareStream || that.stlist[i].VideoStream)
              // console.log('that.select.videoOpen---',that.select.videoOpen)
            }
            // if (participant.identity == that.select.identity) {
            //   let video2 = $('#bigvideo');
            //   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!',publication.metadataMuted)
            //   video2.prop('srcObject', that.stlist[i].ShareStream ? that.stlist[i].ShareStream : that.stlist[i].VideoStream);
            //   that.select.videoOpen = !!(that.stlist[i].ShareStream || that.stlist[i].VideoStream)
            //   console.log('that.select.videoOpen---',that.select.videoOpen)
            //   // console.log('that.select123', that.select);
            //   // that.select.videoOpen = true
            // }
          }
          if (track.kind == 'audio' && track.isMuted == false) {
            if (participant.identity == this.meetingObj.userId) {
              return
            }
            if (participant.identity == that.stlist[i].identity) {
              if (track.source != "screen_share_audio") {
                that.$set(that.stlist[i], 'audioOpen', true);
              }
              let ui = document.getElementById('player-' + that.stlist[i].identity)
              let audioEle = ui.querySelector("#rtc_media_player_audio")
              audioEle.srcObject = track.mediaStream
              audioEle.load()
              // audioEle[0].paused = false
              audioEle.play()
              if (audioEle.paused) {
                this.audioMask = true
              }
              that.stlist[i].audioStream = track.mediaStream;
              // this.refObj.videoManageRef.audioPlay(track.mediaStream)
            }
            // this.refObj.videoManageRef.CreatedNewAudio(track.mediaStream,participant.identity)
          }
        }
        // console.log(this.stlist);
        this.$forceUpdate()
        this.refObj.videoManageRef.$forceUpdate()
      }, 2000)
    },
    // Connected() {
    //   console.log('Connected');
    //   const json = Object.fromEntries(this.$room.participants)
    //   this.participants = Object.fromEntries(this.$room.participants)
    //   this.stlist = Object.values(json).concat(this.$room.localParticipant)
    //   //路径携带手机号 外网用户，需根据号码匹配identity
    //   this.stlist.map((item) => {
    //     if (this.phoneNumber && tools.sm4Encrypt(imMethods.getUrlParams('phoneNumber')) == item.identity) {
    //       this.$store.commit('changeUserId', item.identity);
    //     }
    //   })
    //   for (let i = 0, len = this.stlist.length; i < len; i++) {
    //     this.$set(this.stlist[i], 'speed', 1);
    //     this.$set(this.stlist[i], 'audioOpen', false);
    //     this.$set(this.stlist[i], 'videoOpen', false);
    //     this.$set(this.stlist[i], 'isSpeaking', false);
    //     this.$set(this.stlist[i], 'icon', this.stlist[i].metadata ? JSON.parse(this.stlist[i].metadata).icon : '');
    //   }
    //   setTimeout(() => {
    //     // this.$nextTick(() => {
    //     //将自己置顶
    //     let index = this.stlist.findIndex(item => item.identity == this.meetingObj.userId);
    //     this.$store.commit('setUserName', this.stlist[index].name);
    //     let spliceItem = this.stlist.splice(index, 1);
    //     this.stlist.unshift(spliceItem[0]);
    //     //主持人位于列表第二位
    //     let index2 = this.stlist.findIndex(item => item.identity == this.liveCreatorId);
    //     if (index2 != -1) {
    //       if (this.stlist[index2].identity == this.meetingObj.userId) {
    //         this.stlist.unshift(this.stlist[index2]);
    //         this.stlist.splice(index2, 1);
    //       } else {
    //         this.stlist.splice(1, 0, this.stlist[index2]);
    //         this.stlist.splice(index2 + 1, 1);
    //       }
    //     }
    //     // this.stlist = JSON.parse(JSON.stringify(this.stlist));
    //     // 离开会议再次入会会执行两遍Connected，第一次查询不到组件，减少报错
    //     if (this.refObj.bottomOperaRef) {
    //       this.refObj.bottomOperaRef.ininRoom();
    //     }
    //     console.log(this.stlist);
    //     console.log('全员看他');
    //     if (this.refObj.videoManageRef) {
    //       this.refObj.videoManageRef.ininRoom();
    //     }
    //     // })
    //   }, 0)
    // },
    // 组件式修改方法
    Connected() {
      console.log('Connected------------------');
      const json = Object.fromEntries(this.$room.participants)
      this.participants = Object.fromEntries(this.$room.participants)
      this.stlist = Object.values(json).concat(this.$room.localParticipant)
      console.log('this.stlist----------', JSON.parse(JSON.stringify(this.stlist)))
      //路径携带手机号 外网用户，需根据号码匹配identity
      this.stlist.map((item) => {
        if (this.meetingObj.phoneNumber && tools.sm4Encrypt(this.meetingObj.phoneNumber) == item.identity) {
          this.meetingObj.userId = item.identity
          console.log('--------------------item.identity--------------------', item.identity)
        }
      })
      for (let i = 0, len = this.stlist.length; i < len; i++) {
        this.$set(this.stlist[i], 'speed', 1);
        this.$set(this.stlist[i], 'audioOpen', false);
        this.$set(this.stlist[i], 'videoOpen', false);
        this.$set(this.stlist[i], 'isSpeaking', false);
        this.$set(this.stlist[i], 'icon', this.stlist[i].metadata ? JSON.parse(this.stlist[i].metadata).icon : '');
      }
      setTimeout(() => {
        // this.$nextTick(() => {
        //将自己置顶
        let index = this.stlist.findIndex(item => item.identity == this.meetingObj.userId);
        // console.log('this.stlist----------2222', JSON.parse(JSON.stringify(this.stlist)), index, this.meetingObj.userId)
        this.meetingObj.userName = this.stlist[index].name
        let spliceItem = this.stlist.splice(index, 1);
        this.stlist.unshift(spliceItem[0]);
        //主持人位于列表第二位
        let index2 = this.stlist.findIndex(item => item.identity == this.meetingObj.hostId);
        if (index2 != -1) {
          if (this.stlist[index2].identity == this.meetingObj.userId) {
            this.stlist.unshift(this.stlist[index2]);
            this.stlist.splice(index2, 1);
          } else {
            this.stlist.splice(1, 0, this.stlist[index2]);
            this.stlist.splice(index2 + 1, 1);
          }
        }
        // this.stlist = JSON.parse(JSON.stringify(this.stlist));
        // 离开会议再次入会会执行两遍Connected，第一次查询不到组件，减少报错
        if (this.refObj.bottomOperaRef) {
          this.refObj.bottomOperaRef.ininRoom();
        }
        console.log(this.stlist);
        console.log('全员看他');
        if (this.refObj.videoManageRef) {
          this.refObj.videoManageRef.ininRoom();
        }
        // })
      }, 0)
    },
    // TrackSubscriptionStatusChanged(track, publication, participant) {
    //   console.log('TrackSubscriptionStatusChanged', track, publication, participant);
    //   setTimeout(() => {
    //     if (publication == "desired") {
    //       if (this.isScreenShare[2] == participant.identity) {
    //         this.$store.commit('changeScreenShare', [false, "", ""]);
    //       }
    //       for (let i = 0, len = this.stlist.length; i < len; i++) {
    //         if (participant.identity == this.stlist[i].identity) {
    //           if (participant.isCameraEnabled) { //判断视频是否开启
    //             // this.stlist[i].videoOpen = true
    //             this.$set(this.stlist[i], 'videoOpen', true)
    //             this.stlist[i].isShare = false
    //             let ui = document.getElementById('player-' + this.stlist[i].identity)
    //             let video = ui.querySelector("#rtc_media_player")
    //             video.style.display = 'block'
    //             ui.style.display = 'block'
    //             video.srcObject = this.stlist[i].VideoStream
    //             if (this.select.identity == this.stlist[i].identity) {
    //               this.refObj.videoManageRef.selectVideo(this.stlist[i])
    //             }
    //           } else {
    //             // this.stlist[i].videoOpen = false
    //             this.$set(this.stlist[i], 'videoOpen', false)
    //             this.stlist[i].isShare = false
    //             if (this.select.identity == this.stlist[i].identity) {
    //               this.refObj.videoManageRef.selectVideo(this.stlist[i])
    //             }
    //             this.refObj.videoManageRef.$forceUpdate()
    //           }

    //         }
    //       }
    //     }
    //   }, 2000)
    // },
    TrackSubscriptionStatusChanged(track, publication, participant) {
      console.log('TrackSubscriptionStatusChanged', track, publication, participant);
      setTimeout(() => {
        if (publication == "desired") {
          console.log('track.source',track,track.source)
          if (track.source == 'screen_share' && this.meetingObj.isScreenShare[2] == participant.identity) {
            this.meetingObj.isScreenShare = [false, "", ""]
          }
          for (let i = 0, len = this.stlist.length; i < len; i++) {
            if (participant.identity == this.stlist[i].identity) {
              // if (track.kind == 'audio' && track.source == "screen_share_audio") {
              //   if (participant.identity == this.meetingObj.userId) {
              //     return
              //   }
              //   this.$set(this.stlist[i], 'audioOpen', false);
              // }
              if (track.source=='screen_share') {
                this.stlist[i].ShareStream = null
              }
              if (participant.isCameraEnabled) { //判断视频是否开启
                // this.stlist[i].videoOpen = true
                this.$set(this.stlist[i], 'videoOpen', true)
                this.stlist[i].isShare = false
                let ui = document.getElementById('player-' + this.stlist[i].identity)
                let video = ui.querySelector("#rtc_media_player")
                video.style.display = 'block'
                ui.style.display = 'block'
                video.srcObject = this.stlist[i].VideoStream ? this.stlist[i].VideoStream : this.stlist[i].ShareStream
                console.log('that.stlist[i].ShareStream---2',this.stlist[i].ShareStream)
                if (this.select.identity == this.stlist[i].identity) {
                  this.refObj.videoManageRef.selectVideo(this.stlist[i])
                }
              } else {
                // this.stlist[i].videoOpen = false
                this.$set(this.stlist[i], 'videoOpen', false)
                this.stlist[i].isShare = false
                if (this.select.identity == this.stlist[i].identity) {
                  this.refObj.videoManageRef.selectVideo(this.stlist[i])
                }
                this.refObj.videoManageRef.$forceUpdate()
              }

            }
          }
        }
      }, 2000)
    },
    // DataReceived(payload, publication, kind) {
    //   // console.log('DataReceived--接收消息', decoder.decode(payload));
    //   let receivedData = JSON.parse(decoder.decode(payload)).data;
    //   if (receivedData.event != 'network') {
    //     console.log(receivedData);
    //   }
    //   //muteAll 全员静音
    //   if (receivedData.event == 'muteAll' && receivedData.liveId == this.liveId) {
    //     for (let i = 0, len = this.stlist.length; i < len; i++) {
    //       if (this.stlist[i].identity != receivedData.userId) {
    //         this.stlist[i].btn_muteShowOhide = true;
    //         this.$set(this.stlist[i], 'audioOpen', false);
    //       }
    //     }
    //   }
    //   //close 结束会议
    //   else if (receivedData.event == 'close' && receivedData.liveId == this.liveId) {
    //     this.goBack();
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
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (this.stlist[i].identity != receivedData.userId) {
            this.stlist[i].btn_muteShowOhide = true;
            this.$set(this.stlist[i], 'audioOpen', false);
          }
        }
      }
      //close 结束会议
      else if (receivedData.event == 'close' && receivedData.liveId == this.meetingObj.liveId) {
        this.goBack();
      }
      // 转移主持人接收
      else if (receivedData.event == 'designateMeetingHost') {
        // for (let i = 0, len = this.stlist.length; i < len; i++) {
        this.meetingObj.hostId = receivedData.userId
        if (this.meetingObj.userId === receivedData.userId) {
          // this.$message.success('您已成为主持人')
          this.showOtherTips({
            text: `您已成为新主持人`,
            type: 'success',
            duration: 'all'
          })
          this.meetingObj.Initiator = 1
          if (this.isRecordingStatus === true) {
            this.meetingObj.isRecord = true
          }
        } else {
          if (this.stlist[1].identity != receivedData.userId) {
            let index2 = this.stlist.findIndex(item => item.identity == this.meetingObj.hostId)
            if (index2 != -1) {
              if (this.stlist[index2].identity == this.meetingObj.userId) {
                this.stlist.unshift(this.stlist[index2]);
                this.stlist.splice(index2, 1);
              } else {
                this.stlist.splice(1, 0, this.stlist[index2]);
                this.stlist.splice(index2 + 1, 1);
              }
            }
          }
        }
        // }
      }
      // 来电
      else if (receivedData.event == 'phoneCall' && receivedData.liveId == this.meetingObj.liveId) {
        console.log('获取来电-----')
        // for (let i = 0, len = this.stlist.length; i < len; i++) {
        // 来电
        if (receivedData.type == 3) {
          this.meetingObj.phoneCallList.push(receivedData.userId)
        } else if (receivedData.type == 2) {
          // 挂断
          this.meetingObj.phoneCallList.forEach((item, index) => {
            if (item === receivedData.userId) {
              this.meetingObj.phoneCallList.splice(index, 1)
            }
          })
        }
        this.meetingObj.phoneCallList = JSON.parse(JSON.stringify(this.meetingObj.phoneCallList))
        this.refObj.videoManageRef.$forceUpdate()
        // }
      }
      else if (receivedData.event == 'startRecording') {
        this.isRecordingStatus = true
        this.meetingObj.isRecord = true
        this.isRecording = true
        if (this.meetingObj.userId !== this.meetingObj.hostId) {
          this.isRecordEndOther = true
        }
      }
      // 
      else if (receivedData.event == 'stopRecording') {
        this.isRecordingStatus = false
        this.meetingObj.isRecord = false
        this.isRecording = false
        if (this.meetingObj.userId !== this.meetingObj.hostId) {
          this.showOtherTips({
            text: `录制已关闭，可会后联系[${this.liveCreatorName}]获取录制`,
            type: 'success',
          })
        }
      }
    },
    // ActiveSpeakersChanged(track, publication, participant) {
    //   // if (track.length) { console.log('正在说话', track) }
    //   this.spackName = [...new Set(track)] //数组去重
    //   for (let i = 0, len = track.length; i < len; i++) {
    //     for (let j = 0, jen = this.stlist.length; j < jen; j++) {
    //       if (this.stlist[j].identity == track[i].identity) {
    //         this.$set(this.stlist[j], 'isSpeaking', true);
    //         setTimeout(() => {
    //           this.spackName = [];
    //           this.$set(this.stlist[j], 'isSpeaking', false);
    //         }, 1000)
    //       }
    //     }
    //   }
    // },
    ActiveSpeakersChanged(track, publication, participant) {
      // if (track.length) { console.log('正在说话------------', track) }
      let numList = []
      let indexList = []
      let trackList = [...new Set(track)]
      trackList.forEach((item, index) => {
        if (numList.indexOf(item.identity) === -1) {
          numList.push(item.identity)
          indexList.push(index)
        }
      })
      let arr = []
      trackList.forEach((item, index) => {
        if (indexList.indexOf(index) > -1) {
          arr.push(item)
        }
      })
      this.spackName = arr
      // this.spackName = [...new Set(track)] //数组去重
      // 正在说话
      let judgeList = []
      this.stlist.forEach((item) => {
        if (item.audioOpen || item.audioOpen === 'true') {
          judgeList.push(item.identity)
        }
      })
      this.spackName = this.spackName.filter(item => {
        return judgeList.indexOf(item.identity) > -1
      })
      // 说话绿框
      for (let i = 0, len = track.length; i < len; i++) {
        for (let j = 0, jen = this.stlist.length; j < jen; j++) {
          if (this.stlist[j].identity == track[i].identity) {
            this.$set(this.stlist[j], 'isSpeaking', true);
            setTimeout(() => {
              this.spackName = [];
              this.$set(this.stlist[j], 'isSpeaking', false);
            }, 1000)
          }
        }
      }
    },
    // TrackUnmuted(track, publication, participant) {
    //   console.log('开启音视频', publication.name, track, publication, participant);
    //   if (track.kind == 'audio') {
    //     if (publication.identity == this.meetingObj.userId) {
    //       return
    //     }
    //     for (let i = 0, len = this.stlist.length; i < len; i++) {
    //       if (publication.identity == this.stlist[i].identity) {
    //         this.$set(this.stlist[i], 'audioOpen', true);
    //         let ui = document.getElementById('player-' + this.stlist[i].identity)
    //         let audioEle = ui.querySelector("#rtc_media_player_audio")
    //         audioEle.srcObject = track.track.mediaStream
    //         audioEle.load()
    //         audioEle.play()
    //         if (audioEle.paused) {
    //           this.audioMask = true
    //         }
    //         this.stlist[i].audioStream = track.mediaStream;
    //         // this.refObj.videoManageRef.audioPlay(track.track.mediaStream)
    //       }
    //     }
    //   }
    //   if (track.kind == 'video') {
    //     for (let i = 0, len = this.stlist.length; i < len; i++) {
    //       if (publication.identity == this.stlist[i].identity) {
    //         let ui = document.getElementById('player-' + this.stlist[i].identity)
    //         let video = ui.querySelector("#rtc_media_player")
    //         let isPc = track.trackInfo.height == 720 && track.trackInfo.width == 1280
    //         document.getElementById('player-' + publication.identity).childNodes.forEach((item) => {
    //           if (item.id == 'rtc_media_player') {
    //             item.style.objectFit = isPc ? 'cover' : 'contain';
    //           }
    //         })
    //         console.log(this.stlist[i]);
    //         video.style.display = 'block'
    //         ui.style.display = 'block'
    //         video.srcObject = this.stlist[i].VideoStream
    //         // this.stlist[i].videoOpen = true
    //         this.$set(this.stlist[i], 'videoOpen', true)
    //         if (track.source == "screen_share") {
    //           this.$store.commit('changeScreenShare', [true, participant.name, participant.identity]);
    //         }
    //         break
    //       }
    //     }
    //     if (publication.identity == this.select.identity) {
    //       let video2 = $('#bigvideo');
    //       video2.prop('srcObject', track.track.mediaStream);
    //       this.select.videoOpen = true;
    //     }
    //   }
    // },
    TrackUnmuted(track, publication, participant) {
      let that = this
      console.log('开启音视频', publication.name, track, publication, participant);
      if (track.kind == 'audio') {
        if (publication.identity == this.meetingObj.userId) {
          return
        }
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (publication.identity == this.stlist[i].identity) {
            this.$set(this.stlist[i], 'audioOpen', true);
            let ui = document.getElementById('player-' + this.stlist[i].identity)
            let audioEle = ui.querySelector("#rtc_media_player_audio")
            audioEle.srcObject = track.track.mediaStream
            audioEle.load()
            audioEle.play()
            if (audioEle.paused) {
              this.audioMask = true
            }
            this.stlist[i].audioStream = track.mediaStream;
            // this.refObj.videoManageRef.audioPlay(track.track.mediaStream)
          }
        }
      }
      if (track.kind == 'video') {
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (publication.identity == this.stlist[i].identity) {
            this.stlist[i].VideoStream = track.track.mediaStream
            let ui = document.getElementById('player-' + this.stlist[i].identity)
            let video = ui.querySelector("#rtc_media_player")
            let isPc = track.trackInfo.height == 720 && track.trackInfo.width == 1280
            document.getElementById('player-' + publication.identity).childNodes.forEach((item) => {
              if (item.id == 'rtc_media_player') {
                item.style.objectFit = isPc ? 'cover' : 'contain';
              }
            })
            console.log(this.stlist[i]);
            video.style.display = 'block'
            ui.style.display = 'block'
            video.srcObject = this.stlist[i].VideoStream ? this.stlist[i].VideoStream : this.stlist[i].ShareStream
            console.log('that.stlist[i].ShareStream---3',that.stlist[i].ShareStream)
            // this.stlist[i].videoOpen = true
            this.$set(this.stlist[i], 'videoOpen', true)
            if (track.source == "screen_share") {
              this.meetingObj.isScreenShare = [true, participant.name, participant.identity];
            }
            // let video2 = $('#bigvideo');
            // video2.prop('srcObject', that.stlist[i].ShareStream ? that.stlist[i].ShareStream : that.stlist[i].VideoStream);
            break
          }
        }
        // if (publication.identity == this.select.identity) {
        //   let video2 = $('#bigvideo');
        //   video2.prop('srcObject', that.stlist[i].ShareStream ? that.stlist[i].ShareStream : that.stlist[i].VideoStream);
        //   this.select.videoOpen = true;
        // }
      }
    },
    // TrackMuted(track, publication, participant) {
    //   console.log('关闭音视频', publication.name, track, publication, participant);
    //   if (track.kind == 'audio') {
    //     for (let i = 0, len = this.stlist.length; i < len; i++) {
    //       if (publication.identity == this.stlist[i].identity) {
    //         this.$set(this.stlist[i], 'audioOpen', false);
    //       }
    //       if (publication.identity == this.select.identity) {
    //         this.select.audioOpen = false
    //       }
    //     }
    //   }
    //   if (track.kind == 'video') {
    //     for (let i = 0, len = this.stlist.length; i < len; i++) {
    //       if (publication.identity == this.stlist[i].identity) {
    //         // this.stlist[i].videoOpen = false
    //         this.$set(this.stlist[i], 'videoOpen', false)
    //       }
    //       if (publication.identity == this.select.identity) {
    //         // console.log('that.select12', that.select);
    //         this.select.videoOpen = false
    //       }
    //       // 移动端屏幕共享走的TrackMuted
    //       if (track.source == "screen_share") {
    //         this.$store.commit('changeScreenShare', [false, "", ""]);
    //       }
    //     }
    //   }
    //   this.$forceUpdate()
    //   this.refObj.videoManageRef.$forceUpdate()
    // },
    TrackMuted(track, publication, participant) {
      console.log('关闭音视频', publication.name, track, publication, participant);
      if (track.kind == 'audio') {
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (publication.identity == this.stlist[i].identity) {
            this.$set(this.stlist[i], 'audioOpen', false);
          }
          if (publication.identity == this.select.identity) {
            this.select.audioOpen = false
          }
        }
      }
      if (track.kind == 'video') {
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (publication.identity == this.stlist[i].identity) {
            console.log('this.stlist[i].ShareStream----1111',this.stlist[i])
            this.stlist[i].VideoStream = null
            // this.stlist[i].videoOpen = false
            if(!this.stlist[i].ShareStream) {
              this.$set(this.stlist[i], 'videoOpen', false)
            } else {
              this.$set(this.stlist[i], 'videoOpen', true)
              let ui = document.getElementById('player-' + this.stlist[i].identity)
              let video = ui.querySelector("#rtc_media_player")
              video.srcObject = this.stlist[i].ShareStream
            }
          }
          // if (publication.identity == this.select.identity) {
          //   console.log('this.stlist[i].ShareStream----2222',this.stlist[i])
          //   // console.log('that.select12', that.select);
          //   if(!this.stlist[i].ShareStream) {
          //     this.select.videoOpen = false
          //   } else {
          //     this.select.videoOpen = true
          //   }
          // }
          // 移动端屏幕共享走的TrackMuted
          if (track.source == "screen_share") {
            this.meetingObj.isScreenShare = [false, "", ""];
          }
        }
      }
      this.$forceUpdate()
      console.log('this----------->', this)
      console.log('this.$refs----------->', this.$refs)
      console.log('this.refObj.videoManageRef----------->', this.refObj.videoManageRef)
      this.refObj.videoManageRef && this.refObj.videoManageRef.$forceUpdate()
    },
    // ParticipantConnected(track, publication, participant) {
    //   //延时解决多次刷新 收不到join的问题
    //   setTimeout(() => {
    //     console.log('livekit=join', track)
    //     this.newPeople = true;
    //     let res = this.stlist.find((v) => {
    //       return v.identity == track.identity // return v.value ===  '9'  返回undefined
    //     })
    //     track.icon = JSON.parse(track.metadata).icon
    //     if (!res) {
    //       //新增人员为主持人 位置提升到第二位
    //       if (track.identity == this.liveCreatorId) {
    //         this.stlist.splice(1, 0, track);
    //       } else {
    //         this.stlist.push(track);
    //       }
    //       this.refObj.videoManageRef.getMeetingUsers()
    //     }
    //   }, 2000)
    //   // }, 0)
    // },
    ParticipantConnected(track, publication, participant) {
      //延时解决多次刷新 收不到join的问题
      setTimeout(() => {
        console.log('livekit=join', track)
        this.newPeople = true;
        let res = this.stlist.find((v) => {
          return v.identity == track.identity // return v.value ===  '9'  返回undefined
        })
        track.icon = JSON.parse(track.metadata).icon
        if (!res) {
          //新增人员为主持人 位置提升到第二位
          if (track.identity == this.hostId) {
            this.stlist.splice(1, 0, track);
          } else {
            this.stlist.push(track);
          }
          this.refObj.videoManageRef.getMeetingUsers()
        }
      }, 2000)
      // }, 0)
    },
    // ParticipantDisconnected(track, publication, participant) {
    //   console.log('leave=====', publication, track, participant);
    //   this.stlist.map((item, index) => {
    //     if (track.identity == item.identity) {
    //       //离开会议人员为选中人员 自动切换上一个或下一个
    //       if (track.identity == this.select.identity) {
    //         let nextindex = this.stlist.length - 1 == index ? index - 1 : index + 1;
    //         this.refObj.videoManageRef.selectVideo(this.stlist[nextindex]);
    //       }
    //       this.stlist.splice(index, 1);
    //       this.refObj.videoManageRef.getMeetingUsers()
    //     }
    //   })
    // },
    ParticipantDisconnected(track, publication, participant) {
      // console.log('leave=====', publication, track, participant);
      this.stlist.map((item, index) => {
        if (track.identity == item.identity) {
          //离开会议人员为选中人员 自动切换上一个或下一个
          if (track.identity == this.select.identity) {
            let nextindex = this.stlist.length - 1 == index ? index - 1 : index + 1;
            this.videoManageRef.selectVideo(this.stlist[nextindex]);
          }
          this.stlist.splice(index, 1);
          // 问题所在
          this.refObj.videoManageRef.getMeetingUsers()
        }
      })
    },
    // LocalTrackUnpublished(track, publication, participant) {
    //   console.log('LocalTrackUnpublished');
    //   this.isSharing = false
    //   for (let i = 0, len = this.stlist.length; i < len; i++) {
    //     if (this.meetingObj.userId == this.stlist[i].identity) {
    //       if (this.stlist[i].VideoStream && this.stlist[i].VideoStream.active) {
    //         // 判断当前是否存在开启了摄像头的视频流，已经状态是否为活动中
    //         this.$set(this.stlist[i], 'videoOpen', true)
    //       } else {
    //         this.$set(this.stlist[i], 'videoOpen', false)
    //       }
    //       this.stlist[i].isShare = false;
    //       // 本地取消共享后设置为空
    //       this.$store.commit('changeScreenShare', [false, "", ""]);
    //     }
    //   }
    // },
    LocalTrackUnpublished(track, publication, participant) {
      console.log('LocalTrackUnpublished');
      this.isSharing = false
      for (let i = 0, len = this.stlist.length; i < len; i++) {
        if (this.meetingObj.userId == this.stlist[i].identity) {
          if (this.stlist[i].VideoStream && this.stlist[i].VideoStream.active) {
            // 判断当前是否存在开启了摄像头的视频流，已经状态是否为活动中
            this.$set(this.stlist[i], 'videoOpen', true)
          } else {
            this.$set(this.stlist[i], 'videoOpen', false)
          }
          this.stlist[i].isShare = false;
          // 本地取消共享后设置为空
          this.meetingObj.isScreenShare = [false, "", ""];
        }
      }
    },
    // ConnectionStateChanged(track) {
    //   console.log("切换设备", track)
    //   if (track == "disconnected") {
    //     setTimeout(() => {
    //       if (this.$store.state.isDisconnected) {
    //         this.goBack();
    //       }
    //     }, 2000)
    //   }
    //   if (track == 'reconnecting') {
    //     //重连后获取路径中摄像头麦克风状态
    //     if (imMethods.getUrlParams('videoOpen')) {
    //       if (imMethods.getUrlParams('videoOpen') == 'true') {
    //         this.refObj.bottomOperaRef.btn_enableWebcam();
    //       }
    //     }
    //     if (imMethods.getUrlParams('audioOpen')) {
    //       if (imMethods.getUrlParams('audioOpen') == 'true') {
    //         this.refObj.bottomOperaRef.btn_unmute();
    //       }
    //     }
    //   }
    // },
    ConnectionStateChanged(track) {
      console.log("切换设备", track)
      if (track == "disconnected") {
        setTimeout(() => {
          if (this.meetingObj.isDisconnected) {
            this.goBack();
          }
        }, 2000)
      }
      if (track == 'reconnecting') {
        //重连后获取路径中摄像头麦克风状态
        console.log('<--this.meetingObj.videoOpen-->', this.meetingObj.videoOpen, typeof (this.meetingObj.videoOpen))
        if (this.meetingObj.videoOpen === 'true' || (this.meetingObj.videoOpen && typeof (this.meetingObj.videoOpen) === 'boolean')) {
          this.refObj.bottomOperaRef.btn_enableWebcam();
        }
        if (this.meetingObj.audioOpen === 'true' || (this.meetingObj.audioOpen && typeof (this.meetingObj.audioOpen) === 'boolean')) {
          this.refObj.bottomOperaRef.btn_unmute();
        }
      }
    },
    //打开会议常见问题
    seeting() {
      this.refObj.privacySetRef.open();
    },
    // 返回首页
    goBack(data) {
      // 内部-原来   外部-主持人-历史 其他-登录页   混合-主持人-原来 其他人-有电话-首页-无-原来
      // if (!this.liveMode || this.liveMode == 0 || this.liveMode == 1 && !this.phoneNumber) {
      //   let userAgent = navigator.userAgent.toLowerCase()
      //   if (userAgent.indexOf('electron') > -1) {
      //     window.electron.closeMeeting()
      //   } else {
      //     window.location.href = jpassConfig.backUrl
      //   }
      // } else if (this.liveMode == 1 && this.phoneNumber || this.liveMode == -1 && !this.phoneNumber) {
      //   //如果是离开会议 跳转验证页面 
      //   if (data == 'quitMeet') {
      //     this.$router.push({ path: '/check', query: { liveId: this.liveId, liveMode: this.liveMode } })
      //   } else {
      //     this.$router.replace({ path: '/login' })
      //   }
      // } else if (this.liveMode == -1 && this.phoneNumber) {
      //   this.$router.replace({ path: '/historyMeet', query: { userName: this.userName, phoneNumber: this.phoneNumber } })
      // }
      this.$router.push({ path: '/base' })
      if (data == 'quitMeet') {
        this.$emit('leaveMeeting')
      } else {
        this.$emit('closeMeeting')
      }
    },
    //拉流后 加载audio
    // setAudio(track, identity) {
    //   //若麦克风开启的是自己端
    //   if (identity == this.meetingObj.userId) {
    //     return
    //   }
    //   console.log(track, identity);
    //   let that = this;
    //   let audioEle = document.getElementById('player-' + identity).querySelector("#rtc_media_player_audio")
    //   audioEle.srcObject = track.mediaStream
    //   audioEle.load()
    //   audioEle.oncanplay = function () {
    //     audioEle.play();
    //     console.log(audioEle.paused, that.audioMask);
    //     if (audioEle.paused) {
    //       that.audioMask = true
    //     }
    //     console.log('当指定的音频/视频的元数据已加载时')
    //   };
    //   audioEle.onerror = function () {
    //     that.setAudio(track, identity);
    //     console.log('请求数据时遇到错误')
    //   };
    // },
    //拉流后 加载audio 组件式
    setAudio(track, identity) {
      //若麦克风开启的是自己端
      if (identity == this.meetingObj.userId) {
        return
      }
      console.log(track, identity);
      let that = this;
      let audioEle = document.getElementById('player-' + identity).querySelector("#rtc_media_player_audio")
      audioEle.srcObject = track.mediaStream
      audioEle.load()
      audioEle.oncanplay = function () {
        audioEle.play();
        console.log(audioEle.paused, that.audioMask);
        if (audioEle.paused) {
          that.audioMask = true
        }
        console.log('当指定的音频/视频的元数据已加载时')
      };
      audioEle.onerror = function () {
        that.setAudio(track, identity);
        console.log('请求数据时遇到错误')
      };
    },
    // 开关麦克风 true静音 false取消静音
    setMute(index, status) {
      console.log('开关麦克风', index, status);
      this.stlist[index].btn_muteShowOhide = status;
      this.$set(this.stlist[index], 'audioOpen', !status);
    },
    //开关摄像头 true打开摄像头 false关闭摄像头
    setVideo(i, status, res) {
      console.log('开关摄像头------------------',i, status, res);
      if (!status) {
        this.stlist[i].VideoStream = null
        this.$set(this.stlist[i], 'videoOpen', false)
        // let ui = $(this.escapeJquery('#player-' + this.meetingObj.userId))
        let ui = document.getElementById('player-' + this.meetingObj.userId)
        // console.log(ui, ui.querySelector('.state2'))
        if (ui.querySelector('.state2').querySelector('#stateImg') && !this.stlist[i].ShareStream) {
          ui.querySelector('.state2').querySelector('#stateImg').style.display = 'block'
          if (this.stlist[i].icon) {
            ui.querySelector('.state2')
              .querySelector('#stateImg')
              .src = this.stlist[i].icon
          } else {
            ui.querySelector('.state2')
              .querySelector('#stateImg')
              .src = require('./assets/icon.js')
          }
        }
      } else {
        if (this.select.identity === this.stlist[i].identity) {
          console.log('大窗进入了that.stlist[i].VideoStream',this.stlist[i])
          let video = $('#bigvideo')
          video.prop('srcObject', res && res.track ? res.track.mediaStream : null)
          this.$set(this.select, 'videoOpen', true)
        }
        this.$set(this.stlist[i], 'videoOpen', true)
        this.$set(this.stlist[i], 'VideoStream', res && res.track ? res.track.mediaStream : null)
        // this.stlist[i].VideoStream = res.track.mediaStream
        // let ui = $(this.escapeJquery('#player-' + this.meetingObj.userId))
        // let video = ui.children('#rtc_media_player')
        let ui = document.getElementById('player-' + this.meetingObj.userId)
        let video = ui.querySelector("#rtc_media_player")
        video.srcObject = res && res.track ? res.track.mediaStream : null
        // console.log(ui, ui.querySelector('.state2'))
        // console.log(this.select);
        if (ui.querySelector('.state2').querySelector('#stateImg') && (this.stlist[i].VideoStream || this.stlist[i].ShareStream)) {
          ui.querySelector('.state2').querySelector('#stateImg').src = ''
          ui.querySelector('.state2').querySelector('#stateImg').style.display = 'none'
        }
      }
      this.$forceUpdate()
      this.refObj.videoManageRef.$forceUpdate()
    },
    // 会议时长
    timeFn(dateBegin) {
      let that = this
      clearInterval(this.computerTimer)
      this.computerTimer = setInterval(() => {
        //实时时间
        let now = new Date().getTime();
        //计时器时间 = 实时时间 - 相对时间 + 点击暂停按钮时保存的时间
        let time = now - dateBegin;
        if (this.singleDuration && (this.singleDuration*60*60*1000 < time)) {
          !this.showTimeOver && this.timeOverNum === 30 && that.timeOver()
          clearInterval(this.computerTimer)
        }
        //把处理过的时间显示到content标签中
        this.showTime(time);
      }, 1000);
    },
    showTime(time) {
      //分别  获取到小时 分钟 秒 毫秒
      this.n_hour = Math.floor(time / (3600 * 1000));
      this.n_min = Math.floor(time / 1000 / 60 % 60);
      this.n_sec = Math.floor(time / 1000 % 60);

      this.n_hour = this.n_hour < 10 ? "0" + this.n_hour : this.n_hour;
      this.n_min = this.n_min < 10 ? "0" + this.n_min : this.n_min;
      this.n_sec = this.n_sec < 10 ? "0" + this.n_sec : this.n_sec;
      this.ele_timer = this.n_hour + ":" + this.n_min + ":" + this.n_sec;
    },
    mouseHandler(event) {
      // 阻止视频默认点击事件
      event.preventDefault()
    },
    //用户id处理 特殊字符增加转义
    escapeJquery(srcString) {
      // 转义之后的结果
      let escapseResult = srcString;
      // jquery中的特殊字符,不是正则表达式中的特殊字符
      let jquerySpecialChars = ["~", "`", "@", "%", "&", "=", "'", "\"",
        ":", ";", "<", ">", ",", "/"];
      for (let i = 0, len = jquerySpecialChars.length; i < len; i++) {
        console.log(jquerySpecialChars[i]);
        escapseResult = escapseResult.replace(new RegExp(jquerySpecialChars[i],
          "g"), "\\" + jquerySpecialChars[i]);
      }
      return escapseResult;
    },
    //点击全屏 获取权限 关闭设置
    mainClick(e) {
      if (!this.audioMask) {
        let audioList = document.getElementsByTagName("audio");
        for (let i = 0, len = audioList.length; i < len; i++) {
          audioList[i].play()
          if (audioList[i].paused) {
            this.audioMask = true
          }
        }
      }
      this.audioMask = false;
      this.showErrTips = false;
      if (e.target.className !== "itemOperaImg") {
        this.$busMeeting.$emit('mainClick');
      }
    },
    // 检测页面是否隐藏
    handleVisibilityChange() {
      if (document.hidden) {
        console.log('页面已隐藏');
      } else {
        // this.$router.go(0)
        console.log('页面已显示');
      }
    },
    getSpeed() {
      //储存状态数组，默认网络合格，连续三次不合格切换成网络不合格状态，此后连续三次合格切换回网络合格状态
      let speedList = [true, true, true];
      // 是否已提示弱网环境
      let speedTiped = false;
      // 检测网络速度
      this.speedTest = setInterval(async () => {
        let speed = await testSpeed.getSpeedWithAjax('/api-gateway/jpaas-jmeeting-web-server/front/test?jmeeting=12345678901234567890123456789012')
        // console.log(speed);
        let newSpeed;
        speedList.splice(0, 1)
        if (speed > 0.1) {
          newSpeed = 1
          speedList.push(true)
        } else if (speed > 0.01) {
          newSpeed = 2
          speedList.push(true)
        } else if (speed == 0) {
          newSpeed = 99
          speedList.push(false)
        } else {
          newSpeed = 3
          speedList.push(false)
        }
        // console.log(newSpeed);
        // console.log(this.speed);
        // console.log(this.newPeople);
        if (speedList[0] && speedList[1] && speedList[2]) {
          // 重置
          speedTiped = false;
        }
        // 连续三次网络差强提示  已提示过则不再提醒
        if (!speedList[0] && !speedList[1] && !speedList[2] && !speedTiped) {
          this.ishowNetTips = true;
          speedTiped = true;
        }
        // 如果当前网络与之前不一致 && 有新人进会
        if (this.speed != newSpeed || this.newPeople) {
          const strData = JSON.stringify({
            event: 'notify',
            data: {
              event: 'network',
              identity: this.meetingObj.userId,
              speed: newSpeed
            },
          })
          const data = encoder.encode(strData);
          // 给其他人发消息自己的网络状态
          this.$room.localParticipant.publishData(data, 0);
          // 给自己切换网络状态
          for (let i = 0, len = this.stlist.length; i < len; i++) {
            if (this.stlist[i].identity == this.meetingObj.userId) {
              this.$set(this.stlist[i], 'speed', newSpeed)
            }
          }
          this.speed = newSpeed;
          this.newPeople = false;
        }
      }, 2000)
    },
    // 浏览器强提示
    notifyMe() {
      let name = '网络异常提示' //标题
      let options = {
        dir: "auto", // 文字方向
        tag: new Date().getTime(),
        body: '当前你的网络异常，请检查设备后重试！', // 通知主体
        requireInteraction: true, //true false 是否自动关闭通知
      };
      // 先检查浏览器是否支持
      if (!window.Notification) {
        console.log("浏览器不支持通知");
      } else {
        let notification = ''
        // 检查用户曾经是否同意接受通知
        if (Notification.permission === "granted") {
          notification = new Notification(name, options); // 显示通知
        } else if (Notification.permission === "default") {
          // 用户还未选择，可以询问用户是否同意发送通知
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              console.log("用户同意授权");
              notification = new Notification(name, options); // 显示通知
            } else if (permission === "default") {
              console.warn("用户关闭授权 未刷新页面之前 可以再次请求授权");
            } else {
              // denied
              console.log("用户拒绝授权 不能显示通知");
            }
          });
        } else {
          // denied 用户拒绝
          console.log("用户曾经拒绝显示通知");
        }
        if (notification) {
          // 用户点击通知
          notification.onclick = () => {
            window.focus();
            notification.close()
          }
        }
      }
    },
    inviteSuccess(data) {
      this.$emit('inviteSuccess', data)
    },
    inviteFailed() {
      this.$emit('inviteFailed')
    },
    // 开始录制
    recordStart() {
      if (this.meetingObj.hostId !== this.meetingObj.userId) {
        this.showTips({
          text: '仅主持人可以发起录制'
        })
        return;
      }
      if (!this.recordStartAllow) {
        this.showTips({
          text: '请2秒后开启录制'
        })
        return
      }
      let data = {
        liveId: this.meetingObj.liveId, // 会议id
        userId: this.meetingObj.userId, // 创建者id
        flag: 0, // 类型0：开始录制；1：结束录制
        jmeeting: '12345678901234567890123456789012'
      }
      jmeetingWebAPI.recordMeeting(data).then(res => {
        if (res.success) {
          this.showTips({
            text: '会议录制已开启'
          })
          const strData = JSON.stringify({
            event: 'notify',
            data: {
              event: 'startRecording'
            },
          })
          const data = encoder.encode(strData);
          // 给其他人发消息自己的网络状态
          this.$room.localParticipant.publishData(data, 0);
          this.meetingObj.isRecord = true
          this.isRecording = true
          this.createRecordTime = new Date().getTime()
          this.recordTimer = setInterval(() => {
            //实时时间
            let now = new Date().getTime();
            //计时器时间 = 实时时间 - 相对时间 + 点击暂停按钮时保存的时间
            let time = now - this.createRecordTime;
            //把处理过的时间显示到content标签中
            this.showRecordTime(time);
          }, 1000);
          this.$emit('recordStart', res)
        } else {
          this.$emit('recordStart', res)
        }
      }).catch(err => {
        this.$emit('recordStart', err)
      })
    },
    // 结束录制
    recordEnd() {
      if (this.meetingObj.hostId !== this.meetingObj.userId) {
        this.showTips({
          text: '仅主持人可以结束录制'
        })
        return;
      }
      this.isRecordEnd = true
    },
    endRecord() {
      let data = {
        liveId: this.meetingObj.liveId, // 会议id
        userId: this.meetingObj.userId, // 创建者id
        flag: 1, // 类型0：开始录制；1：结束录制
        jmeeting: '12345678901234567890123456789012'
      }
      this.recordLoading = true
      jmeetingWebAPI.recordMeeting(data).then(res => {
        if (res.success) {
          this.meetingObj.isRecord = false
          this.isRecording = false
          this.isRecordEnd = false
          this.recordStartAllow = false
          let that = this
          setTimeout(() => {
            that.recordStartAllow = true
          }, 2000)
          const strData = JSON.stringify({
            event: 'notify',
            data: {
              event: 'stopRecording'
            },
          })
          const data = encoder.encode(strData);
          // 给其他人发消息自己的网络状态
          this.$room.localParticipant.publishData(data, 0);
          this.$emit('recordEnd', res)
          this.recordLoading = false
        } else {
          this.$emit('recordEnd', res)
        }
      }).catch(err => {
        this.$emit('recordEnd', err)
      })
    },
    showRecordTime(time) {
      let n_hour = Math.floor(time / (3600 * 1000));
      let n_min = Math.floor(time / 1000 / 60 % 60);
      let n_sec = Math.floor(time / 1000 % 60);

      n_hour = n_hour < 10 ? "0" + n_hour : n_hour;
      n_min = n_min < 10 ? "0" + n_min : n_min;
      n_sec = n_sec < 10 ? "0" + n_sec : n_sec;
      this.recordTime = n_hour + ":" + n_min + ":" + n_sec;
    },
    closeMeeting() {
      let that = this
      return new Promise((resolved, rejected) => {
        if (this.meetingObj.isRecord) {
          this.$toast('请先结束录制!')
          rejected({
            status: false,
            message: '未结束录制'
          })
        }
        jmeetingWebAPI
          .externalClose({
            liveId: that.meetingObj.liveId,
            myId: tools.encrypt(that.meetingObj.phoneNumber, jpassConfig.publicKey),
            // jmeeting: tools.encrypt(imMethods.getUrlParams('phoneNumber'),jpassConfig.publicKey),
            jmeeting: '12345678901234567890123456789012',
          })
          .then(() => {
            const strData = JSON.stringify({
              event: 'notify',
              data: {
                event: 'close',
                liveId: that.meetingObj.liveId
              },
            })
            const data = encoder.encode(strData);
            that.$room.localParticipant.publishData(data, 0).then(() => {
              resolved({
                status: true,
                message: '结束会议成功'
              })
            })
          })
          .catch((err) => {
            console.log(`结束会议err`, err)
            rejected({
              status: false,
              message: '结束会议失败'
            })
          })
      })
    },
    // 录制开始时离开会议
    recordLeaveMeeting() {
      this.meetingObj.isDisconnected = false
      // this.localParticipant.setCameraEnabled(false)
      //   .then((res) => { })
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
    },
    // 公共展示提示方法
    showTips(data) {
      let that = this
      this.showTipsData.text = data.text ? data.text : ''
      this.showTipsData.type = data.type ? data.type : ''
      if (data.duration) {
        this.showTipsData.isShowTips = true
        setTimeout(function () {
          that.showTipsData.isShowTips = false
        }, data.duration)
      } else {
        this.showTipsData.isShowTips = true
        setTimeout(function () {
          that.showTipsData.isShowTips = false
        }, 3000)
      }
    },
    // 公共展示提示2
    showOtherTips(data) {
      let that = this
      this.rightTipsData.text = data.text ? data.text : ''
      this.rightTipsData.type = data.type ? data.type : ''
      if (data.duration === 'all') {
        this.rightTipsData.isShow = true
        return
      }
      if (data.duration) {
        this.rightTipsData.isShow = true
        setTimeout(function () {
          that.rightTipsData.isShow = false
        }, data.duration)
      } else {
        this.rightTipsData.isShow = true
        setTimeout(function () {
          that.rightTipsData.isShow = false
        }, 3000)
      }
    },
    showPeopleOverFunc() {
      this.showPeopleOver = true
    },
    timeOver() {
      let that = this
      this.showTimeOver = true
      this.timeOverNum = 30
      clearInterval(this.overTimer)
      this.overTimer = setInterval(() => {
        if (that.timeOverNum) {
          that.timeOverNum--
        } else {
          console.log('that.showTimeOver',that.showTimeOver)
          that.showTimeOver && that.closeMeetingByOther()
          clearInterval(that.overTimer)
          // that.overTimer = null
        }
      }, 1000);
    },
    closeMeetingByOther() {
      this.showTimeOver = false
      let that = this
      if (this.meetingObj.hostId === this.meetingObj.userId) {
        jmeetingWebAPI
          .externalClose({
            liveId: that.meetingObj.liveId,
            myId: tools.encrypt(that.meetingObj.phoneNumber, jpassConfig.publicKey),
            // jmeeting: tools.encrypt(imMethods.getUrlParams('phoneNumber'),jpassConfig.publicKey),
            jmeeting: '12345678901234567890123456789012',
          })
          .then(() => {
            const strData = JSON.stringify({
              event: 'notify',
              data: {
                event: 'close',
                liveId: that.meetingObj.liveId
              },
            })
            const data = encoder.encode(strData);
            that.$room.localParticipant.publishData(data, 0).then(() => {
              resolved({
                status: true,
                message: '结束会议成功'
              })
            })
            that.goBack()
          })
          .catch((err) => {
            console.log(`结束会议err`, err)
            rejected({
              status: false,
              message: '结束会议失败'
            })
          })
      } else {
        this.$room.disconnect()
        this.goBack('quitMeet')
      }
    }
  },
  beforeDestroy() {
    // 结束网络检测
    clearInterval(this.speedTest)
    // 计时结束
    clearInterval(this.computerTimer)
    clearInterval(this.recordTimer)
    clearInterval(this.overTimer)
    this.$busMeeting.$emit('quitFn')
  },
}
</script>
<style lang="less" scoped>
// @import "/assets/index.css";

.shareName {
  position: absolute;
  bottom: 95px;
  left: 40px;
  z-index: 999;
  background: #151616;
  border-radius: 4px;
  padding: 2px 6px;

  .itemShare {
    width: 16px;
    height: 16px;
  }

  .itemPerson {
    font-size: 14px;
    color: #ffffff;
    max-width: calc(100% - 32px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .itemImg {
    width: 16px;
    height: 16px;
    margin: 0 8px 0 10px;
  }
}


.spackName {
  // display: flex;
  position: absolute;
  // top: 60px;
  bottom: 95px;
  left: 40px;
  display: inline-flex;
  padding: 0 6px;
  height: 27px;
  background: #292725;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  transform: translateZ(100px);
  color: #fff;
  z-index: 999;
  font-size: 12px;
}

.networkTips {
  padding: 32px 32px 24px 32px;
  background: #333333;
  // box-shadow: 0px 4px 12px 0px rgba(255, 255, 255, 0.15);
  border-radius: 6px;

  .tipsTop {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    img {
      width: 22px;
      height: 22px;
      margin-right: 16px;
    }

    p {
      font-family: PingFangSC-Medium, Helvetica, Arial, Verdana, Tahoma, sans-serif;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
      line-height: 24px;
      font-weight: 500;
      margin-bottom: 0;
    }
  }

  p {
    font-family: PingFangSC-Regular, Helvetica, Arial, Verdana, Tahoma, sans-serif;
    font-size: 14px;
    color: #ffffff;
    line-height: 22px;
    font-weight: 400;
    margin-bottom: 24px;
  }
}

.netBtn {
  background: #1890FF;
  border-radius: 4px;
  padding: 5px 16px;
  font-family: PingFangSC-Regular, Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #FFFFFF;
  text-align: left;
  line-height: 22px;
  font-weight: 400;
  float: right;
}

.networkIcon {
  margin-left: 38px;

  img {
    width: 20px;
    height: 20px;
  }
}

video::-webkit-media-controls-volume-control-container {
  display: none !important;
}

video::-webkit-media-controls {
  --gradient-steps:
    hsla(0, 0%, 0%, 0) 0%,
    hsla(0, 0%, 0%, 0) 8.1%,
    hsla(0, 0%, 0%, 0) 15.5%,
    hsla(0, 0%, 0%, 0) 22.5%,
    hsla(0, 0%, 0%, 0) 29%,
    hsla(0, 0%, 0%, 0) 35.3%,
    hsla(0, 0%, 0%, 0) 41.2%,
    hsla(0, 0%, 0%, 0) 47.1%,
    hsla(0, 0%, 0%, 0) 52.9%,
    hsla(0, 0%, 0%, 0.013) 58.8%,
    hsla(0, 0%, 0%, 0.049) 64.7%,
    hsla(0, 0%, 0%, 0.104) 71%,
    hsla(0, 0%, 0%, 0.175) 77.5%,
    hsla(0, 0%, 0%, 0.259) 84.5%,
    hsla(0, 0%, 0%, 0.352) 91.9%,
    hsla(0, 0%, 0%, 0.45) 100%;
}

/deep/ .el-loading-spinner {
  padding-top: 18px;
}

video::-webkit-media-controls {
  --gradient-steps: hsla(0, 0%, 0%, 0) 0%;
}

/* video::-webkit-media-controls-fullscreen-button {
  display: none;
} */

video::-webkit-media-controls-play-button {
  display: none;
}

video::-webkit-media-controls-timeline {
  display: none;
}

video::-webkit-media-controls-current-time-display {
  display: none;
}

video::-webkit-media-controls-time-remaining-display {
  display: none;
}

video::-webkit-media-controls-mute-button {
  display: none;
}

video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}

video::-webkit-media-controls-volume-slider {
  display: none;
}

video::-webkit-media-controls {

  background: url();

}
</style>