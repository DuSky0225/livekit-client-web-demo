<template>
  <div class='clearfix'>
    <div class="topTitle" v-if="$basic.homepageHeader && jmeetingHeader == 'true'">
      <div class="topIcon">
        <img :src="$basic.jmeetingIcon ? $basic.jmeetingIcon : require('../assets/meeting/company.png')" alt="">
        <span>{{ $basic.jmeetingName }}</span>
      </div>
    </div>
    <div class="main">
      <div class="leftSection"
        :class="jmeetingHeader == 'false' ? 'iMHeaderHeight' : $basic.homepageHeader ? 'hasHeaderHeight' : 'noHeaderHeight'">
        <img class="shIcon" src="../assets/image/shIcon.jpg" alt="">
        <div class="borderBot">
          <div class="tipsBox">
            <span>即时</span>
            <span>高效</span>
            <span>便捷</span>
          </div>
        </div>
        <img class="shImg" src="../assets/image/shImg.png" alt="">
      </div>
      <div class="rightSection" ref="rightSectionRef"
        :class="jmeetingHeader == 'false' ? 'iMHeaderHeight' : $basic.homepageHeader ? 'hasHeaderHeight' : 'noHeaderHeight'">
        <div class="createMeetFn">
          <span class="pointer" @click="createMeetFn">发起闪会</span>
        </div>
        <div class="metting" ref="mettingRef">
          <h3><span>今日会议</span></h3>
          <div class="meetingListBorder" v-if="todayList.length">
            <div class="meetingList" v-for="item in todayList" :key="item.liveId">
              <div class="meetingListInfo">
                <img class="meetingIcon" src="../assets/meeting/inmeetLogo.png" alt="">
                <div class="meetingListName">
                  <div class="meetingName">{{ item.liveName }}</div>
                  <div class="meetingNums">
                    <img src="../assets/meeting/inmeet.jpg" alt="">
                    <span>{{ item.joinNum }}人在会议中</span>
                  </div>
                </div>
              </div>
              <div class="meetingBtn" @click="liveIdClick(item)">入会</div>
            </div>
          </div>
          <p v-else>暂无会议</p>
        </div>
        <div class="historyMeet">
          <h3>历史会议</h3>
          <div class="list" v-infinite-scroll="getyHistoryMeeting" infinite-scroll-disabled="loading"
            :style="{ height: height }">
            <div class="line" v-for="(item, i) in historyList" :key="item.liveId">
              <img class="iconLeft" src="../assets/meeting/response.png" alt="">
              <div class="info">
                <h3>{{ item.liveName }}</h3>
                <p>
                  <span>入会时间：{{ getTime(item.createTime) }}</span>
                  <span>&nbsp;&nbsp;|&nbsp;&nbsp;参会人数：{{ item.joinNum }}人</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateMeet ref="createMeetRef" @reloadList="reloadList"></CreateMeet>
    <ExcessReminder v-if="showTips" tipsText="当前会议人数已达上限，建议升级正式版，升级后将享有不限人数不限时长的高清会议权益"
      @afterConfirm="showTips = false" />
  </div>
</template>

<script>
import { jmeetingWebAPI } from '../services/jmeeting'
import { jmeetingWebAPI as jmeetingAPI } from "../services/meeting";
import { imHeader } from "../mixins/index";
// import requestJpaas from '../tools/jpaas_request'
import imMethods from '../tools/imMethods'
import CreateMeet from '../components/createMeet';
import ExcessReminder from "../components/ExcessReminder";
import { tools } from "../tools/tool"
import { jpassConfig } from '../common/config.js'
// import { asynRemove, asynLoad, showCss, hiddenCss } from '@/tools/loadExternalFile';
export default {
  name: 'historyMeet',
  components: {
    CreateMeet,
    ExcessReminder
  },
  mixins: [imHeader],
  data() {
    return {
      tools,
      // meetName: '', //会议名称
      todayList: [],//今日会议列表
      historyList: [],//历史会议列表
      height: "600px",
      phoneNumber: "",
      pageNo: 1,
      loading: false,
      electron: false,
      jmeetingHeader: 'true',//区分微联叮·会议还是内网，去除头部
      screenHeight: null,
      showTips: false,
      // obj:{}
    }
  },
  watch: {
    // 监听数组长度变化 使高度自适应
    todayList: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          let zHeight = this.$refs.rightSectionRef.offsetHeight;
          let nHeight = this.$refs.mettingRef.offsetHeight;
          this.height = (zHeight - nHeight - 145) + 'px';
        })
      },
      deep: true,
      immediate: true
    },
    screenHeight() {
      this.$nextTick(() => {
        let zHeight = this.$refs.rightSectionRef.offsetHeight;
        let nHeight = this.$refs.mettingRef.offsetHeight;
        this.height = (zHeight - nHeight - 145) + 'px';
      })
    }
  },
  methods: {
    // 会议是否结束以及是否和其他端冲突
    liveIdClick(item) {
      let paramas = {
        myId: this.phoneNumber,
        jmeeting: this.phoneNumber,
        liveId: item.iid,
        clientType: 3,//3:pc
      }
      jmeetingAPI.clientIsConflict(paramas)
        .then((res) => {
          console.log(res);
          if (res.success) {
            if (res.data.isClosed) {
              this.$message.error("会议已结束，无法进入")
              return
            }
            if (res.data?.joinNumber && (res.data?.joinNumber == res.data?.singleMaxJoinNumber)) {
              this.showTips = true;
              return
            }
            if (!res.data.isClosed && !res.data.isConflict) {
              this.jumpMeet(item)
            }
          }
        })
    },
    //进入会议
    jumpMeet(item) {
      // this.$router.push({ path: '/index', query: { liveId: item.iid, phoneNumber: this.phoneNumber, userName: item.liveCreatorName, liveMode: item.liveMode } })
      if (this.electron) {
        let url = `${location.pathname}#/index?liveId=${item.iid}&phoneNumber=${this.phoneNumber}&userName=${item.liveCreatorName}&liveMode=${item.liveMode}&audioOpen=${item.audioOpen || 'false'}&videoOpen=${item.videoOpen || 'false'}`
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
            liveId: item.iid,
            phoneNumber: this.phoneNumber,
            userName: item.liveCreatorName,
            liveMode: item.liveMode,
            audioOpen: item.audioOpen || "false",
            videoOpen: item.videoOpen || "false"
          }
        })
      }
    },
    //发起会议
    createMeetFn() {
      this.$refs.createMeetRef.open();
    },
    //外部人员历史会议
    getyHistoryMeeting() {
      this.loading = true;
      jmeetingWebAPI
        .externalHistory({
          // jmeeting:tools.encrypt(this.phoneNumber,jpassConfig.publicKey),
          jmeeting: '12345678901234567890123456789012',
          myId: tools.encrypt(this.phoneNumber, jpassConfig.publicKey),
          pageNo: this.pageNo,
          pageSize: 10
        })
        .then((res) => {
          if (res.success) {
            // console.log(res);
            this.pageNo++;
            if (res.data.list.length == 0) {
              this.loading = true
            } else {
              this.loading = false;
            }
            res.data.list.map((item) => {
              if (item.liveState == 0) {
                this.todayList.push(item);
                // console.log(this.todayList);
              } else {
                this.historyList.push(item);
              }
            })
            //todo：暂无会议缺省图
            // this.betahistoryNone = this.betahistoryList.length == 0 ? true : false ;
          } else {
            console.log(res.message);
          }
        })
        .catch(err => console.log(err))
    },
    //时间戳转换
    getTime(time) {
      let date = new Date(time);
      let month = date.getMonth() + 1;
      let data = date.getDate();
      let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
      let minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
      return month + '月' + data + '日  ' + hour + ':' + minute;
    },
    reloadList() {
      this.todayList = [];
      this.historyList = [];
      this.pageNo = 1;
      this.loading = false;
      this.getyHistoryMeeting()
    }
  },
  created() {
    // 自定义事件, 接收消息盒子传递的数据
    window.addEventListener(
      'closeFlashMeeting',
      () => {
        console.log('closeFlashMeeting','closeFlashMeeting');
        //方法
        this.reloadList()
      },
      false
    );
    // 判断是不是在内网
    let jmeetingHeader = sessionStorage.getItem('jmeetingHeader');
    if (jmeetingHeader == 'false') {
      this.jmeetingHeader = 'false';
      sessionStorage.setItem('jmeetingHeader', false)
    } else {
      this.jmeetingHeader = 'true';
    }
    // 判断是否在盒子
    let userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('electron') > -1) {
      this.electron = true;
    }
    // this.userId = imMethods.getUrlParams('userId');
    this.phoneNumber = imMethods.getUrlParams('phoneNumber');
    this.todayTime = new Date().getMonth() + 1 + '月' + new Date().getDate() + '日';
  },
  mounted() {
    this.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        this.screenHeight = document.body.clientHeight
      })()
    }
    //isCreate为true-发起会议
    if (this.$route.params.isCreate || imMethods.getUrlParams('isCreate')) {
      this.createMeetFn();
    }
  },
}
</script>

<style scoped lang="less">
@import "~@/assets/css/historyMeet.less";
</style>
