<template>
  <div class='clearfix'>
    <div class="topBox">
      <div class="titleContent">
        <!-- <van-icon name="arrow-left" class="pointer" @click="$router.back()" /> -->
        <img src="@/assets/meeting/oa.svg" alt="">
        <div class="info">
          <a-textarea v-if="videoInfo.meetingCreatorId == userId" auto-size class="videoTitle" ref="inputRef"
            v-model="videoName" :placeholder="videoInfo.meetingName" @blur="modifyPlaybackVideoName()"
            @pressEnter="beforModifyPlaybackVideoName()" />
          <span class="videoTitle" v-else>{{ videoName }}</span>
          <p>{{ tools.formatTime(new Date(videoInfo.liveLaunchTime)).type }} ｜ 总查看{{ videoInfo.playbackViewTimes }}次 ｜
            总下载{{
            videoInfo.fileDownloadTimes
          }}次</p>
        </div>
      </div>
      <div class="actionBtns" id="actionBtns">
        <div class="shareRecording" v-if="isShow">
          <div class="shareRecordingTitle">
            <span>分享录制</span>
            <van-icon class="pointer" color="#9D9EA0" name="cross" @click="isShow = false" />
          </div>
          <div class="shareRecordingContent">
            <a-select :default-value="shareValue" @change="handleChange">
              <a-select-option value="0">
                仅自己可查看
              </a-select-option>
              <a-select-option value="1">
                仅参会人可查看
              </a-select-option>
              <a-select-option value="2">
                仅指定成员可查看
              </a-select-option>
            </a-select>
            <div class="menSelect" v-if="shareValue == 2" @click="addMember">
              <input style="width:100%" readonly v-model="selectStr" placeholder="请选择成员" />
              <!-- <ul class="selectedMen">
                <li>
                  <img src="@/assets/meeting/位图.png" alt="">
                  <span>吕典</span>
                  <van-icon color="#999" name="clear" />
                </li>
              </ul> -->
              <span class="pointer"><img src="@/assets/meeting/addMen.svg" alt=""></span>
            </div>
            <a-checkbox v-if="shareValue != 0" v-model:checked="checked" @change="onChange">允许下载</a-checkbox>
            <div class="btns">
              <span class="active pointer" @click="sharePermissionSettings()">确定</span>
              <span class="pointer" @click="isShow = false">取消</span>
            </div>
          </div>
        </div>
        <a v-if="videoInfo.meetingCreatorId == userId" class="active" @click="isShow = true">
          共享
        </a>
        <a-dropdown :trigger="['click']" placement="bottomRight"
          :getPopupContainer="tirggerNode => tirggerNode.parentNode"
          v-if="videoInfo.meetingCreatorId == userId || videoInfo.canDownload == 0">
          <a v-if="videoInfo.meetingCreatorId == userId || videoInfo.canDownload == 0" class="ant-dropdown-link"
            @click="e => e.preventDefault()">导出</a>
          <a-menu slot="overlay">
            <a-menu-item key="0" @click="beforeFileExport(0)">全部</a-menu-item>
            <a-menu-item key="1" @click="beforeFileExport(1)">视频文件</a-menu-item>
            <a-menu-item key="2" @click="beforeFileExport(2)">会议纪要</a-menu-item>
          </a-menu>
        </a-dropdown>
        <a v-if="videoInfo.meetingCreatorId == userId" @click="showConfirm()">删除</a>
      </div>
    </div>
    <div class="mainBody">
      <!-- disablePictureInPicture 禁用画中画  -->
      <div class="leftMain">
        <video :src="videoInfo.playbackAddress" :poster="videoInfo.coverImageAddress" ref="videoRef" controls
          disablePictureInPicture controlslist="nodownload">
          <span>您的浏览器不支持video标签，请换个浏览器试一下吧</span>
        </video>
        <h3 class="pointer pageName"><span></span>智能总结</h3>
        <div ref="nRcneter" class="textContent nRcneter">
          <p class="minutes" :style="{ 'height': minutesStyle }" v-if="summaryText" v-html="summaryText"></p>
          <!-- <h3 class="title">会议纪要</h3> -->
          <div class="nodatas" v-else>
            <!-- <img class="textContentImg" src="@/assets/images/nodata.jpg" alt=""> -->
            <img v-if="nRcneterHeight > 220" src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
          </div>
        </div>
      </div>
      <div class="ability">
        <div class="flexCenter">
          <h3 class="pointer pageName"><span></span>内容速览</h3>
          <div>
            <a-input ref="userNameInput" v-model="searchText" @pressEnter="beforeSearch">
              <a-icon slot="prefix" type="search" />
              <div slot="suffix">
                <a-icon type="left" class="pointer" @click="searchLast" />
                {{ lightIndex || 0 }}/{{ matchCount }}
                <a-icon type="right" class="pointer" @click="searchNext" />
                |
                <a-icon type="close" class="pointer" @click="clearSearchResult" />
              </div>
            </a-input>
          </div>
        </div>
        <div ref="keywordBoxRef" class="keywordBox" v-if="keyWordsList.length">
          <h3 class="keywordName">关键词</h3>
          <ul class="keywordList">
            <li class="pointer" :style="searchText == item ? { background: '#e8f2fe', color: '#579cf4' } : ''"
              v-for="item in keyWordsList.slice(0, 10)" :key="item" @click="searchKeywords(item)">{{ item }}</li>
          </ul>
        </div>
        <h3 class="pageName" style="margin-bottom: 0;">原文内容</h3>
        <div class="textContent">
          <ul ref="textContent" v-if="audioTextArr.length">
            <li class="line" v-for="(item, index) in audioTextArr" @click="goEvery(item.speakerTime)">
              <img :src="item.speakerAvatar || require('@/assets/ic_default_avatar.png')" alt="" :onerror="errorImage">
              <div class="vText pointer">
                <span>{{ item.speakerName }} {{ item.speakerTime }}</span>
                <p class="pText" :tabindex="index">{{ item.speakerText }}</p>
              </div>
            </li>
          </ul>
          <div class="nodata" v-else>
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </div>
    <UserSelector class="userSelector" title="邀请人员" :im="basic.isNeedGroup" @selectedOk="selectedOk" ref="userSelector">
    </UserSelector>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import UserSelector from 'jpaas-component/business/UserSelector';
import { jmeetingWebAPI } from "@/services/playBackAPI";
import { tools } from "@/tools/tool";
// import { saveAs } from 'file-saver';
import { nanoid } from 'nanoid';
export default {
  components: {
    UserSelector
  },
  data() {
    return {
      basic,
      tools,
      playbackId: "",
      abilityNum: 1,//1转写 2纪要
      shareValue: 0,//共享类别
      checked: false,//允许下载
      isShow: false,
      SelectedData: [],
      audioTextArr: [],
      selectStr: "",
      userId: "",
      videoInfo: {},
      videoName: "",//会议名称
      summaryText: "",
      minutesStyle: "",
      nRcneterHeight: null,
      errorImage:
        ' this.src=" ' + require('@/assets/ic_default_avatar.png') + ' " ',
      setTimer: null,
      keyWordsList: [],
      searchText: "",
      oldSearchText: "",
      lightIndex: null,
      matchCount: 0,
    };
  },
  created() {
    this.playbackId = this.$route.query.iid;
    this.userId = Cookies.get('userId')
    // this.SelectedData.push({ 'iid': this.userId })
    // console.log(this.SelectedData);
    this.playbackDetail()
    this.audioToTextList()
    this.meetingSummary()
  },
  watch: {
    'videoInfo.coverImageAddress'() {
      setTimeout(() => {
        let vHeight = this.$refs.videoRef.offsetHeight;
        this.minutesStyle = `calc(100vh - ${vHeight}px - 220px)`
        this.$refs.nRcneter.style.height = `calc(100vh - ${vHeight}px - 180px)`;
        this.nRcneterHeight = this.$refs.nRcneter.clientHeight;
      }, 200);
    }
  },
  mounted() {
    this.extractKeywords();
    window.onresize = () => {
      return (() => {
        let vHeight = this.$refs.videoRef.offsetHeight;
        this.minutesStyle = `calc(100vh - ${vHeight}px - 220px)`
        this.$refs.nRcneter.style.height = `calc(100vh - ${vHeight}px - 180px)`;
        this.nRcneterHeight = this.$refs.nRcneter.clientHeight;
        // 
        let fHeight = this.$refs.keywordBoxRef.offsetHeight;
        this.$refs.textContent.style.height = `calc(100vh - ${fHeight}px - 206px)`;
      })()
    }
  },
  methods: {
    searchKeywords(text) {
      this.clearSearchResult();
      this.searchText = text;
      this.highlightText();
    },
    beforeSearch() {
      if (this.oldSearchText == this.searchText) {
        this.searchNext();
      } else {
        this.lightIndex = 0;
        this.highlightText();
      }
    },
    highlightText() {
      this.oldSearchText = this.searchText;
      this.matchCount = 0;
      const contentElementArr = document.getElementsByClassName('pText');
      for (let contentElement of contentElementArr) {
        const content = contentElement.textContent;
        const regex = new RegExp(this.searchText, 'gi');
        const highlightedContent = content.replace(regex, match => `<span style="background:#ffe75f" class='search-hightlight'>${match}</span>`);
        this.matchCount += (content.match(regex) || []).length;
        contentElement.innerHTML = highlightedContent;
      }
      if (this.matchCount) {
        this.searchNext()
      }
    },
    scrollTo(index) {
      this.$nextTick(() => {
        let list = this.$refs.textContent.querySelectorAll(`.search-hightlight`)
        list.forEach((item, i) => {
          item.style = "background:#ffe75f";
          if (index - 1 == i) {
            this.lightIndex = index;
            // list[index].scrollIntoView()
            list[index - 1].style = "background:#fb9249";
            const scrollOptions = {
              top: list[index - 1].offsetTop - 600,
              behavior: 'smooth', // 平滑滚动  
            };
            this.$refs.textContent.scrollTo(scrollOptions);
          }
        })
      })
    },
    searchNext() {
      this.$nextTick(() => {
        if (this.matchCount == 0) return;
        let idx
        if (this.lightIndex >= this.matchCount) {
          this.lightIndex = 1
          idx = 1
        } else {
          idx = this.lightIndex + 1
        }
        console.log(idx);
        this.scrollTo(idx)
      })
    },
    searchLast() {
      this.$nextTick(() => {
        let idx
        if (this.lightIndex <= 1) {
          idx = this.matchCount
          this.lightIndex = this.matchCount
        } else {
          idx = this.lightIndex - 1
        }
        this.scrollTo(idx)
      })
    },
    clearSearchResult() {
      this.searchText = null;
      this.lightIndex = null;
      this.matchCount = 0;
      this.highlightText()
    },
    // 回放详情
    playbackDetail() {
      jmeetingWebAPI.playbackDetail({
        iid: this.playbackId,//
        userId: this.userId,
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        if (res.success) {
          this.videoInfo = res?.data;
          this.videoName = res?.data?.meetingName;
          this.shareValue = res?.data?.permissionType.toString();
          // permissionType共享权限 0自己 1参会人 2指定 
          if (this.shareValue != 0) {
            this.checked = res?.data?.canDownload == 0 ? true : false;
          }
          if (this.shareValue == 2) {
            let imUserList = res.data.imUserList || [];
            this.SelectedData = imUserList;
            this.selectStr = imUserList.map(function (obj) {
              return obj.name;
            }).join(",")
          }
        } else {
          this.$message.error(res.message);
        }
      })
    },
    beforModifyPlaybackVideoName() {
      this.$refs.inputRef.blur()
    },
    // 修改回放会议视频名称
    modifyPlaybackVideoName() {
      if (this.videoName == this.videoInfo.meetingName) return
      jmeetingWebAPI.modifyPlaybackVideoName({
        iid: this.playbackId,//
        videoName: this.videoName,
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        if (res.success) {
          this.$message.success(res.message);
          this.$set(this.videoInfo, 'meetingName', this.videoName)
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 会议纪要
    meetingSummary() {
      jmeetingWebAPI.meetingSummary({
        iid: this.playbackId,
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        if (res.success) {
          let summaryText = res?.data;
          this.summaryText = summaryText.replace(/(\n<br>|\n\n|\n)/g, '<br />')
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 关键词获取
    extractKeywords() {
      jmeetingWebAPI.extractKeywords({
        iid: this.playbackId,
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        if (res.success) {
          let keyWords = res.data.replace(/\s+/g, '');
          this.keyWordsList = keyWords !== "" ? keyWords.split(/[，,]+/) : [];
          this.$nextTick(() => {
            if (this.$refs.textContent?.style) {
              let fHeight = this.$refs.keywordBoxRef.offsetHeight;
              this.$refs.textContent.style.height = `calc(100vh - ${fHeight}px - 206px)`;
            }
          })
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 会议成员语音转文字内容列表
    audioToTextList() {
      jmeetingWebAPI.audioToTextList({
        iid: this.playbackId,//回放视频iid
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        if (res.success) {
          this.audioTextArr = res?.data || [];
          this.$nextTick(() => {
            if (this.$refs.keywordBoxRef?.offsetHeight) {
              let fHeight = this.$refs.keywordBoxRef.offsetHeight;
              this.$refs.textContent.style.height = `calc(100vh - ${fHeight}px - 206px)`;
            }
          })
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 分享权限设置
    sharePermissionSettings() {
      let idList = [], canDownload, userIds = [], groupChatIds = [], groupIds = [], organizationIds = [];
      if (this.shareValue == 0) {
        idList.push("owner");
        canDownload = 0;
      } else if (this.shareValue == 1) {
        idList.push("joiner");
        canDownload = this.checked ? 0 : 1;
      } else {
        idList.push("others");
        canDownload = this.checked ? 0 : 1;
        if (this.SelectedData.length == 0) {
          this.$message.warn("请选择成员")
          return
        }
        for (let item of this.SelectedData) {
          if (item.selectType == "team") {
            groupIds.push(item.iid)
          } else if (item.selectType == "group") {
            organizationIds.push(item.iid)
          } else if (item.selectType == "imTeam") {
            groupChatIds.push(item.iid)
          } else {
            // "imUser || user"
            userIds.push(item.iid)
          }
        }
      }
      // 
      jmeetingWebAPI.sharePermissionSettings({
        jmeeting: '12345678901234567890123456789012',
      }, {
        liveId: this.videoInfo.meetingId,//"下发查看权限的会议id",
        ownerId: this.videoInfo.meetingCreatorId,//"具有设置分享权限的人id即会议创建者id",
        idList,// owner / joiner / others
        organizationIds,//组织
        groupIds,//群组
        groupChatIds,//群聊
        userIds,//用户
        canDownload,// 是否可下载 0：可以下载 1：不可以下载 默认不可下载
      }).then(res => {
        if (res.success) {
          this.$message.success(res.message);
          this.isShow = false;
          if (this.shareValue != 2) {
            this.SelectedData = [];
            this.selectStr = "";
          }
        } else {
          this.$message.error(res.message);
        }
      })
    },
    beforeFileExport(type) {
      let userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.indexOf('electron') > -1) {
        this.getHosList(type)
      } else {
        // this.recordingSave(res, type)
        this.fileExport(type)
      }
    },
    // 导出
    fileExport(type) {
      window.open(`/api-gateway/jpaas-jmeeting-web-server/front/recording/fileExport?iid=${this.playbackId}&type=${type}&jmeeting=12345678901234567890123456789012`)
    },
    // host地址
    getHosList(type) {
      jmeetingWebAPI.getHosList({
        iid: this.playbackId,
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        if (res.success) {
          let filePath = type == 0 ? res.data.zipPath : type == 1 ? res.data.videoPath : res.data.wordPath;
          let fileType = type == 0 ? '.zip' : type == 1 ? ".mp4" : '.docx';
          let params = {
            filePath,
            fileName: this.videoInfo.meetingName + fileType,
            fileId: nanoid(16)
          }
          // console.log(params);
          window.electron.downFile(params);
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 删除回放
    deletePlayback() {
      jmeetingWebAPI.deletePlayback({
        iid: this.playbackId,//
        userId: this.userId,
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        if (res.success) {
          this.$router.replace({
            name: "playbackList",
            params: {
              isCanceled: true
            }
          })
        } else {
          this.$message.error(res.message);
        }
      })
    },
    addMember() {
      this.$refs.userSelector.open(this.SelectedData)
    },
    selectedOk(e) {
      this.SelectedData = JSON.parse(JSON.stringify(e))
      this.selectStr = this.SelectedData.map(function (obj) {
        return obj.name;
      }).join(",")
      console.log(this.SelectedData);
    },
    async goEvery(time) {
      let currentTime = await this.timeTransfrom(time)
      let videoRef = this.$refs.videoRef;
      videoRef.currentTime = currentTime;
    },
    timeTransfrom(time) {
      let hhmmss = time.split(":");
      let hh = parseInt(hhmmss[0], 10);
      let mm = parseInt(hhmmss[1], 10);
      let ss = parseInt(hhmmss[2], 10);
      return (hh * 60 * 60) + (mm * 60) + ss;
    },
    onChange(e) {
      this.checked = e.target.checked
    },
    handleChange(value) {
      this.shareValue = value
    },
    showConfirm() {
      let that = this;
      this.$confirm({
        title: `删除${this.videoName}？`,
        content: '内容删除后将无法恢复',
        okText: '删除',
        cancelText: '取消',
        onOk() {
          that.deletePlayback();
        },
        onCancel() { },
      });
    },
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() { },
  beforeRouteEnter(to, from, next) {
    // 添加背景色
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#F1F5FE");
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 去除背景色
    document.querySelector("body").setAttribute("style", "");
    // 清除定时器
    this.setTimer = null;
    next();
  },
};
</script>
<style lang="less" scoped>
.clearfix {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
}

.topBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.titleContent {
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    margin: 0 15px;
    width: 30px;
    height: 25px;
  }
}

.info {
  display: flex;
  flex-direction: column;

  .videoTitle {
    width: 50vw;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 500;
    margin: 0;
    border: none;
    padding: 0;
    min-height: 24px;
  }

  textarea {
    display: inline-block;
    background-color: #F1F5FE;
    resize: none;

    &:focus {
      // outline: 1px solid #ffffff;
      background-color: #ffffff;
    }
  }


  p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    font-weight: 400;
    margin: 0;
  }
}

.actionBtns {
  display: flex;
  align-items: center;
  position: relative;

  a {
    width: 60px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    background: #FFFFFF;
    border: 1px solid rgba(223, 226, 228, 1);
    border-radius: 4px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    font-weight: 400;
    margin-left: 10px;
  }

  .active {
    background: #1890FF;
    color: #FFFFFF;
  }
}

.shareRecording {
  position: absolute;
  top: 42px;
  right: 130px;
  width: 460px;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 6px rgba(200, 200, 200, 0.33);
  border-radius: 8px;
  z-index: 99;

  &Title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid #F5F6F7;

    span {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 400;
    }
  }

  &Content {
    padding: 20px;
  }

  .menSelect {
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    input {
      padding: 0 12px;
    }

    .selectedMen {
      width: 100%;
      margin: 0;
      background-color: #ffffff;

      li {
        margin: 0;
        display: inline-flex;
        align-items: center;
        background-color: #eeeeee;

        img {
          width: 14px;
          height: 14px;
          border-radius: 4px;
        }

        span {
          font-size: 12px;
          color: #333;
          border: none;
        }
      }
    }

    span {
      padding: 12px;
      line-height: 1;
      border-left: 1px solid rgba(221, 221, 221, 1);
    }

    img {
      width: 14px;
      height: 14px;
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    span {
      width: 84px;
      height: 36px;
      background: #FFFFFF;
      border: 1px solid rgba(192, 193, 195, 1);
      border-radius: 4px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 400;
      text-align: center;
      line-height: 36px;
    }

    .active {
      background: #1890FF;
      color: #FFFFFF;
      border: none;
      margin-right: 12px;
    }
  }

  /deep/ .ant-select {
    width: 100%;
    margin-bottom: 20px;
  }

  /deep/ .ant-checkbox-wrapper {
    display: block;
    text-align: left;
    margin-bottom: 38px;
    line-height: 1;
  }
}

.mainBody {
  width: 100%;
  height: calc(100vh - 102px);
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  overflow: hidden;

  .leftMain {
    display: flex;
    flex-direction: column;
    flex: 1;
    // width: 60%;
  }

  video {
    max-width: 100%;
    display: flex;
    // width: 50%;
    overflow: hidden;
    margin-bottom: 30px;
  }

  .ability {
    // width: 40%;
    flex: 1;
    height: calc(100vh - 122px);
    border-left: 1px solid #EBECED;
    margin-left: 20px;
    padding-left: 20px;
    overflow: hidden;
  }

  .flexCenter {
    display: flex;
    align-items: center;
    justify-content: space-between;

    /deep/ .ant-input-affix-wrapper {
      min-width: 250px;
    }

    /deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
      padding-right: 100px;
    }
  }

  .keywordBox {
    .keywordName {
      font-size: 16px;
      margin-bottom: 12px;
      color: #000000;
      font-weight: 500;
    }

    .keywordList {
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      margin: 0;

      li {
        padding: 6px 12px;
        background-color: rgb(242, 242, 246);
        color: rgb(125, 126, 129);
        font-size: 14px;
        margin-right: 12px;
        border-radius: 4px;
        margin-bottom: 12px;
      }
    }
  }

  .pageName {
    font-size: 16px;
    margin-bottom: 12px;
    color: #000000;
    font-weight: 500;
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      width: 3px;
      height: 14px;
      background: #1890FF;
      margin-right: 8px;
    }
  }

  .titleBox {
    border-bottom: 1px solid #EBECED;
    padding-bottom: 14px;

    span {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #999999;
      text-align: center;
      font-weight: 400;
      margin: 0 30px 0 15px;
      position: relative;
    }

    .active {
      color: #0088FE;

      &::after {
        content: "";
        width: 20px;
        height: 4px;
        background: #0088FE;
        border-radius: 2px;
        position: absolute;
        bottom: -14px;
        left: 6px;
      }
    }
  }

  .nRcneter {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .textContent {
    padding: 20px 0;
    overflow: hidden;

    ul {
      overflow: auto;
      // height: calc(100vh - 180px);
      height: calc(100vh - 300px);
      margin: 0;

      &::-webkit-scrollbar {
        /* 隐藏默认的滚动条 */
        -webkit-appearance: none;
        // width: 1px;
      }

      &::-webkit-scrollbar:vertical {
        /* 设置垂直滚动条宽度 */
        width: 5px;
      }

      &::-webkit-scrollbar:horizontal {
        /* 设置水平滚动条厚度 */
        height: 2px;
      }

      &::-webkit-scrollbar-thumb {
        /* 拖动条的其他样式定制，注意，这个一定也要定制，否则就是一个透明的滚动条 */
        border-radius: 8px;
        // background-color: #999999;
        background-color: rgb(204, 205, 206);
        /* 设置拖动条的颜色填充 */
      }

      // &::-webkit-scrollbar-track {
      //   /* 滚动条的其他样式定制，注意，这个一定也要定制，否则就是一个透明的滚动条 */
      //   border-radius: 8px;
      //   background-color: #999999;
      //   /* 设置滚动条的颜色填充 */
      // }
    }

    .line {
      display: flex;
      margin-bottom: 18px;

      img {
        border-radius: 4px;
        width: 28px;
        height: 28px;
        margin-right: 12px;
      }

      .vText {
        display: flex;
        flex-direction: column;

        span {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
          letter-spacing: 0;
          font-weight: 400;
          margin-bottom: 2px;
        }

        p {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0;
          font-weight: 400;
          margin-bottom: 0;

          &:focus {
            background-color: #eff0f2;
          }
        }
      }
    }

    .title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .minutes {
      width: 100%;
      overflow: auto;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #000000;
      letter-spacing: 0;
      font-weight: 400;
      line-height: 2;
      margin-bottom: 0;

      &::-webkit-scrollbar {
        /* 隐藏默认的滚动条 */
        -webkit-appearance: none;
        // width: 1px;
      }

      &::-webkit-scrollbar:vertical {
        /* 设置垂直滚动条宽度 */
        width: 5px;
      }

      &::-webkit-scrollbar:horizontal {
        /* 设置水平滚动条厚度 */
        height: 2px;
      }

      &::-webkit-scrollbar-thumb {
        /* 拖动条的其他样式定制，注意，这个一定也要定制，否则就是一个透明的滚动条 */
        border-radius: 8px;
        // background-color: #999999;
        background-color: rgb(204, 205, 206);
        /* 设置拖动条的颜色填充 */
      }
    }

    .textContentImg {
      display: block;
      width: 30%;
      height: 30%;
      margin: 20% auto;
    }

    .nodatas {
      // margin-top: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        width: 195px;
        height: 172px;
        margin-bottom: 20px;
      }

      p {
        font-family: PingFangSC-Regular;
        font-size: 17px;
        color: #999999;
        text-align: center;
        font-weight: 400;
        margin-bottom: 0;
      }
    }

    .nodata {
      margin-top: 18vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        width: 195px;
        height: 172px;
        margin-bottom: 20px;
      }

      p {
        font-family: PingFangSC-Regular;
        font-size: 17px;
        color: #999999;
        text-align: center;
        font-weight: 400;
        margin-bottom: 0;
      }
    }

  }
}

/deep/ .ant-dropdown-menu {
  padding: 4px;
}

/deep/ .ant-dropdown-menu-item {
  width: 120px;
  padding: 6px 8px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 400;
  line-height: 1.2;
}

/deep/ .ant-dropdown-menu-item:hover {
  background: #EFF1F1;
  border-radius: 4px;
}
</style>