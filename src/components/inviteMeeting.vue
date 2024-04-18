<template>
  <div class="inviteMeetingMain" v-if="isInvite">
    <el-dialog
      title="发起会议"
      :visible.sync="isInvite"
      width="540px"
      top="10%"
      :before-close="
        () => {
          isInvite = false;
        }
      "
    >
      <div class="bodyMain">
        <span class="theme">会议主题</span>
        <el-input
          ref="inputRef"
          spellcheck="false"
          v-model="inputValue"
          @input="inputChange"
          placeholder="请输入会议主题"
        ></el-input>
        <div class="radio">
          <el-radio
            @change="radioChange(radioChoose)"
            v-model="radioChoose"
            label="1"
            >视频会议</el-radio
          >
          <el-radio
            @change="radioChange(radioChoose)"
            v-model="radioChoose"
            label="0"
            >语音会议</el-radio
          >
        </div>
        <div class="chooseSwitch">
          <div class="column" @click="microphoneClick">
            <img
              class="pointer"
              v-if="isMicrophone"
              src="../assets/meeting/voice.png"
              alt=""
            />
            <img
              class="pointer"
              v-if="!isMicrophone"
              src="../assets/meeting/novoice.svg"
              alt=""
            />
            <span>麦克风</span>
          </div>
          <div class="column" @click="cameraClick">
            <img
              class="pointer"
              v-if="meetingSetting.cameraEnabled"
              src="../assets/meeting/video.png"
              alt=""
            />
            <img
              class="pointer"
              v-if="!meetingSetting.cameraEnabled"
              src="../assets/meeting/novideo.svg"
              alt=""
            />
            <span>摄像头</span>
          </div>
        </div>
        <button
          class="invitePerson pointer"
          @click="chooseInvite('choosePerson')"
        >
          添加参会人
        </button>
        <button
          class="intoMeeting pointer"
          @click="chooseInvite('intoMeeting')"
        >
          先进入会议
        </button>
      </div>
    </el-dialog>
    <!-- 视频会议创建会议选人 -->
    <SelectContact
      ref="meetSelectionRef"
      v-if="isSelectContact"
      :basic="basic"
      :meetingObj="userInfo"
      :liveMode="0"
      :selectType="6"
      :maxUser="meetingSetting.maxUser"
      :type="1"
      :isSelectContact.sync="isSelectContact"
      @closeSelectContact="closeSelectContact"
      :chooseMemebers="[]"
      @chooseMeetingMem="chooseMeetingMemFn(arguments)"
    >
    </SelectContact>
  </div>
</template>
<script>
import Cookies from "js-cookie";
// import { tools } from "../tools/tool";
// import SelectContact from "../components/selectContact";
import { jmeetingWebAPI } from "../services/meeting";
export default {
  name: "InviteMeeting",
  // components: { SelectContact },
  props: ["from", "groupName", "groupId"],
  data() {
    return {
      basic,
      meetingSetting: {
        maxUser: "", //会议最大人数
        cameraEnabled: false, //是否开启摄像头
      },
      inviteInfo: {}, //邀请会议信息
      fromMeeting: false,
      isInvite: false,
      radioChoose: "1", //0语音，1视频
      inputValue: "",
      isMicrophone: true,
      lastCameraSta: false, //记录视频会议上次摄像头状态
      change: false, //input是否修改过
      beta: "",
      createMeet: false,
      userInfo: {
        name: "",
        id: "",
      },
      userId: "",
      isSelectContact: false,
      publicKey:
        "04e9db7a9d78f931c74f4e538e4f928cd6cfa531563d9b2350afb2e288e77f3ce7618674889091ace46be7acdc71a1d7ac221b63d8f687e0604d0d686f752e010e", //视频会议公钥
      privateKey:
        "7fdc10c5ee985c56483ae82589b5d0723e310117e660cc4e636be7dcbde3634f", //视频会议私钥
    };
  },
  methods: {
    open(e) {
      // 单点登录时未赋值
      if (!this.userId || !this.userInfo.userName) {
        this.userId = Cookies.get("userId") || "";
        this.userInfo = {
          userName: Cookies.get("userName") || "",
          userId: Cookies.get("userId") || "",
        };
      }
      //
      this.isInvite = true;
      this.radioChoose = "1"; //数据重置
      this.inputValue = this.userInfo.userName + "发起的视频会议";
      this.isMicrophone = true;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },
    chooseMeetingMemFn(data) {
      this.inviteInfo.friendIds = data[0];
      this.inviteInfo.groupIds = data[1];
      this.createVideoConferencing();
    },
    inputChange() {
      this.change = true;
      this.inputValue =
        this.inputValue.length > 30
          ? this.inputValue.slice(0, 30)
          : this.inputValue;
    },
    radioChange(data) {
      this.meetingSetting.cameraEnabled = data == 0 ? false : this.lastCameraSta;
      if (!this.change) {
        this.inputValue =
          data == 1
            ? this.userInfo.userName + "发起的视频会议"
            : this.userInfo.userName + "发起的语音会议";
      }
    },
    microphoneClick() {
      this.isMicrophone = !this.isMicrophone;
    },
    cameraClick() {
      if (this.radioChoose == 0) {
        return;
      }
      this.meetingSetting.cameraEnabled = !this.meetingSetting.cameraEnabled;
      //如果当前是视频会议 记录当前摄像头状态
      this.lastCameraSta = this.meetingSetting.cameraEnabled;
    },
    chooseInvite(type) {
      this.inviteInfo = {
        //type 添加参会 直接加入
        liveName: this.inputValue,
        liveSponsorId: this.userInfo.userId,
        liveSponsorName: this.userInfo.userName,
        liveType: this.radioChoose,
        isMicrophone: this.isMicrophone,
        cameraEnabled: this.meetingSetting.cameraEnabled,
        type: type,
      };
      if (type == "choosePerson") {
        //添加参会人
        // this.getMaxUser();
        //从群内发起视频会议
        this.isSelectContact = true;
      } else if (type == "intoMeeting") {
        //进入会议
        this.createVideoConferencing();
      }
    },
    //创建会议
    createVideoConferencing() {
      if (this.createMeet) {
        return;
      }
      this.createMeet = true;
      setTimeout(() => {
        this.createMeet = false;
      }, 1000);
      this.isInvite = false;
      this.inviteInfo.friendIds =
        this.inviteInfo.type == "choosePerson" ? this.inviteInfo.friendIds : [];
      this.inviteInfo.friendIds.push(this.userId);
      let data = {
        friendIds: this.inviteInfo.friendIds, //会话好友ids
        groupIds: this.inviteInfo.groupIds,
        liveName: this.inviteInfo.liveName, //会议名称
        liveSponsorId: this.inviteInfo.liveSponsorId, //发起人id
        liveSponsorName: this.inviteInfo.liveSponsorName, //发起人姓名
        liveType: this.inviteInfo.liveType, //0语音，1视频
        clientType: 3, //1安卓 2ios 3web
        audioOpen: this.inviteInfo.isMicrophone, //麦克风
        videoOpen: this.inviteInfo.cameraEnabled, //摄像头
        liveCreatorId: this.inviteInfo.liveSponsorId,
        liveCreatorName: this.inviteInfo.liveSponsorName,
      };
      console.log(data);
      jmeetingWebAPI
        .createVideoConferencing({ jmeeting: this.userId }, data)
        .then((res) => {
          if (res.success) {
            let data = {};
            data = res.data;
            let userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("electron") > -1) {
              let url = `${location.pathname}#/index?liveId=${data.webrtcCallLink.roomId}&userId=${this.userInfo.userId}&audioOpen=${this.inviteInfo.isMicrophone}&videoOpen=${this.inviteInfo.cameraEnabled}`;
              // window.electron.openMeeting(url)
              if (window.electron) {
                window.electron.openMeeting(url);
              } else {
                window.open(url);
              }
            } else {
              this.$router.push({
                name: "index",
                query: {
                  videoOpen: this.inviteInfo.cameraEnabled,
                  audioOpen: this.inviteInfo.isMicrophone,
                  liveId: data.webrtcCallLink.roomId,
                  userId: this.userInfo.userId,
                },
              });
            }
          } else {
            this.$toast(res.message);
          }
        })
        .catch((err) => console.log(err));
    },
    closeSelectContact() {
      this.isSelectContact = false;
    },
  },
};
</script>
<style lang="less" scoped>
.inviteMeetingMain {
  ::v-deep .el-dialog {
    border-radius: 10px;
    // transform:translateY(-50%)
  }

  ::v-deep .el-dialog__header {
    display: flex;
    padding: 14px 30px;
    align-items: center;
    background: #f5f6f8;
    border-radius: 10px 10px 0 0;
  }

  ::v-deep .el-dialog__title {
    font-size: 16px;
    color: #000;
    line-height: 22px;
    font-weight: 500;
  }

  ::v-deep .el-dialog__headerbtn {
    top: auto !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0;
    display: flex;
  }
}

.bodyMain {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 40px;

  .theme {
    width: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    font-size: 18px;
  }

  ::v-deep .el-input {
    margin: 12px 0 20px;
    background: #fff;
  }

  ::v-deep .el-input__inner {
    font-size: 24px;
    line-height: 33px;
    color: #333333;
    background: none;
    text-align: center;
    font-weight: 500;
    padding: none;
    border: 0;
  }

  .title {
    font-size: 24px;
    line-height: 33px;
    color: #333333;
    font-weight: 500;
    margin: 12px 0 20px;
  }

  ::v-deep .el-radio__label {
    font-size: 14px;
    color: #666666;
    line-height: 22px;
    font-weight: 400;
  }

  ::v-deep .el-radio__inner {
    width: 16px;
    height: 16px;
  }

  .chooseSwitch {
    display: flex;
    margin: 56px 0 24px;

    .column:nth-of-type(1) {
      margin-right: 30px;
    }

    .column {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 24px;
        height: 24px;
        margin-bottom: 8px;
      }

      span {
        font-size: 14px;
        color: #999999;
      }
    }
  }

  .invitePerson,
  .intoMeeting {
    font-size: 14px;
    line-height: 22px;
  }

  .invitePerson {
    background: #1890ff;
    border-radius: 4px;
    color: #fff;
    padding: 5px 25px;
    margin-bottom: 12px;
  }

  .intoMeeting {
    color: #333;
  }
}
</style>
