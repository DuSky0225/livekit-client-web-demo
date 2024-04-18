<template>
  <div class="main" :class="Initiator == '1' ? 'host' : 'audience'" v-if="isQuitGroup">
    <span class="btn dismissBtn" v-if="Initiator == '1'" @click="overmeeting">全员结束</span>
    <span class="btn" :class="Initiator == '1' ? 'cancelBtn' : 'dismissBtn'" @click="quitFn">离开会议</span>
    <!-- <el-dialog title="提示" :visible.sync="isQuitGroup" :modal-append-to-body='false' width="421px" top="261px"
      :before-close="cancelFn" v-if="Initiator == '0'">
      <div class="dialogMain">
        <div class="bodyTop">是否确认离开会议</div>
        <div class="bodyBottom">
          <button class="dismissBtn" @click="quitFn">离开会议</button>
          <button class="cancelBtn" @click="cancelFn">取消</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="isQuitGroup" :modal-append-to-body='false' width="421px" top="261px"
      :before-close="cancelFn" v-if="Initiator == '1'">
      <div class="dialogMain">
        <div class="bodyTop">仅自己离开会议还是结束会议</div>
        <div class="bodyBottom">
          <button class="cancelBtn" @click="quitFn">离开会议</button>
          <button class="dismissBtn" @click="overmeeting">全员结束</button>
          <button class="cancelBtn" @click="cancelFn">取消</button>
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { jmeetingWebAPI } from '../services/jmeeting'
// import imMethods from '../tools/imMethods'
import { tools } from "../tools/tool";
import { jpassConfig } from '../config.js'
const encoder = new TextEncoder()
export default {
  name: "QuitGroup",
  props: ["Initiator", 'room', "meetingObj", "stlist"],
  data() {
    return {
      isQuitGroup: false,
    };
  },
  methods: {
    open() {
      this.isQuitGroup = true;
    },
    //全员结束
    overmeeting() {
      if (this.meetingObj.isRecord) {
        let data = {
          liveId: this.meetingObj.liveId, // 会议id
          userId: this.meetingObj.userId, // 创建者id
          flag: 1, // 类型0：开始录制；1：结束录制
          jmeeting: '12345678901234567890123456789012'
        }
        jmeetingWebAPI.recordMeeting(data).then(res => {
          if (res.success) {
            let liveMode = this.meetingObj.liveMode
            this.isQuitGroup = false;
            if (liveMode == -1) {
              this.closeOut();
            } else {
              this.closeIn();
            }
          }
        })
        return
      }
      let liveMode = this.meetingObj.liveMode
      this.isQuitGroup = false;
      if (liveMode == -1) {
        this.closeOut();
      } else {
        this.closeIn();
      }
    },
    closeIn() {
      jmeetingWebAPI
        .closeMeeting({
          liveId: this.meetingObj.liveId,
          myId: this.meetingObj.userId,
          // jmeeting: imMethods.getUrlParams('userId'),
          jmeeting: '12345678901234567890123456789012',
        })
        .then(() => {
          const strData = JSON.stringify({
            event: 'notify',
            data: {
              event: 'close',
              liveId: this.meetingObj.liveId
            },
          })
          const data = encoder.encode(strData);
          this.$room.localParticipant.publishData(data, 0).then(() => {
            this.$emit("goBack");
          })
        })
        .catch((err) => {
          console.log(`结束会议err`, err)
        })
    },
    closeOut() {
      jmeetingWebAPI
        .externalClose({
          liveId: this.meetingObj.liveId,
          // myId: this.meetingObj.liveMode == -1 && this.meetingObj.userId ? this.meetingObj.userId : tools.encrypt(this.meetingObj.phoneNumber, jpassConfig.publicKey),
          myId: tools.encrypt(this.meetingObj.phoneNumber, jpassConfig.publicKey),
          jmeeting: '12345678901234567890123456789012',
        })
        .then(() => {
          const strData = JSON.stringify({
            event: 'notify',
            data: {
              event: 'close',
              liveId: this.meetingObj.liveId
            },
          })
          const data = encoder.encode(strData);
          this.$room.localParticipant.publishData(data, 0).then(() => {
            this.$emit("goBack");
          })
        })
        .catch((err) => {
          console.log(`结束会议err`, err)
        })
    },
    //离开会议
    quitFn() {
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
      let judge = false
      if(arr.length > 0) {
        judge = true
      }
      if (judge && Number(this.meetingObj.liveMode) != '-1' && this.meetingObj.hostId === this.meetingObj.userId) {
        this.$emit('transferHost')
        return;
      }
      this.meetingObj.isDisconnected = false
      // this.$room.disconnect()
      this.$busMeeting.$emit('btn_disableWebcam');
      // this.localParticipant.setCameraEnabled(false)
      // .then((res) => { })
      this.isQuitGroup = false
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
              this.$emit("goBack");
            } else {
              // let confirm = window.confirm(res.message)
              // 入会失败返回消息列表
              this.$emit("goBack");
              // if (confirm) {
              //   this.$emit("goBack");
              // } else {
              //   this.$emit("goBack");
              // }
            }
          })
          .catch((err) => {
            console.log(`离开会议err`, err)
          })
      } else {
        this.$room.disconnect()
        this.$emit("goBack", 'quitMeet');
      }
    },
    //取消
    cancelFn() {
      this.isQuitGroup = false;
    },
  },
  watch: {
  },
  created() { },
  mounted() {
    this.$busMeeting.$on('quitFn', this.quitFn)
  },
  beforeDestroy() {
    this.$busMeeting.$off('quitFn')
  }
};
</script>
<style lang="less" scoped>
.main {
  //   ::v-deep .el-dialog {
  //     border-radius: 10px;
  //   }

  //   ::v-deep .el-dialog__header {
  //     display: flex;
  //     padding: 14px 30px;
  //     align-items: center;
  //     background: #f5f6f8;
  //     border-radius: 10px 10px 0 0;
  //   }

  //   ::v-deep .el-dialog__title {
  //     font-size: 16px;
  //     color: #000;
  //     line-height: 22px;
  //   }

  //   ::v-deep .el-dialog__headerbtn {
  //     top: auto !important;
  //   }

  //   ::v-deep .el-dialog__body {
  //     padding: 0;
  //     display: flex;
  //   }
  // }

  // .dialogMain {
  //   width: 100%;

  //   .bodyTop {
  //     padding: 30px 26px 29px 30px;
  //     font-size: 14px;
  //     color: #000000;
  //     border-bottom: 1px solid #eff0f1;
  //   }

  //   .bodyBottom {
  //     padding: 8px 0;
  //     display: flex;
  //     justify-content: flex-end;

  //     button {
  //       background: #1677ff;
  //       border-radius: 4px;
  //       font-size: 14px;
  //       color: #ffffff;
  //       width: 84px;
  //       height: 36px;
  //     }

  //     .dismissBtn {
  //       background: #1890ff;
  //     }

  //     .cancelBtn {
  //       background: #f5f6f7;
  //       border: 1px solid #eff0f1;
  //       color: #000;
  //       margin: 0 24px 0 12px;
  //     }
  //   }
  position: absolute;
  right: 20px;
  width: 192px;
  // height: 112px;
  background: #202223;
  border: 1px solid rgba(75, 76, 75, 1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px 0;

  .btn {
    width: 160px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    font-family: PingFangSC-Regular, Helvetica, Arial, Verdana, Tahoma, sans-serif;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    font-weight: 400;
    margin: 0 auto;
  }

  .dismissBtn {
    background: #F85119;
    margin-bottom: 16px;
  }

  .cancelBtn {
    background: #494A49;
  }
}

.host {
  height: 112px;
  top: -126px;
}

.audience {
  top: -78px;
}
</style>

