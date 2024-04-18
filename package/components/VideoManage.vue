<template>
  <div class="videoManageMain">
    <div @click.stop="selectVideo(item)" v-for="(item, index) in stlist" :key="item.identity" class="videoItem"
      :id="'player-' + item.identity" :style="item.identity == selectVideoUserid && !item.isSpeaking
        ? 'border-color:rgba(22,119,255,1);'
        : item.isSpeaking && item.audioOpen
          ? 'border-color:#52C41A;'
          : ''
        ">
      <div class="itemState state2" :style="item.state == 2 || !item.videoOpen || (isSharing && item.identity == meetingObj.userId)
        ? 'height:119px;' : 'height:112px;'" v-show="(!item.videoOpen || (isSharing && item.identity == meetingObj.userId)) && (!item.ShareStream && !item.VideoStream)">
        <!-- liveMode为 -1 (纯外部会议) 或 用户 userType 不为 0 (内部成员) 时展示自定义头像 -->
        <!-- <span>{{  }}</span> -->
        <div id="stateImgName" v-if="meetingObj.liveMode == -1 || (item.userType && item.userType !== 0)">
          {{ item.name.substring(item.name.length - 2) }}</div>
        <img id="stateImg" v-else :src="item.icon ? item.icon : require('../assets/images/ic_default_avatar.png')"
          :onerror="errorImage" alt />
        <div id="stateImgNames" v-if="meetingObj.phoneCallList && meetingObj.phoneCallList.indexOf(item.identity) > -1">
          <img class="icon" src="../assets/images/phoneCall.svg" alt="" srcset="">
        </div>
      </div>
      <label></label>
      <video :class="item.identity == meetingObj.userId ? 'rtc_media_player_self' : 'rtc_media_player_unself'" id="rtc_media_player"
        style="object-fit: cover" width="310" muted autoplay playsinline="true" webkit-playsinline="true"></video>
      <audio v-if="item.identity !== meetingObj.userId" id="rtc_media_player_audio" autoplay controls></audio>
      <span id="youliu" v-show="item.bit">{{ Math.round(item.bit / 1024) }}k</span>
      <div class="networkIcon">
        <img v-if="item.speed == 3 || item.speed == 99" src="../assets/networks/poor.svg" alt="" />
        <img v-else-if="item.speed == 2" src="../assets/networks/warn.svg" alt="" />
        <img v-else src="../assets/networks/good.svg" alt="" />
      </div>
      <div class="itemName">
        <img class="itemShare" v-if="item.identity == meetingObj.isScreenShare[2]" src="../assets/bottomOpera/sharingGreen.png" alt />
        <!-- item.identity == userId ? '我' : item.name -->
        <span class="itemPerson">{{ item.name }}</span>
        <!-- <span class="itemPerson" v-if="meetingObj.phoneCallList && meetingObj.phoneCallList.indexOf(item.identity) > -1">接听系统来电中</span> -->
        <img class="itemImg" v-show="item.audioOpen == true" src="../assets/images/whiteqxjy.svg" alt />
        <img class="itemImg" v-show="item.audioOpen == false || item.audioOpen == null" src="../assets/images/whitejy.svg" alt />
      </div>
      <label></label>
      <span id="peer"></span>
    </div>
  </div>
</template>
<script>
import { jmeetingWebAPI } from '../services/jmeeting'
// import { Modal } from 'ant-design-vue'
// import QuitMeet from '../components/closeMeeting'
// import SelectContact from '../components/selectContact'
import reCall from './reCall'
// import imMethods from '../tools/imMethods'
// import { mapState } from 'vuex'
// import { tools } from '../tools/tool'
const { RoomEvent } = require('livekit-client')//, Room, RemoteParticipant
const decoder = new TextDecoder()
const encoder = new TextEncoder()
export default {
  name: 'Management',
  components: {
    reCall,
  },
  props: ['localParticipant', 'stlist', 'isSharing','meetingObj'],
  // computed: {
  //   ...mapState([
  //     'liveId', 
  //     'liveMode', 
  //     'userId', 
  //     'userIdJoin', 
  //     'liveCreatorId', 
  //     'liveName', 
  //     'liveType', 
  //     'Initiator', 
  //     'allUserList', 
  //     'unOnline', 
  //     'mainWindow', 
  //     'mainWindowUserid', 
  //     'isScreenShare']),//与state中的名字相同,在template中可以直接使用name,age
  // },
  data() {
    return {
      audio: new Audio(),//播放器
      timeout: null,//刷新成员列表
      selectVideoUserid: '',
      selectVideoUserName: "",
      errorImage:
        ' this.src=" ' + require('../assets/images/ic_default_avatar.png') + ' " ',
    }
  },
  methods: {
    // 播放音频
    audioPlay(audioStream) {
      this.audio.srcObject = audioStream
      if (this.audio.paused) {
        this.$parent.audioMask = true
      }
      this.audio.load()
    },
    DataReceived(payload, publication, kind) {
      // console.log('DataReceived--接收消息', decoder.decode(payload));
      let receivedData = JSON.parse(decoder.decode(payload)).data;
      if (receivedData.event != 'network') {
        console.log(receivedData);
      }
      //invite 邀请人员
      if (receivedData.event == 'invite' && receivedData.liveId == this.meetingObj.liveId) {
        this.getMeetingUsers();
      }
      // 全员看TA
      if (receivedData.event == 'setMainWindow') {
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (this.stlist[i].identity == receivedData.mainWindowidentity) {
            this.meetingObj.mainWindowUserid = this.stlist[i].identity
            this.selectVideo(this.stlist[i])
          }
        }
      }
      // 取消全员看TA
      if (receivedData.event == 'canceSetMainWindow') {
        this.meetingObj.mainWindowUserid = ""
        this.selectVideo(this.stlist[0])
        // 取消全员看TA时若有人正在共享屏幕，则跳转共享屏幕；否则跳转到 我
        // console.log(this.isScreenShare);
        if (this.meetingObj.isScreenShare[0]) {
          for (let i = 0, len = this.stlist.length; i < len; i++) {
            if (this.stlist[i].identity == this.meetingObj.isScreenShare[2]) {
              this.selectVideo(this.stlist[i])
            }
          }
        } else {
          this.selectVideo(this.stlist[0])
        }
      }
      // 网络状态
      if (receivedData.event == 'network') {
        for (let i = 0, len = this.stlist.length; i < len; i++) {
          if (this.stlist[i].identity == receivedData.identity) {
            this.$set(this.stlist[i], 'speed', receivedData.speed)
          }
        }
      }
    },
    async ininRoom(item = this.stlist[0]) {
      // console.log(this.stlist[0]);
      //页面渲染完成后 大屏切换为当前用户
      this.$nextTick(() => {
        // setTimeout(() => {
        // 判断是否已设定全员看他 有的话切换主屏幕
        if (this.meetingObj.mainWindowUserid) {
          for (let i = 0, len = this.stlist.length; i < len; i++) {
            if (this.stlist[i].identity == this.meetingObj.mainWindowUserid) {
              this.selectVideo(this.stlist[i])
            }
          }
        } else {
          this.selectVideo(item);
        }
        console.log('走2')
        this.getMeetingUsers();
        // }, 0);
      })
      //接受消息
      this.$room.on(RoomEvent.DataReceived, this.DataReceived);
    },
    selectVideo(event) {
      console.log(`切换-------------------`, event)
      // return
      this.$parent.select = event
      this.selectVideoUserid = event.identity
      this.selectVideoUserName = event.name;
      this.$nextTick(() => {
        // document.getElementById('bigvideo').style.transform = this.isScreenShare[1] == event.name ? 'rotateY(0deg)' : 'rotateY(180deg)'
        // document.getElementById('bigvideo').style.webkitTransform = this.isScreenShare[1] == event.name ? 'rotateY(0deg)' : 'rotateY(180deg)'
        // document.getElementById('bigvideo').style.mozTransform = this.isScreenShare[1] == event.name ? 'rotateY(0deg)' : 'rotateY(180deg)'

        document.getElementById('player-' + this.selectVideoUserid).childNodes.forEach((item) => {
          if (item.id == 'rtc_media_player') {
            // document.getElementById('bigvideo').style.objectFit = item.style.objectFit;
            document.getElementById('bigvideo').style.objectFit = 'contain'
          }
        })
      })
      // if (JSON.parse(JSON.stringify(event)).videoOpen == true || JSON.parse(JSON.stringify(event)).isShare) {
      if (event.videoOpen == true || event.isShare) {
        let video2 = $('#bigvideo')
        /* 判断当前大屏展示的是共享屏幕还是视频 */
        if(event.ShareStream || event.VideoStream) {
          console.log('event.ShareStream',event.ShareStream)
          console.log('event.VideoStream',event.VideoStream)
          video2.prop('srcObject',event.ShareStream ? event.ShareStream : event.VideoStream)
          let ui = document.getElementById('player-' + event.identity)
          let video = ui.querySelector("#rtc_media_player")
          video.srcObject = event.VideoStream ? event.VideoStream : event.ShareStream
        }
      } else {
        let video = $('#bigvideo')
        video.prop('srcObject', null)
      }
    },
    //获取全部成员列表
    getMeetingUsers() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        jmeetingWebAPI
          .getMeetingUsers({
            liveId: this.meetingObj.liveId,
            // jmeeting:tools.getNum(),
            jmeeting: '12345678901234567890123456789012',
          })
          .then((res) => {
            if (res.success) {
              // bug修复注意
              console.log('获取全部成员列表----------------------', res.data);
              // this.allUserList=res.data ;
              this.meetingObj.allUserList = res.data
              this.refreshList()
            }
          })
      }, 2000)
    },
    //刷新未入会列表
    refreshList() {
      let unOnline = this.meetingObj.unOnline ? this.meetingObj.unOnline : [];
      for (let i = 0; i < this.meetingObj.allUserList.length; i++) {
        let index = this.stlist.findIndex((item) => {
          return item.identity == this.meetingObj.allUserList[i].id
        })
        let index2 = unOnline.findIndex((item) => {
          return item.id == this.meetingObj.allUserList[i].id
        })
        //刷新成员状态 userType 0-内网 其他-外网
        if (index !== -1 && this.meetingObj.allUserList[i].userType) {
          this.$set(this.$parent.stlist[index], 'userType', this.meetingObj.allUserList[i].userType);
        }
        if (index2 !== -1 && this.meetingObj.allUserList[i].userType) {
          this.$set(unOnline[index], 'userType', this.meetingObj.allUserList[i].userType);
        }
        if (index == -1 && index2 == -1) {
          unOnline.push(this.meetingObj.allUserList[i])
        } else if (index != -1 && index2 != -1) {
          unOnline.splice(index2, 1)
        }
      }
      this.meetingObj.unOnline = unOnline
      this.$forceUpdate()
    },
    sendZf(value) {
      let that = this
      jmeetingWebAPI
        .addMeetingPeople({ jmeeting: that.meetingObj.userId }, {
          groupIds: value.groupIds,
          friendIds: value.memberIds,
          mechanismId: [],
          liveId: that.meetingObj.liveId,
          myId: that.meetingObj.userIdJoin,
          // jmeeting:that.userIdJoin,
          jmeeting: '12345678901234567890123456789012',
          reCall: false,
        })
        .then((res) => {
          console.log(`邀请res`, res)
          if (res.success) {
            const strData = JSON.stringify({
              event: 'notify',
              data: {
                event: 'invite',
                liveId: this.meetingObj.liveId
              },
            })
            const data = encoder.encode(strData);
            this.localParticipant.publishData(data, 0);
            this.getMeetingUsers();
            this.$emit('inviteSuccess',value.memberDetailList)
          } else {
            this.$message['warning'](res.message)
            this.$emit('inviteFailed')
          }
        })
        .catch((err) => {
          console.log(`邀请err`, err)
        })
    }
  },
  watch: {
  },
  created() {
    console.log(this.stlist);
  },
  mounted() {
    this.$busMeeting.$on('sendZf', (value) => {
      this.sendZf(value)
    })
    this.$busMeeting.$on('selectVideo', (value) => {
      this.selectVideo(value);
    })
  },
  beforeDestroy() {
    this.$busMeeting.$off('sendZf')
    this.$busMeeting.$off('selectVideo')
  }
}
</script>
<style lang='less' scoped>
.videoManageMain {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 200px;
  height: calc(100% - 86px);
  overflow: hidden;
  overflow-y: scroll;
  z-index: 98;
}

.videoItem {
  margin-bottom: 11px;
  position: relative;
  height: 118px;
  border: 3px solid #1e1e1e;
  box-sizing: content-box;
}

.videoItem:last-child {
  margin-bottom: 120px;
}

.itemState {
  width: 100%;
  height: 112px;
  background: #1e1e1e;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 98;
  display: flex;
  justify-content: center;
  align-items: center;
}

#stateImgName {
  width: 80px;
  height: 80px;
  line-height: 80px;
  font-size: 20px;
  color: #fff;
  text-align: center;
  background: #0078EF;
  border-radius: 50%;
}
#stateImgNames {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  z-index: 999;
}
#stateImgNames .icon{
  width: 20px;
  height: 20px;
}
#stateImg {
  height: 80px;
  border-radius: 50%;
  position: absolute;
  width: 80px;
}

// .rtc_media_player_self {
//   transform: rotateY(180deg);
//   -webkit-transform: rotateY(180deg);
//   -moz-transform: rotateY(180deg);
// }

// .rtc_media_player_unself {
//   transform: rotateY(0deg);
//   -webkit-transform: rotateY(0deg);
//   -moz-transform: rotateY(0deg);
// }

audio {
  height: 0;
  /* width: 196px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    top: -189px;
    z-index: 100; */
}

.itemName {
  z-index: 99;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
}

.itemImg {
  width: 16px;
  height: 16px;
}

.itemShare {
  width: 16px;
  height: 16px;
  margin-left: 10px
}

.itemPerson {
  font-size: 14px;
  color: #ffffff;
  margin: 0 8px 0 10px;
  max-width: calc(100% - 32px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#youliu {
  transform: scale(0.7);
  position: absolute;
  bottom: 0;
  right: 20px;
  font-size: 12px;
  color: white;
  z-index: 98;
}

.networkIcon {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 12px;
  color: white;
  z-index: 100;

  img {
    width: 8px;
    height: 10px;
  }
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