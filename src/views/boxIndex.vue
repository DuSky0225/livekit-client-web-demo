<template>
  <div class='clearfix' @click="hiddenDraw()">
    <JmeetingHeader ref="headerRef" :jmeetingHeader="jmeetingHeader" :user="{ img, userName }"></JmeetingHeader>
    <div class="main">
      <div class="leftSection"
        :class="jmeetingHeader == 'false' ? 'iMHeaderHeight' : $basic.homepageHeader ? 'hasHeaderHeight' : 'noHeaderHeight'">
        <div class="partBox">
          <div class="part" v-for="(item, i) in partList" :key="i" @click="openPart(item)">
            <img class="pointer" :src="item.img" alt="">
            <span>{{ item.title }}</span>
          </div>
        </div>
      </div>
      <div class="rightSection" ref="rightSectionRef"
        :class="jmeetingHeader == 'false' ? 'iMHeaderHeight' : $basic.homepageHeader ? 'hasHeaderHeight' : 'noHeaderHeight'">
        <div class="metting" ref="mettingRef">
          <h3>{{ date.getMonth() + 1 }}月{{ date.getDate() }}日 <span>今日</span></h3>
          <div class="meetingListBorder" v-if="meetingList.length">
            <div class="meetingList" v-for="item in meetingList" :key="item.liveId">
              <div class="meetingListInfo">
                <img class="meetingIcon" src="../assets/meeting/inmeetLogo.png" alt="">
                <div class="meetingListName">
                  <div class="meetingName">{{ item.liveName }}</div>
                  <div class="meetingNums">
                    <img src="../assets/meeting/inmeet.jpg" alt="">
                    <span>{{ item.livingNums }}人在会议中</span>
                  </div>
                </div>
              </div>
              <div class="meetingBtn pointer" @click="liveIdClick(item)">入会</div>
            </div>
          </div>
          <p v-else>暂无会议</p>
        </div>
        <div class="historyMeet">
          <!-- <h3>历史会议</h3> -->
          <div class="historyMeetKind">
            <span class="pointer" :class="kind == 1 ? 'activeSpan' : ''" @click="kind = 1">会议</span>
            <span class="pointer" :class="kind == 2 ? 'activeSpan' : ''" @click="kind = 2">通话</span>
          </div>
          <div class="list" v-show="kind == 1" v-infinite-scroll="load" infinite-scroll-disabled="loading"
            :style="{ height: height }">
            <div class="line pointer" :class="liveIdSelected == item.liveId ? 'active' : ''" v-for="item in list"
              :key="item.liveId" @click="getUserHistoryMeetingDetails(item.liveId)">
              <img class="iconLeft" v-if="item.userLiveState == 0" src="../assets/meeting/noresponse.png" alt="">
              <img class="iconLeft" v-else src="../assets/meeting/response.png" alt="">
              <div class="info">
                <h3>{{ item.liveName }}</h3>
                <p>
                  <span class="wxy">{{ item.userLiveState == 0 ? '未响应' : "" }} </span>
                  <span v-if="item.userLiveState != 0">{{ tools.formatTime(new Date(item.joinTime)).typeSeven }}</span>
                  <span v-if="item.userLiveState == 0">参会人数：{{ item.joinNum }}人</span>
                  <span v-if="item.userLiveState != 0">&nbsp;&nbsp;|&nbsp;&nbsp;{{ item.joinNum }}人</span>
                </p>
              </div>
            </div>
          </div>
          <div class="list" v-show="kind == 2" v-infinite-scroll="getSingleChatHistory"
            infinite-scroll-disabled="loadingChat" :style="{ height: height }">
            <div class="line pointer" v-for="(item, i) in listChat" :key="i">
              <img class="iconLeft" :src="item.memberIcon || '../assets/ic_default_avatar.png'" :onerror="errorImage"
                alt="">
              <div class="btween">
                <div class="info">
                  <h3>{{ item.memberName }}<span v-if="item.num && item.num != 1">({{ item.num }})</span></h3>
                  <p>
                    <span v-if="item.userLiveState == 0" style="color: #FF6010;">未接通 </span>
                    <span> [{{ item.liveType == 11 ? "语音" : "视频" }}] </span>
                    <span>{{ tools.timeChange(item.meetingDate) }}</span>
                  </p>
                </div>
                <div class="info flex">
                  <a-tooltip>
                    <template slot="title">语音通话</template>
                    <div class="iconBox audioIcon" @click="checkLeaderMode(item, 'singleClick')"><span
                        class="audioIconBg"></span>
                    </div>
                  </a-tooltip>
                  <a-tooltip>

                    <template slot="title">视频会议</template>
                    <div class="iconBox videoIcon" @click="checkLeaderMode(item, 'jmeetingClick')"><span
                        class="videoIconBg"></span>
                    </div>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer :with-header="false" :modal="false" :visible.sync="drawer" :direction="direction">
      <div class="drawerTitle">
        <p>
          <span></span>
          历史会议详情
        </p>
        <i class="el-icon-close closeIcon pointer" @click="drawer = false"></i>
      </div>
      <div class="drawerInfo">
        <div class="">
          <div class="infoItem">
            <span>会议主题</span>
            <p>{{ liveInfo.liveName }}</p>
          </div>
          <div class="infoItem">
            <span>开始时间</span>
            <p>{{ liveInfo.ctimeStr }}</p>
          </div>
          <div class="infoItem">
            <span>结束时间</span>
            <p>{{ liveInfo.closeTimeStr }}</p>
          </div>
          <div class="infoItem">
            <span>会议时长</span>
            <p>{{ liveInfo.meetingDuration }}</p>
          </div>
          <div class="infoItem">
            <span>发起人</span>
            <p>{{ liveInfo.liveCreatorName || liveInfo.liveSponsorName }}</p>
          </div>
        </div>
        <div class="memberInfo">
          <h3>参会人员</h3>
          <div class="memberList">
            <div class="memberIcon" v-for="(item) in liveInfo.remarkList" :key="item.id">
              <img :src="item.icon ? item.icon : '../assets/ic_default_avatar.png'" :onerror="errorImage" alt="" />
              <span>{{ item.remark }}</span>
            </div>
          </div>
        </div>
        <div class="memberInfo" v-if="liveInfo.playbackId">
          <h3>录制文件</h3>
          <div class="recordingFilesBox pointer" @click="jumpDetails(liveInfo)">
            <img src="../assets/meeting/response.png" alt="">
            <div class="center">
              <h4>{{ liveInfo.playBackName }}</h4>
              <span>{{ liveInfo.recordingInterval }} {{ liveInfo.recordingDuration }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <InviteMeeting ref="inviteMeetingRef"></InviteMeeting>
    <!-- <AvatarModal ref="modal" @uploadSuccess="uploadSuccess"></AvatarModal> -->
    <meetToast ref="meetToastRef"></meetToast>
    <el-dialog title="发起会议" class="isChangeMeetSystemCss" :visible.sync="isChangeMeetSystem" width="440px">
      <div class="tipText">当前账号有其他设备正在会议中，是否切换到本地设备</div>
      <div class="btnBox">
        <button class="dismissBtn" @click="jumpMeeting(obj)">切换</button>
        <button class="cancelBtn" @click="isChangeMeetSystem = false">
          取消
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InviteMeeting from "../components/inviteMeeting.vue";
import JmeetingHeader from "../components/JmeetingHeader.vue";
import meetToast from "../components/meetToast.vue";
import { imHeader } from "../mixins/index";
import { accountAPI } from '../api/account/account';
import { jmeetingWebAPI } from '../services/jmeeting';
import { jmeetingWebAPI as jmeetingAPI } from "../services/meeting";
import { tools } from "../tools/tool";
import imMethods from '../tools/imMethods'
import QueryWebSocket from "../tools/websocket";
import Cookies from 'js-cookie'
import Modal from "ant-design-vue/es/modal";
export default {
  components: {
    InviteMeeting,
    JmeetingHeader,
    meetToast
  },
  mixins: [imHeader],
  data() {
    return {
      userAgent: navigator.userAgent.toLowerCase(),
      tools,
      img: "",//用户头像？
      userId: "",
      userName: "",
      mobile: "",
      date: new Date(),
      partList: [
        {
          img: require("../assets/meeting/fqhy.png"),
          title: "发起会议",
          type: '1'
        },
        {
          img: require("../assets/meeting/live.png"),
          title: "直播",
          type: '4'
        },
        {
          img: require("../assets/meeting/shanhui.png"),
          title: "闪会",
          type: '7'
        },
        {
          img: require("../assets/meeting/hyjy.png"),
          title: "会议纪要",
          type: '6'
        },
        {
          img: require("../assets/meeting/jrhy.png"),
          title: "加入会议",
          type: '2'
        },
        {
          img: require("../assets/meeting/yyhy.png"),
          title: "预约会议",
          type: '3'
        },
        // {
        //   img: require("../assets/meeting/hylz.png"),
        //   title: "会议录制",
        //   type: '5'
        // },
      ],
      kind: 1,
      height: "600px",
      list: [],
      drawer: false,
      direction: 'rtl',
      loading: true,
      pageNo: 1,
      listChat: [],
      pageNoChat: 1,
      loadingChat: true,
      liveInfo: {},
      liveIdSelected: "",//当前历史会议详情liveId
      isShowUserOperate: false,
      meetingList: [],
      isChangeMeetSystem: false,
      errorImage:
        ' this.src=" ' + require('../assets/ic_default_avatar.png') + ' " ',
      obj: {},
      electron: false,//是否处于盒子内
      jmeetingHeader: 'true',//区分微联叮·会议还是内网，去除头部
      screenHeight: null,
    };
  },
  watch: {
    // 监听数组长度变化 使高度自适应
    meetingList(newVal, oldVal) {
      this.$nextTick(() => {
        let zHeight = this.$refs.rightSectionRef.offsetHeight;
        let nHeight = this.$refs.mettingRef.offsetHeight;
        this.height = (zHeight - nHeight - 75) + 'px';
      })
    },
    screenHeight(newVal, oldVal) {
      this.$nextTick(() => {
        let zHeight = this.$refs.rightSectionRef.offsetHeight;
        let nHeight = this.$refs.mettingRef.offsetHeight;
        this.height = (zHeight - nHeight - 75) + 'px';
      })
    },
    userId(newVal, oldVal) {
      if (newVal) {
        this.loading = false;
        this.loadingChat = false;
        // 任务管理跳转展示详情
        let liveIdSelected = imMethods.getUrlParams('liveIdSelected')
        if(liveIdSelected){
          this.getUserHistoryMeetingDetails(liveIdSelected)
        }
      }
    }
  },
  created() {
    let accessToken = Cookies.get('access-token')
    this.$ls.set('ACCESS_TOKEN', accessToken)
    // 判断需不需要内网导航
    let jmeetingHeader = imMethods.getUrlParams('jmeetingHeader') || sessionStorage.getItem('jmeetingHeader');
    if (jmeetingHeader == 'false') {
      this.jmeetingHeader = 'false';
      sessionStorage.setItem('jmeetingHeader', false)
    } else {
      this.jmeetingHeader = 'true';
      sessionStorage.setItem('jmeetingHeader', true)
    }
    // 判断是否为单点登录
    let sign = imMethods.getUrlParams('sign') || sessionStorage.getItem('jmeetingSign');
    if (sign == 'work') {
      sessionStorage.setItem('jmeetingSign', 'work')
      this.getUcenterInfo()
    } else {
      sessionStorage.setItem('jmeetingSign', 'jmeeting')
      this.userId = Cookies.get('userId')
      this.$store.commit('changeUserId', this.userId);
      this.initData();
    }
    // 校验登录
    if (!accessToken) {
      let sign = sessionStorage.getItem('jmeetingSign');
      if (sign == 'work') {
        this.$ref.headerRef.backHome()
      } else {
        this.$router.push({
          name: "boxLogin"
        })
      }
      return
    }
    // 判断是否在盒子
    let userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('electron') > -1) {
      this.electron = true;
    }
  },
  beforeDestroy() {
    if (this.webSocket.config.isClose) {
      this.webSocket.reset()
    }
  },
  mounted() {
    // 当盒子被缩放时列表高度自动变化
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        this.screenHeight = document.body.clientHeight
      })()
    }
    // 3.监听接受视频 / 语音会议  拒绝
    // 1-视频接听 2-拒绝 3-语音接听
    window.addEventListener(
      'electronAccept',
      (options) => {
        console.log('electronAccept','electronAccept');
        let data = options['detail'];
        console.log("监听接受视频 / 语音会议  拒绝", data);
        if (data.type == 1) {
          data.videoOpen = true;
          this.jumpMeeting(data)
        } else if (data.type == 3) {
          data.audioOpen = false;
          this.jumpMeeting(data)
        } else {
          this.refuseMeeting(data.liveId)
        }
      },
      false
    );
    // 断线重连后
    window.addEventListener("online", () => {
      console.log('online，断线重连');
      this.createWebSocket()
      this.getyTodayMeeting()
    });
  },
  methods: {
    initData() {
      this.createWebSocket()
      this.getInfo()
      this.getyTodayMeeting()
    },
    openPart(obj) {
      // 创建会议
      if (obj.type == '1') {
        if (!basic.allowBrowserMeeting && !this.electron) {
          this.$refs.meetToastRef.open()
        } else {
          this.getMeetingSetting()
        }
      } else if (obj.type == '4') {
        let jmeetingHeader = sessionStorage.getItem('jmeetingHeader');
        if (jmeetingHeader == 'false') {
          // location.href = `/jlearn-live/index`
          window.open(`/jlearn-live/index`)
        } else {
          // location.href = `/jlearn-live/index?type=jmeeting`
          window.open(`/jlearn-live/index?type=jmeeting`)
        }
      } else if (obj.type == '6') {
        const { href } = this.$router.resolve({
          name: "playbackList",
        });
        window.open(href, '_blank');
      } else if (obj.type == '7') {
        if (!basic.allowBrowserMeeting && !this.electron) {
          this.$refs.meetToastRef.open()
        } else {
          const { href } = this.$router.resolve({
            name: "historyMeet",
            query: {
              phoneNumber: this.mobile,
              userName: this.userName
            }
          });
          window.open(href, '_blank');
        }
      } else {
        Modal.warning({
          title: '提示',
          content: '即将上线，敬请期待！',
          okText: '确定'
        })
      }
    },
    // 创建webSocket
    createWebSocket() {
      this.webSocket = new QueryWebSocket({
        url: `wss://${window.location.host}/jms-websocket/ws/notice/${this.userId}`,
        // url: `wss://workin.hanweb.com/jms-websocket/ws/notice/${this.userId}`,
        // createSuccess: () => { },
        queryData: (res) => {
          console.log(res);
          // jms推送新消息时刷新正在进行的会议
          this.getyTodayMeeting();
          let arr = res.data.messageBodies.A02_02;
          let data = arr.filter(function (item) {
            return item.businessType == "jmeeting";
          })
          let { type, hostUser } = data[0].extra;
          console.log(type, hostUser);
          // //type=0邀请通知，1 ：入会通知，2：离会通知，3：会议关闭通知，4：成员麦克风,摄像头变动通知，5：全员静音 8: 其他端拒绝会议
          if (type == 0 && hostUser.id != this.userId || type == 1 || type == 3 || type == 8) {
            if (this.electron) {
              window.electron.handleWs(data[0].extra)
            }
          }
        },
      })
    },
    getMeetingSetting() {
      jmeetingWebAPI
        .meetingSetting({
          jmeeting: "12345678901234567890123456789012",
          // myId: this.userId,
        })
        .then((res) => {
          if (!!res.data.meetingSetting) {
            // console.log(res.data.meetingSetting);
            let { cameraEnabled, maxUser } = res.data.meetingSetting;
            this.$refs.inviteMeetingRef.meetingSetting.cameraEnabled = cameraEnabled || false;
            this.$refs.inviteMeetingRef.lastCameraSta = cameraEnabled || false;
            this.$refs.inviteMeetingRef.meetingSetting.maxUser = maxUser;
            this.$refs.inviteMeetingRef.open()
          }
        })
        .catch((err) => console.log(err));
    },
    // 会议是否结束以及是否和其他端冲突
    liveIdClick(item) {
      if (!basic.allowBrowserMeeting && !this.electron) {
        this.$refs.meetToastRef.open()
      } else {
        let paramas = {
          myId: this.userId,
          jmeeting: this.userId,
          liveId: item.liveId,
          clientType: 3,//3:pc
        }
        jmeetingAPI.clientIsConflict(paramas)
          .then((res) => {
            console.log(res);
            if (res.success) {
              if (res.data.isClosed) {
                this.$toast("会议已结束，无法进入")
                return
              }
              // 已在其他设备接听
              if (res.data.isConflict) {
                this.isChangeMeetSystem = true;
                this.obj = item;
                return
              }
              if (!res.data.isClosed && !res.data.isConflict) {
                this.jumpMeeting(item)
              }
            }
          })
      }
    },
    jumpMeeting(item) {
      this.isChangeMeetSystem = false;
      if (this.electron) {
        let url = `${location.pathname}#/index?liveId=${item.liveId}&userId=${this.userId}&audioOpen=${item.audioOpen || 'false'}&videoOpen=${item.videoOpen || 'false'}`
        // IM ifream嵌入后检测不到openMeeting，使用open跳转
        if (window.electron) {
          window.electron.openMeeting(url)
        } else {
          window.open(url)
        }
      } else {
        this.$router.push({
          name: 'index',
          query: {
            liveId: item.liveId,
            userId: this.userId,
            audioOpen: item.audioOpen || "false",
            videoOpen: item.videoOpen || "false"
          }
        })
      }
    },
    // 今日视频会议
    getyTodayMeeting() {
      let data = {
        myId: this.userId,
        jmeeting: this.userId,
      }
      jmeetingAPI.getUserLivingMeeting(data)
        .then((res) => {
          // console.log(res);
          if (res.success) {
            this.meetingList = res.data;
          }
        })
        .catch(err => console.log(err))
    },
    // 检测拨打人员是否开启领导模式
    checkLeaderMode(item, methodName) {
      jmeetingAPI.isLeaderModeEnabled({
        userId: this.userId,
        inviterId: item.memberId,
        callType: methodName == 'singleClick' ? '0' : '1',
        jmeeting: item.memberId,
      })
        .then(res => {
          console.log(res);
          if (res.success) {
            this.$message.error(res.message)
          } else {
            this[methodName](item)
          }
        })
    },
    //发起单聊语音会议
    singleClick(item) {
      if (!basic.allowBrowserMeeting && !this.electron) {
        this.$refs.meetToastRef.open()
      } else {
        if (this.electron) {
          let url = `/jmeeting-web/#/voiceCall?liveCreatorId=${this.userId}&liveCreatorName=${this.userName}&callerId=${item.memberId}`
          // IM ifream嵌入后检测不到openMeeting，使用open跳转
          if (window.electron) {
            window.electron.openMeeting(url)
          } else {
            window.open(url)
          }
        } else {
          this.$router.push({
            name: 'voiceCall',
            query: {
              liveCreatorId: this.userId,
              liveCreatorName: this.userName,
              callerId: item.memberId
            }
          })
        }
      }

    },
    //发起视频 私聊直接发起会议
    jmeetingClick(item) {
      if (!basic.allowBrowserMeeting && !this.electron) {
        this.$refs.meetToastRef.open()
        return
      }
      // type 0 群语音 1 群视频 11私聊语音 12 私聊视频
      let info = {
        friendIds: [],//会话好友ids
        groupIds: [],
        liveName: this.userName + '发起的视频会议',//会议名称
        liveSponsorId: this.userId,//发起人id
        liveSponsorName: this.userName,//发起人姓名
        liveType: '1',    //0语音，1视频
        clientType: 3,  //0未知 1安卓 2ios 3web 4小程序
        audioOpen: false,//麦克风
        videoOpen: false,//摄像头
        liveCreatorId: this.userId,
        liveCreatorName: this.userName,
      }
      info.friendIds.push(this.userId);
      info.friendIds.push(item.memberId);
      jmeetingAPI.createVideoConferencing({ jmeeting: this.userId }, info)
        .then((res) => {
          if (res.success) {
            this.jumpMeeting({
              liveId: res.data.webrtcCallLink.roomId,
              audioOpen: "true",
            })
          } else {
            this.$toast(res.message);
          }
        })
        .catch(err => console.log(err))
    },
    // 通话历史记录
    getSingleChatHistory() {
      this.loadingChat = true
      jmeetingAPI.getSingleChatHistory({
        userId: this.userId,
        pageNo: this.pageNoChat,
        pageSize: 10,
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        // console.log(res);
        this.pageNoChat++;
        if (res.data.list.length) {
          this.loadingChat = false
        } else {
          this.loadingChat = true
        }
        this.listChat.push(...res.data.list);
      })
    },
    // 历史记录
    load() {
      this.loading = true
      jmeetingWebAPI.getUserHistoryMeeting({
        myId: this.userId,
        jmeeting: this.userId,
        pageNo: this.pageNo,
        pageSize: 10
      }).then(res => {
        // console.log(res.data.list);
        this.pageNo++;
        if (res.data.list.length) {
          this.loading = false
        } else {
          this.loading = true
        }
        this.list.push(...res.data.list);
      })
    },
    // 视频会议历史记录详情
    getUserHistoryMeetingDetails(liveId) {
      jmeetingAPI.getLiveInfo({
        liveId,
        myId: this.userId,
        jmeeting: this.userId,
      }).then(res => {
        // console.log(res);
        if (res.success) {
          this.liveIdSelected = liveId;
          this.liveInfo = res.data;
          this.drawer = true;
        } else {
          this.$message.error(res.message);
        }

      })
    },
    // 检测会议冲突
    refuseMeeting(liveId) {
      let data = {
        liveId: liveId,
        myId: this.userId,
        jmeeting: this.userId,
      }
      jmeetingAPI.jjMeeting(data)
        .then((res) => {
          console.log('拒绝会议', res);
        })
        .catch(err => console.log(err))
    },
    // 获取ucenter信息
    getUcenterInfo() {
      accountAPI.getUcenterInfo({
        myId: this.userId
      }).then(res => {
        if (res.success) {
          let user = res.data.user;
          console.log(user);
          this.userId = user.iid;
          tools.addCookie('userName', user.name)
          tools.addCookie('userId', user.iid)
          this.$store.commit('changeUserId', this.userId);
          this.initData()
        }
      })
    },
    // 获取用户信息
    getInfo() {
      accountAPI.getUserInfo({
        myId: this.userId,
        jmeeting: this.userId,
      })
        .then(res => {
          console.log(res);
          if (res.success) {
            this.img = res.data.mainPage.icon; // IM
            this.userName = res.data.mainPage.name;
            this.mobile = tools.decrypt(res.data.mainPage.mobile, '3730a41db45fac47574647197e985ce349c97a8d62306a8501091e27531ee4ca');
            // this.img = res.data.user.headPath.split(',')[0] + '?r=' + new Date().getMilliseconds(); // Ucenter
          }
        })
    },
    // 点全屏隐藏弹窗操作
    hiddenDraw() {
      this.isShowUserOperate = false;
      this.liveIdSelected = "";
    },
    actionShow() {
      let userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.indexOf('jmeeting') > -1) {
        this.isShowUserOperate = true;
      }
    },
    jumpDown() {
      const { href } = this.$router.resolve({
        name: "download",
      });
      window.open(href, '_blank');
    },
    jumpDetails(item) {
      if (item.playbackStatus == 0) {
        this.$message.warn('录制文件还在生成中，请稍后再试！');
        return
      }
      const { href } = this.$router.resolve({
        name: 'playbackDetails',
        query: {
          iid: item.playbackId
        }
      });
      window.open(href, '_blank');
    }
  },
};
</script>

<style lang="less" scoped>
@import "../assets/css/boxIndex.less";
</style>