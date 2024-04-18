<template>
  <div class="clearfix" @click="mainClick">
    <div class="title">
      <p>{{ liveName }}</p>
      <span class="meeting_time">{{ ele_timer }}</span>
    </div>
    <div class="mainWindow">
      <div v-if="audioMask" class="audio-mask bigvideo_box_span">
        <div class="audio-center">
          <img src="../assets/images/audiomask.png" alt="" />
          <!-- 点击屏幕获取音视频权限的授权 -->
          <span>点我播放会议声音</span>
        </div>
      </div>
      <div v-if="showErrTips" class="audio-mask bigvideo_box_span">
        <div class="audio-center">
          <img src="../assets/images/audiomask.png" alt="" />
          <span>{{ errTipText }}</span>
        </div>
      </div>
      <audio ref="audioPlayer" class="audioClass" autoplay controls></audio>
      <div class="memberList">
        <div class="memberBox" v-for="item in stlist" :key="item.identity">
          <div class="headImg">
            <img class="headIcon" :src="item.icon
              ? item.icon
              : require('../assets/ic_default_avatar.png')
              " alt="" />
            <!-- <img class="iconHead" v-if="item.identity == userId" src="../assets/voiceIcon/tx.png" alt=""> -->
          </div>
          <div class="memberInfo">
            <span>{{ item.name }}</span>
            <img v-if="item.audioOpen" src="../assets/voiceIcon/voice.png" alt="" />
            <img v-else src="../assets/voiceIcon/voice2.png" alt="" />
          </div>
        </div>
        <div v-if="stlist.length == 1 && member[0].identity != userId">
          <div class="memberBox" v-for="item in member" :key="item.imUserId">
            <div class="headImg isComing">
              <img class="headIcon" :src="item.iconUrl
                ? item.iconUrl
                : require('../assets/ic_default_avatar.png')
                " alt="" />
              <div class="waitGif wait">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="memberInfo" v-if="isBusyOnline">
              <span>{{ item.imRealName }}</span>
              <img src="../assets/voiceIcon/voice2.png" alt="" />
            </div>
            <div class="memberInfo" v-else>
              <span>对方忙线中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <div class="iconBox" v-show="!btn_muteShowOhide" @click="btn_mute">
        <img src="../assets/voiceIcon/jcjyx.png" alt="" />
        <span>静音</span>
      </div>
      <div class="iconBox" v-show="btn_muteShowOhide" @click="btn_unmute">
        <img src="../assets/voiceIcon/jyx.png" alt="" />
        <span>解除静音</span>
      </div>
      <div class="iconBox transparency">
        <img src="../assets/voiceIcon/gbspx.png" alt="" />
        <span>摄像头已关</span>
      </div>
      <div class="iconBox transparency">
        <img src="../assets/voiceIcon/gbfxx.png" alt="" />
        <span>共享屏幕</span>
      </div>
      <div class="iconBox" @click="closeMeeting()">
        <img src="../assets/voiceIcon/endMeeting.png" alt="" />
        <span>挂断</span>
      </div>
    </div>
  </div>
</template>
<script>
import { jmeetingWebAPI } from "../services/jmeeting";
// import requestJpaas from '../tools/jpaas_request'
import imMethods from "../tools/imMethods";
// import { tools } from "../tools/tool";
// import { mapState } from 'vuex'
// import { jpassConfig } from '../common/config.js'
const { RoomEvent } = require("livekit-client"); //, Room, RemoteParticipant
const decoder = new TextDecoder();
const encoder = new TextEncoder();
export default {
  data() {
    return {
      liveName: "", //会议名称
      computerTimer: null,
      ele_timer: "", //会议时长
      n_sec: 0,
      n_min: 0,
      n_hour: 0,
      electron: 0, //是否是盒子
      btn_muteShowOhide: true, //是否开启麦克风 false为开启
      audioMask: false,
      showErrTips: false,
      errTipText: "",
      localParticipant: "",
      participants: "",
      stlist: [],
      member: [],
      liveData: {},
      closeSingleChatMeetingType: 4, //0未响应，1结束，2拒绝，3忙线，4取消
      isCreator: false, //是否为创建者
      isBusyOnline: true, //对方是否忙线中 false为忙线中
      isBusyOnlineTimer: null,//忙线计时器
      isrefuseTimer: null,//60秒不接计时器
      electron: false,
    };
  },
  watch: {
    // 弱提示
    showErrTips(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.showErrTips = false;
        }, 3000);
      }
    },
    // 忙线中  10秒后自动退出
    isBusyOnline(newVal) {
      if (!newVal) {
        this.isBusyOnlineTimer = setTimeout(() => {
          this.closeMeeting();
        }, 10 * 1000);
      }
    },
  },
  created() {
    // 判断是否在盒子
    let userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('electron') > -1) {
      this.electron = true;
    }
    let liveCreatorId = imMethods.getUrlParams("liveCreatorId");
    if (liveCreatorId) {
      this.isCreator = true;
      this.createSingleChatMeeting();
    } else {
      this.isCreator = false;
      this.initData();
    }
  },
  mounted() {
    document.body.addEventListener(
      "mousedown",
      () => {
        this.$refs.audioPlayer.play();
      },
      false
    );
    /**
     * 自定义事件, 接收消息盒子传递的数据
     */
    window.addEventListener(
      "leaveMeeting",
      () => {
        //方法
        console.log('leaveMeeting','leaveMeeting');
        this.closeMeeting();
      },
      false
    );
  },
  methods: {
    // 创会
    async createSingleChatMeeting() {
      this.userId = imMethods.getUrlParams("liveCreatorId");
      let liveCreatorName = imMethods.getUrlParams("liveCreatorName");
      let callerId = imMethods.getUrlParams("callerId");
      let liveName = liveCreatorName + "发起的语音通话";
      jmeetingWebAPI
        .createSingleChatMeeting({
          liveCreatorId: this.userId,
          liveCreatorName,
          callerId,
          liveName,
          jmeeting: "12345678901234567890123456789012",
        })
        .then(async (res) => {
          console.log("创建会议", res);
          if (res.success) {
            // console.log('创建会议', res.data);
            // 通知盒子创建会议成功 响铃
            let userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("electron") > -1) {
              window.electron.getSingleCall(res.data);
            }
            let { token, liveUrl } = res.data.creator;
            this.liveName = res.data.liveInfo.liveName;
            this.liveId = res.data.creator.liveId;
            this.liveData = res.data;
            this.member[0] = res.data.member;
            // this.timeFn(createTime);
            // this.createTime(createTime)
            this.$room.prepareConnection(decodeURIComponent(liveUrl), token)
            await this.ininRoom(token, liveUrl);
            // 判断一分钟内是否接听
            this.isrefuseTimer = setTimeout(() => {
              if (this.stlist.length != 2) {
                this.closeSingleChatMeetingType = 0;
                this.closeMeeting();
              }
            }, 60 * 1000);
          } else if (res.message == "对方忙线中！") {
            // 对方忙线中
            this.closeSingleChatMeetingType = 3;
            this.isBusyOnline = false;
            // 通知盒子创建会议成功 响铃 挂断时盒子监听
            let userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("electron") > -1) {
              window.electron.getSingleCall(res.data);
            }
            let { token, liveUrl } = res.data.creator;
            this.liveName = res.data.liveInfo.liveName;
            this.liveId = res.data.creator.liveId;
            this.liveData = res.data;
            this.member[0] = res.data.member;
            // this.timeFn(createTime);
            // this.createTime(createTime)
            this.$room.prepareConnection(decodeURIComponent(liveUrl), token)
            await this.ininRoom(token, liveUrl);
          } else {
            this.$toast({
              message: res.message,
              onClose: () => {
                this.goBack();
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 入会
    async initData() {
      this.userId = imMethods.getUrlParams("userId");
      this.liveId = imMethods.getUrlParams("liveId");
      jmeetingWebAPI
        .acceptSingleChatMeeting({
          liveId: this.liveId,
          userId: this.userId,
          jmeeting: "12345678901234567890123456789012",
        })
        .then(async (res) => {
          // console.log(res);
          if (res.success) {
            console.log("入会", res.data);
            // 入会者正常结束电话
            this.closeSingleChatMeetingType = 1;
            let { token, liveUrl } = res.data.liveInfo;
            // this.liveData = res.data;
            this.liveName = res.data.liveInfo.liveName;
            this.member[0] = res.data.creator;
            // this.timeFn(createTime);
            let liveTime = new Date().getTime();
            // 计算通话时长
            this.createTime(liveTime);
            this.$room.prepareConnection(decodeURIComponent(liveUrl), token)
            // 房间初始化
            await this.ininRoom(token, liveUrl);
          } else {
            this.$toast({
              message: res.message,
              onClose: () => {
                this.goBack();
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 初始化房间
    async ininRoom(token, url) {
      this.localParticipant = this.$room.localParticipant;
      //有新轨道
      this.$room.on(RoomEvent.TrackSubscribed, this.TrackSubscribed)
        //与服务器的连接建立时，处理人员列表，主要处理自己置顶，主持人第二位
        .on(RoomEvent.Connected, this.Connected)
        //接受消息
        .on(RoomEvent.DataReceived, this.DataReceived)
        // 开启音视频
        .on(RoomEvent.TrackUnmuted, this.TrackUnmuted)
        // 关闭音视频
        .on(RoomEvent.TrackMuted, this.TrackMuted)
        // join
        .on(RoomEvent.ParticipantConnected, this.ParticipantConnected)
        // leave
        .on(RoomEvent.ParticipantDisconnected, this.ParticipantDisconnected)
        // 切换设备
        .on(RoomEvent.ConnectionStateChanged, this.ConnectionStateChanged)
      await this.$room
        .connect(decodeURIComponent(url), token)
        .then((res) => {
          console.log("ws连接成功", res);
        })
        .catch((err) => {
          console.log("ws连接失败", err, err.message);
          this.errTipText = "入会失败";
          this.showErrTips = true;
        });

      // 测试
      // 音频播放状态已更改
      // this.$room.on(RoomEvent.AudioPlaybackStatusChanged, this.audioPlaybackChanged);
    },
    Connected() {
      console.log("Connected");
      const json = Object.fromEntries(this.$room.participants);
      this.participants = Object.fromEntries(this.$room.participants);
      this.stlist = Object.values(json).concat(this.$room.localParticipant);
      for (let i = 0, len = this.stlist.length; i < len; i++) {
        this.$set(this.stlist[i], "speed", 1);
        this.$set(this.stlist[i], "audioOpen", false);
        this.$set(this.stlist[i], "isSpeaking", false);
        this.$set(
          this.stlist[i],
          "icon",
          this.stlist[i].metadata
            ? JSON.parse(this.stlist[i].metadata).icon
            : ""
        );
      }
      // this.stlist.reverse()
      // 开麦
      this.btn_unmute();
    },
    TrackSubscribed(track, publication, participant) {
      console.log(
        "TrackSubscribed",
        participant.name,
        track,
        publication,
        participant
      );
      let that = this;
      setTimeout(() => {
        for (let i = 0, len = that.stlist.length; i < len; i++) {
          if (track.kind == "audio" && track.isMuted == false) {
            if (participant.identity == this.userId) {
              return;
            }
            if (participant.identity == that.stlist[i].identity) {
              that.$set(that.stlist[i], "audioOpen", true);
              let audioEle = this.$refs.audioPlayer;
              audioEle.srcObject = track.mediaStream;
              audioEle.load();
              audioEle.play();
              if (audioEle.paused) {
                this.audioMask = true;
              }
              that.stlist[i].audioStream = track.mediaStream;
            }
          }
        }
      }, 300);
    },
    DataReceived(payload) {
      console.log('DataReceived--接收消息', decoder.decode(payload));
      let receivedData = JSON.parse(decoder.decode(payload)).data;
      console.log(receivedData);
      // 跟客户端同步
      if (receivedData.event == "close" && receivedData.liveId == this.liveId) {
        console.log('关闭消息');
        this.$toast({
          message: "通话已结束",
          // duration: 1000,
          // onClose: () => {
          //   this.goBack();
          // },
        });
        this.goBack()
      }
      if (
        receivedData.event == "phoneCall" &&
        receivedData.liveId == this.liveId
      ) {
        // type：状态 1-收到来电 2-来电拒接 3-接通来电
        if (receivedData.type == 1) {
          this.$toast({
            message: "对方收到其他来电",
          });
        }
      }
    },
    TrackUnmuted(track, publication, participant) {
      console.log(
        "开启音视频",
        publication.name,
        track,
        publication,
        participant
      );
      if (track.kind == "audio") {
        if (publication.identity == this.userId) {
          return;
        }
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (publication.identity == this.stlist[i].identity) {
            this.$set(this.stlist[i], "audioOpen", true);
            let audioEle = this.$refs.audioPlayer;
            audioEle.srcObject = track.track.mediaStream;
            audioEle.load();
            audioEle.play();
            if (audioEle.paused) {
              this.audioMask = true;
            }
            this.stlist[i].audioStream = track.mediaStream;
          }
        }
      }
    },
    TrackMuted(track, publication, participant) {
      console.log(
        "关闭音视频",
        publication.name,
        track,
        publication,
        participant
      );
      if (track.kind == "audio") {
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (publication.identity == this.stlist[i].identity) {
            this.$set(this.stlist[i], "audioOpen", false);
          }
        }
      }
    },
    ParticipantConnected(track) {
      //延时解决多次刷新 收不到join的问题
      setTimeout(() => {
        console.log("livekit=join", track);
        let res = this.stlist.find((v) => {
          return v.identity == track.identity; // return v.value ===  '9'  返回undefined
        });
        track.icon = JSON.parse(track.metadata).icon;
        if (!res) {
          this.closeSingleChatMeetingType = 1;
          this.stlist.push(track);
          // 计算通话时长
          let liveTime = new Date().getTime();
          this.createTime(liveTime);
        }
      }, 0);
    },
    ParticipantDisconnected(track, publication, participant) {
      console.log("leave=====", publication, track, participant);
      this.stlist.map((item, index) => {
        if (track.identity == item.identity) {
          this.stlist.splice(index, 1);
          this.goBack();
        }
      });
    },
    ConnectionStateChanged(track) {
      console.log("切换设备", track);
    },
    //静音
    btn_mute() {
      this.localParticipant
        .setMicrophoneEnabled(false)
        .then(() => {
          console.log("静音");
          for (let i = 0; i < this.stlist.length; i++) {
            if (this.userId == this.stlist[i].identity) {
              this.btn_muteShowOhide = true;
              this.$set(this.stlist[i], "audioOpen", false);
            }
          }
        })
        .catch((err) => {
          console.log("关闭麦克风失败", err);
          this.errTipText = "关闭麦克风失败";
          this.showErrTips = true;
          for (let i = 0; i < this.stlist.length; i++) {
            if (this.userId == this.stlist[i].identity) {
              this.btn_muteShowOhide = false;
              this.$set(this.stlist[i], "audioOpen", true);
            }
          }
        });
    },
    // 取消静音
    btn_unmute() {
      console.log("取消静音");
      this.localParticipant
        .setMicrophoneEnabled(
          true,
          {
            echoCancellation: true, //回声取消
            noiseSuppression: true, //噪音抑制
            sampleRate: 48000, //每秒采样的次数
            sampleSize: 32, //每个采样点的位数
          },
          {
            audioPreset: "musicHighQualityStereo", //musicHighQualityStereo telephone
          }
        )
        .then(() => {
          console.log("打开麦克风");
          for (let i = 0; i < this.stlist.length; i++) {
            if (this.userId == this.stlist[i].identity) {
              this.btn_muteShowOhide = false;
              this.$set(this.stlist[i], "audioOpen", true);
            }
          }
        })
        .catch((err) => {
          console.log("打开麦克风失败", err);
          if (err.message == "Permission denied") {
            this.errTipText = "麦克风访问权限被拒";
          } else {
            this.errTipText = "打开麦克风失败";
          }
          this.showErrTips = true;
          // 重新关闭
          for (let i = 0; i < this.stlist.length; i++) {
            if (this.userId == this.stlist[i].identity) {
              this.btn_muteShowOhide = true;
              this.$set(this.stlist[i], "audioOpen", false);
            }
          }
        });
    },
    closeMeeting() {
      // 计时结束
      clearInterval(this.computerTimer);
      clearTimeout(this.isBusyOnlineTimer);
      clearTimeout(this.isrefuseTimer);
      jmeetingWebAPI
        .closeSingleChatMeeting({
          liveId: this.liveId,
          userId: this.userId,
          type: this.closeSingleChatMeetingType,
          jmeeting: "12345678901234567890123456789012",
        })
        .then(async () => {
          console.log("结束会议");
          // console.log(this.closeSingleChatMeetingType);
          // 对方接听情况下发送消息关闭
          if (
            // this.closeSingleChatMeetingType != 3 ||
            // this.closeSingleChatMeetingType != 0
            this.closeSingleChatMeetingType == 1
          ) {
            const strData = JSON.stringify({
              event: "notify",
              data: {
                event: "close",
                liveId: this.liveId,
              },
            });
            const data = encoder.encode(strData);
            this.$room.localParticipant.publishData(data, 0).then(() => {
              console.log("消息发送成功！");
              // 断开连接
              this.$room.disconnect();
              this.$toast({
                message: "通话已结束",
                // duration: 1000,
                // onClose: () => {
                //   window.electron.closeMeeting(location.href);
                // },
              });
              if (this.electron) {
                window.electron.closeMeeting(location.href);
              } else {
                this.$router.go(-1)
              }

            }).catch(err => {
              console.log('消息发送失败,', err.message);
            });
          } else {
            // 断开连接
            this.$room.disconnect();
            if (this.electron) {
              window.electron.closeMeeting(location.href);
            } else {
              this.$router.go(-1)
            }
          }
        });
    },
    goBack() {
      window.electron.closeMeeting(location.href);
    },
    createTime(dateBegin) {
      this.computerTimer = setInterval(() => {
        //实时时间
        let now = new Date().getTime();
        //计时器时间 = 实时时间 - 相对时间 + 点击暂停按钮时保存的时间
        let time = now - dateBegin;
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
      if (this.n_hour == "00") {
        this.ele_timer = this.n_min + ":" + this.n_sec;
      } else {
        this.ele_timer = this.n_hour + ":" + this.n_min + ":" + this.n_sec;
      }
    },
    //点击全屏 获取权限 关闭设置
    mainClick() {
      if (!this.audioMask) {
        this.$refs.audioPlayer.play();
        if (this.$refs.audioPlayer.paused) {
          this.audioMask = true;
        }
      }
      this.audioMask = false;
    },
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/voiceCss.less";
</style>
