<template>
  <div id="transferHost" class="trabsferHost" v-if="visible">
    <span class="title">指定一名新主持人</span>
    <el-input placeholder="搜索" prefix-icon="el-icon-search" v-model="inputPeople" @keyup.enter.native="search"></el-input>
    <div class="peopleList" style="max-height: 216px; overflow-y: auto;">
      <div v-for="(item, index) in showPeopleList" :key="index" :class="item.userType == '-1' ? 'peopleBoxOther' : item.isSelected ? 'peopleBoxActive' : 'peopleBox'"
        @click="selectPeople(index)">
        <img v-if="item.userType != '-1'" class="avatarImg" :src="item.icon ? item.icon : '../assets/images/ic_default_avatar.png'" alt="" srcset="" :onerror="errorImage">
        <div v-else class="avatarImg">
          <span class="avatarName">{{ item.name.substring(item.name.length - 2) }}</span>
        </div>
        <span class="name">{{ item.name }}</span>
        <i v-if="item.isSelected" class="el-icon-check checkIcon"></i>
      </div>
    </div>
    <button class="leaveBtn" @click="comfirmSelected">指定并离开会议</button>
  </div>
</template>

<script>
import { jmeetingWebAPI } from '../services/jmeeting'
const encoder = new TextEncoder()
export default {
  name: 'TransferHost',
  props: {
    // 窗口显示和隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 成员列表
    stlist: {
      type: Array,
      default: function () {
        return []
      }
    },
    meetingObj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      inputPeople: '',
      peopleList: [],
      showPeopleList: [],
      errorImage: ' this.src=" ' + require('../assets/images/ic_default_avatar.png') + ' " ',
    }
  },
  watch: {
    visible: {
      handler(newV, oldV) {
        if (newV) {
          this.addClickListen()
        } else {
          document.removeEventListener('click', this.eventListenFunc, true)
        }
      }
    },
    stlist: {
      handler(newV, oldV) {
        if (newV && newV.length > 0) {
          if (this.peopleList && this.peopleList.length > 0) {
            let that = this
            let numList = []
            JSON.parse(JSON.stringify(newV)).forEach((item,index)=>{
              if (newV[index].identity === that.meetingObj.hostId) {
                numList.push(item.identity)
              }
              if(item.userType == '-1') {
                numList.push(item.identity)
              }
            })
            let arr = JSON.parse(JSON.stringify(newV))
            numList.forEach(item => {
              arr.forEach((item2, index2) => {
                if(item2.identity === item) {
                  arr.splice(index2, 1)
                }
              })
            })
            arr.forEach((item, index) => {
              arr[index].isSelected = false
              this.peopleList.forEach((item2, index2) => {
                if (item2.identity === item.identity) {
                  arr[index].isSelected = this.peopleList[index2].isSelected
                }
              })
            })
            this.peopleList = arr
          } else {
            let that = this
            let num = JSON.parse(JSON.stringify(newV)).reduce(function (prev, cur, index) {
              if (newV[index].identity === that.meetingObj.hostId) {
                return index
              } else {
                return prev
              }
            }, 0)
            let arr = JSON.parse(JSON.stringify(newV))
            arr.splice(num, 1)
            arr.forEach((item, index) => {
              arr[index].isSelected = false
            })
            this.peopleList = arr
          }
          this.showPeopleList = JSON.parse(JSON.stringify(this.peopleList))
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 添加监听
    addClickListen() {
      const transferHost = document.getElementById('transferHost')
      if (transferHost) {
        document.addEventListener('click', this.eventListenFunc)
        return;
      } else {
        setTimeout(() => {
          this.addClickListen()
        }, 1000)
      }
    },
    // 监听点击屏幕事件
    eventListenFunc(e) {
      const transferHost = document.getElementById('transferHost')
      const mainRightText = document.getElementsByClassName('mainRightText')[0]
      if (!(transferHost.contains(e.target) || mainRightText.contains(e.target) || e.target.innerHTML === '离开会议') && this.visible) {
        this.$emit('changeBtn')
        this.$emit('update:visible', false)
      }
    },
    // 选择移交的主持人
    selectPeople(index) {
      if (this.showPeopleList[index].userType == '-1') return;
      if (this.showPeopleList[index].isSelected) return;
      this.showPeopleList.forEach((item, index2) => {
        this.showPeopleList[index2].isSelected = false
      })
      this.peopleList.forEach((item, index2) => {
        this.peopleList[index2].isSelected = false
        if (this.peopleList[index2].identity === this.showPeopleList[index].identity) {
          this.peopleList[index2].isSelected = true
        }
      })
      this.showPeopleList[index].isSelected = true
    },
    // 确认转交
    comfirmSelected() {
      // if (this.meetingObj.isRecord) {
      //   this.$toast('请先结束录制!')
      //   return
      // }
      console.log(this.showPeopleList)
      let that = this
      let targetUserId = this.showPeopleList.reduce(function (prev, cur, index) {
        if (that.showPeopleList[index].isSelected) {
          return that.showPeopleList[index].identity
        } else {
          return prev
        }
      }, '')
      if (!targetUserId) {
        this.$toast('请先选择要转移的用户!')
        return
      }
      let data = {
        liveId: this.meetingObj.liveId,
        userId: this.meetingObj.hostId,
        targetUserId: targetUserId,
        jmeeting: '12345678901234567890123456789012'
      }
      jmeetingWebAPI.transferHost(data).then(async(res) => {
        if (res.success) {
          // this.$message['success']('屏幕共享中,无法操作')
          const strData = JSON.stringify({
            event: 'notify',
            data: {
              event: 'designateMeetingHost',
              userId: targetUserId
            },
          })
          this.$parent.isQuitGroup = false
          const data = encoder.encode(strData);
          // 给其他人发消息自己的网络状态
          await this.$room.localParticipant.publishData(data, 0)
          this.$emit('update:visible', false)
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
                  this.$emit("goBack");
                } else {
                  // 入会失败返回消息列表
                  this.$emit("goBack");
                }
              })
              .catch((err) => {
                console.log(`离开会议err`, err)
              })
          } else {
            this.$room.disconnect()
            this.$emit("goBack", 'quitMeet');
          }
        }
      })
    },
    // 搜索
    search() {
      if (this.inputPeople) {
        this.showPeopleList = this.peopleList.filter(item => item.name.indexOf(this.inputPeople) != -1)
      } else {
        this.showPeopleList = this.peopleList
      }
    },
  }
}
</script>

<style lang="less" scoped>
.trabsferHost {
  position: absolute;
  right: 20px;
  width: 192px;
  height: auto;
  max-height: 400px;
  background: #202223;
  border: 1px solid rgba(75, 76, 75, 1);
  border-radius: 8px;
  padding: 16px 16px;
  bottom: 86px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: default;

  .title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #D8D8D8;
    letter-spacing: 0;
    font-weight: 400;
    padding-left: 2px;
    margin-bottom: 16px;
  }

  .peopleList {
    .peopleBoxActive {
      width: 160px;
      height: 46px;
      background: #313233;
      border-radius: 8px;
      padding: 4px 12px 4px 4px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;

      .avatarImg {
        width: 38px;
        height: 38px;
        border-radius: 8px;
        margin-right: 8px;
        // background-color: #0078EF;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
      }

      .name {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #CFD0CF;
        letter-spacing: 0;
        font-weight: 400;
      }

      .checkIcon {
        margin-left: auto;
        color: #1677FF;
      }
    }

    .peopleBox {
      width: 160px;
      height: 46px;
      background: #202223;
      border-radius: 8px;
      padding: 4px 12px 4px 4px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;

      .avatarImg {
        width: 38px;
        height: 38px;
        border-radius: 8px;
        margin-right: 8px;
        // background-color: #0078EF;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
      }

      .name {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #CFD0CF;
        letter-spacing: 0;
        font-weight: 400;
      }

      .checkIcon {
        margin-left: auto;
        color: #1677FF;
      }
    }
    .peopleBoxOther{
      width: 160px;
      height: 46px;
      background: #202223;
      border-radius: 8px;
      padding: 4px 12px 4px 4px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .avatarImg {
        width: 38px;
        height: 38px;
        border-radius: 8px;
        margin-right: 8px;
        // background-color: #0078EF;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
      }

      .name {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #CFD0CF;
        letter-spacing: 0;
        font-weight: 400;
      }

      .checkIcon {
        margin-left: auto;
        color: #1677FF;
      }
    }
  }

  .leaveBtn {
    width: 160px;
    height: 32px;
    background: #494A49;
    border-radius: 4px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 400;
    text-align: center;
    margin: 4px 0 0 0;
    cursor: pointer;
  }
}

/deep/ .el-input__inner {
  border: 1px solid rgba(75, 76, 75, 1);
  border-radius: 4px;
  background: #202223;
  color: #6F6F6F;
  font-size: 14px;
  width: 152px;
  height: 30px;
  margin-left: 4px;
}

.el-input {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

/deep/ .el-input__icon {
  width: 12px;
  height: 12px;
  line-height: 30px;
  padding-left: 8px;
  font-size: 12px;
}

/deep/ input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #6F6F6F !important;
}

/deep/ input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #6F6F6F !important;
}

/deep/ input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #6F6F6F !important;
}

/deep/ input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #6F6F6F !important;
}
.peopleList::-webkit-scrollbar {
  width: 4px;   /* 水平滚动条宽度 */
  background-color: #202223;   /* 背景颜色 */
}
.peopleList::-webkit-scrollbar-thumb {
  border-radius: 3px;   /* 拖动按钮边角半径 */
  background-color: #888;   /* 拖动按钮颜色 */
}
</style>