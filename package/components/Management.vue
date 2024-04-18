<template>
  <div class="managementMain">
    <div class="member">
      <div class="title">成员管理({{ meetingObj.allUserList.length }})</div>
      <div class="mb24">
        <!-- <el-input placeholder="搜索成员" v-model="inputPeople" @keyup.enter.native="search">
        </el-input> -->
        <el-input placeholder="搜索成员" prefix-icon="el-icon-search" v-model="inputPeople" @keyup.enter.native="search">
        </el-input>
      </div>
      <div class="initMeeting" v-show="!searched" @click="showMemberlist = !showMemberlist">
        <van-icon v-show="showMemberlist" name="arrow-down" />
        <van-icon v-show="!showMemberlist" name="arrow" />
        已入会({{ stlistSearchArr.length }})
      </div>
      <div class="memberlist" v-show="showMemberlist">
        <div class="memberItem" v-for="item in stlistSearchArr" :key="item.sid">
          <div class="ItemLeft">
            <div class="ItemImgName" v-if="meetingObj.liveMode == -1 || (item.userType && item.userType !== 0)">
              {{ item.name.substring(item.name.length - 2) }}</div>
            <img class="ItemImg" v-else :src="item.icon ? item.icon : '../assets/images/ic_default_avatar.png'"
              :onerror="errorImage" alt />
            <div class="ItemNameBox">
              <!-- item.identity == userId ? '我' : item.name -->
              <span class="ItemName">{{ item.name }}</span>
              <p style="margin-bottom: 0;">
                <span class="ItemHost" v-if="item.identity == meetingObj.hostId">主持人</span>
                <span class="ItemHost" v-if="item.identity == meetingObj.mainWindowUserid">主画面</span>
                <span class="ItemHost ItemHostGreen" v-if="item.identity == meetingObj.isScreenShare[2]">共享中</span>
              </p>
            </div>
            <div></div>
          </div>
          <div class="ItemRight">
            <img class="itemQxjy" @click="jy(item)" v-if="item.audioOpen == true" src="../assets/bottomOpera/jy.png"
              alt />
            <img class="itemQxjy" v-if="item.audioOpen == false || !item.audioOpen" src="../assets/bottomOpera/qxjy.png"
              alt />
            <!-- 置顶操作 主持人展示   -->
            <div v-if="meetingObj.isShowControlls">
            <el-popover trigger="hover" v-if="ishow" popper-class="elpopperWid" placement="bottom" width="130px"
              v-model="item.visible">
              <!-- <p>置顶</p> -->
              <!-- <p>取消置顶</p> -->
              <p v-if="meetingObj.mainWindowUserid != item.identity" class="popoverText" @click="topping(item, false)">全员看TA</p>
              <p v-if="meetingObj.mainWindowUserid == item.identity" class="popoverText" @click="canceTopping(item, true)">取消全员看TA
              </p>
              <img slot="reference" class="operate" src="../assets/bottomOpera/other.png" alt="" />
            </el-popover>
            </div>
          </div>
        </div>
      </div>
      <!-- 外部会议不展示未入会成员 混合会议不展示未入会外部成员 -->
      <div class="initMeeting" v-if="meetingObj.liveMode !== -1 && !searched" @click="showInitMeeting = !showInitMeeting">
        <van-icon name="arrow-down" v-show="showInitMeeting" />
        <van-icon name="arrow" v-show="!showInitMeeting" />
        未入会({{ unOnlineSearchArr && unOnlineSearchArr.length ? unOnlineSearchArr.length : 0}})
      </div>
      <div class="memberlist" v-if="meetingObj.liveMode !== -1 && showInitMeeting">
        <div class="memberItem" v-for="item in unOnlineSearchArr" :key="item.id">
          <div class="ItemLeft">
            <div class="ItemImgName" v-if="meetingObj.liveMode == -1 || (item.userType && item.userType !== 0)">
              {{ item.remark.substring(item.remark.length - 2) }}</div>
            <img class="ItemImg" v-else :src="item.icon ? item.icon : '../assets/images/ic_default_avatar.png'"
              :onerror="errorImage" alt />
            <div class="ItemNameBox">
              <span class="ItemName">{{ item.identity == meetingObj.userId ? '我' : item.remark }}</span>
              <span class="ItemHost" v-if="item.id == meetingObj.hostId">主持人</span>
            </div>
          </div>
          <img class="recall" @click.stop="reCall(item)" v-if="!item.userType || item.userType == 0"
            src="../assets/bottomOpera/reCall.png" alt="" />
        </div>
      </div>
      <div class="bottom">
        <span v-if="meetingObj.isAllowInvite" class="bottomYq" @click="selectContactFn">邀请</span>
        <span class="bottomJq" v-if="meetingObj.Initiator == '1'" @click="allMute">全员静音</span>
      </div>
    </div>
    <!-- 呼叫弹窗 -->
    <reCall ref="reCallRef" :liveId="meetingObj.liveId" :userId="meetingObj.userId"></reCall>
  </div>
</template>
<script>
import { jmeetingWebAPI } from '../services/jmeeting'
// import { Modal } from 'ant-design-vue'
// import QuitMeet from '../components/closeMeeting'
// import SelectContact from '../components/selectContact'
import reCall from './reCall'
// import imMethods from '../tools/imMethods'
const { RoomEvent, Room, RemoteParticipant } = require('livekit-client')
// const decoder = new TextDecoder()
const encoder = new TextEncoder()
export default {
  name: 'Management',
  components: {
    reCall,
  },
  props: ['localParticipant', 'stlist', 'isSharing', 'meetingObj'],
  data() {
    return {
      // timeout:null,//刷新成员列表
      // unOnline:[],//未入会成员列表
      // allUserList:[],//会议全部成员
      inputPeople: "",
      stlistArr: [],
      stlistSearchArr: [],//已入会搜索列表
      unOnlineSearchArr: [],//未入会搜索列表
      ishow: false,
      searched: false,//搜索中
      showMemberlist: true,
      showInitMeeting: true,
      errorImage:
        ' this.src=" ' + require('../assets/images/ic_default_avatar.png') + ' " ',
    }
  },
  methods: {
    // 搜索
    search() {
      if (this.inputPeople) {
        this.stlistSearchArr = this.stlistArr.filter(item => item.name.indexOf(this.inputPeople) != -1)
        this.unOnlineSearchArr = this.meetingObj.unOnline.filter(item => item.remark.indexOf(this.inputPeople) != -1)
        this.searched = true;
      } else {
        this.stlistSearchArr = this.stlistArr;
        this.unOnlineSearchArr = this.meetingObj.unOnline;
        this.searched = false;
      }
    },
    DataReceived(payload, publication, kind) {
      // console.log('DataReceived--接收消息', decoder.decode(payload));
      // let receivedData= JSON.parse(decoder.decode(payload)).data;
      // //invite 邀请人员
      // if(receivedData.event =='invite' && receivedData.liveId == this.liveId){
      //   this.getMeetingUsers();
      // }
    },
    async ininRoom() {
      //接受消息
      this.$room.on(RoomEvent.DataReceived, this.DataReceived);
    },
    //禁言某人 主持人可以禁言其她人 其余只支持自己
    jy(item) {
      if (item.identity == this.meetingObj.userId) {
        this.$busMeeting.$emit('btn_mute');
      }
      if (this.meetingObj.Initiator !== 1) {
        return
      }
      const strData = JSON.stringify({
        event: 'notify',
        data: {
          event: 'mute',
          userId: item.identity,
          liveId: this.meetingObj.liveId
        },
      })
      const data = encoder.encode(strData);
      this.localParticipant.publishData(data, 0);
    },
    // 重新呼叫 弹出
    reCall(item) {
      if (item.state != 0 && item.state != 6 && item.state != 1) {
        if (item.userId != this.meetingObj.userId) {
          this.$refs.reCallRef.open(item);
        }
      }
    },
    //邀请
    selectContactFn() {
      this.$busMeeting.$emit('selectContactFn');
      // this.$parent.selectContactFn()
    },
    //全员静音
    allMute() {
      let arr = []
      for (let i = 0; i < this.stlistSearchArr.length; i++) {
        arr.push(this.stlistSearchArr[i].sid)
      }
      const strData = JSON.stringify({
        event: 'notify',
        data: {
          event: 'muteAll',
          userId: this.meetingObj.userId,
          liveId: this.meetingObj.liveId
        }
      })
      const data = encoder.encode(strData);
      this.localParticipant.publishData(data, 0, arr);
    },
    // 如果是主持人全局展示其他操作
    addVisible() {
      this.stlistArr = this.stlist;
      this.unOnlineSearchArr = this.meetingObj.unOnline;
      if (this.meetingObj.userId == this.meetingObj.hostId) {
        this.ishow = true;
      }
      for (let i = 0, len = this.stlistArr.length; i < len; i++) {
        this.stlistArr[i].visible = false;
      }
      this.stlistSearchArr = this.stlistArr;
    },
    // 设置房间 置顶/全部看TA
    topping(item, type) {
      jmeetingWebAPI
        .topping({
          jmeeting: '12345678901234567890123456789012',
        }, {
          mainWindow: item.identity,//主窗口用户id
          roomTop: [],//置顶用户id
          liveId: this.meetingObj.liveId,//房间id
          userId: this.meetingObj.userId,//用户id
          cancel: type,
        })
        .then((res) => {
          if (res.success) {
            const strData = JSON.stringify({
              event: 'notify',
              data: {
                event: 'setMainWindow',
                mainWindowidentity: item.identity
              },
            })
            const data = encoder.encode(strData);
            // 给其他人发消息全部看TA
            this.$room.localParticipant.publishData(data, 0);
            this.meetingObj.mainWindowUserid = item.identity
            // 给自己切换看TA
            for (let i = 0, len = this.stlist.length; i < len; i++) {
              if (this.stlist[i].identity == item.identity) {
                this.$busMeeting.$emit('selectVideo', this.stlist[i])
              }
            }
            // 
          } else {
            this.$message.error(res.message);
          }
        })
    },
    // 取消置顶
    canceTopping(item, type) {
      jmeetingWebAPI
        .topping({
          jmeeting: this.meetingObj.userId,
        }, {
          mainWindow: item.identity,//主窗口用户id
          roomTop: [],//置顶用户id
          liveId: this.meetingObj.liveId,//房间id
          userId: this.meetingObj.userId,//用户id
          cancel: type,//设置为主屏幕为true 取消为false
        }).then(res => {
          if (res.success) {
            const strData = JSON.stringify({
              event: 'notify',
              data: {
                event: 'canceSetMainWindow',
                mainWindowidentity: ""
              },
            })
            const data = encoder.encode(strData);
            this.$room.localParticipant.publishData(data, 0);
            this.meetingObj.mainWindowUserid = ""
            // 给自己切换共享屏幕
            if (this.isScreenShare[0]) {
              for (let i = 0, len = this.stlist.length; i < len; i++) {
                if (this.stlist[i].identity == this.meetingObj.isScreenShare[2]) {
                  this.$busMeeting.$emit('selectVideo', this.stlist[i])
                }
              }
            }
          } else {
            // alert(res.message)
            this.$message.error(res.message);
          }
        })
    }
  },
  created() {
    this.addVisible()
  },
  mounted() {
  }
}
</script>
<style lang='less' scoped>
.managementMain {
  width: 250px;
}

.member {
  background: #111213;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 15px;
  height: 100%;
  padding-top: 16px;
  // border-left: 1px solid #f5f5f5;
  padding-bottom: 100px;
  overflow-y: scroll;
}

.title {
  font-family: PingFangSC-Semibold, Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 16px;
  color: #B5B5B4;
  letter-spacing: 0;
  text-align: left;
  line-height: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.mb24 {
  margin-bottom: 16px;

  ::v-deep .el-input__inner {
    line-height: 28px;
    height: 28px;
  }

  ::v-deep .el-input__icon {
    line-height: 28px;
  }
}

.initMeeting {
  color: #D0D0D0;
}

.memberlist {
  margin-top: 12px;
  overflow: scroll;
}

.memberlist_item_qxjy3 {
  width: 16px;
  height: 16px;
  position: absolute;
  top: -16px;
  left: 38%;
}

.memberlist_item_qxjy2 {
  width: 16px;
  height: 16px;
  margin-left: 4px;
}

.memberlist_item_left2 {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.ItemLeft {
  display: flex;
  align-items: center;
  // margin-bottom: 24px;
}

.memberItem {
  display: flex;
  justify-content: space-between;
  // display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.memberlist_item2:nth-of-type(1) {
  margin-left: 0;
}

.memberlist_item2 {
  display: flex;
  justify-content: space-between;
  // display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-direction: column;
  width: 70px;
  margin-left: 80px;
}

.ItemRight {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 42px;
}

.operate {
  // margin-left: 12px;
  width: 24px;
  height: 24px;
}

.popoverText {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #D1D2D2;
  letter-spacing: 0.57px;
  font-weight: 500;
  margin: auto 0;
  &:hover {
    cursor: pointer;
  }
}

.itemQxjy {
  width: 24px;
  height: 24px;
}

.ItemHost {
  display: inline-block;
  width: 40px;
  height: 16px;
  line-height: 16px;
  border: 0.67px solid rgba(22, 119, 255, 1);
  border-radius: 2.67px;
  font-family: PingFangSC-Regular, Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 12px;
  color: #1890ff;
  text-align: center;
  font-weight: 400;
  margin-left: 8px;
}
.ItemHostGreen {
  border: 0.67px solid rgba(6, 176, 67, 0.4);
  border-radius: 2.67px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #06B043;
  text-align: center;
  line-height: 14px;
  font-weight: 400;
}
.ItemNameBox {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // width: 80px;
  display: flex;
  flex-direction: column;
}

.ItemName {
  font-family: PingFangSC-Regular, Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #CFD0CF;
  letter-spacing: 0;
  font-weight: 400;
  margin-left: 8px;
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ItemImg {
  width: 42px;
  height: 42px;
  border-radius: 8px;
}

.ItemImgName {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  line-height: 42px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  background: #0078EF;
}

.memberlist_item_name_state {
  width: 44px;
  border: 0.67px solid rgba(153, 153, 153, 1);
  border-radius: 2.67px;
  font-family: PingFangSC-Regular, Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 12px;
  color: #999999;
  text-align: center;
  font-weight: 400;
}

.bottom {
  position: absolute;
  z-index: 98;
  // width: 86%;
  width: 220px;
  height: 70px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #111213;
  cursor: pointer
}

.bottomJq {
  background: #484949;
  // border: 1px solid rgba(221, 221, 221, 1);
  border-radius: 4px;
  padding: 5px 16px;
  text-align: center;
  // margin-left: 16px;
  color: #FFFFFF;
  cursor: pointer;
}

.bottomYq {
  background: #484949;
  color: #FFFFFF;
  // border: 1px solid rgba(221, 221, 221, 1);
  border-radius: 4px;
  padding: 5px 16px;
  text-align: center;
  // margin-left: 22px;
}

/deep/ .el-input__inner {
  border: 1px solid rgba(36, 40, 42, 1);
  border-radius: 4px;
  background: #111213;
  color: #6F6F6F;
  font-size: 14px;
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

.recall {
  width: 24px;
  height: 24px;
}
</style>