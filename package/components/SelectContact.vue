<template>
  <div class="main">
    <el-dialog title="邀请人员" :visible.sync="isSelectContact" :modal-append-to-body='false' :close-on-click-modal="false"
      width="686px" :before-close="cancelFn">
      <slot name="selectContactSlot">
        <div class="nav" v-if="liveMode && liveMode !== 0">
          <!-- 内部会议-展示邀请人员 混合会议-外部人员展示链接扫码 内部展示全部  -->
          <div class="navItem" @click="changeNavItem(1)" v-if="liveMode == 1 && meetingObj.userType !== -1">
            <span :class="navchoose == 1 ? 'active' : ''">内部邀请</span>
            <div :class="navchoose == 1 ? 'navborder' : ''"></div>
          </div>
          <div class="navItem" @click="changeNavItem(2)">
            <span :class="navchoose == 2 ? 'active' : ''">链接邀请</span>
            <div :class="navchoose == 2 ? 'navborder' : ''"></div>
          </div>
          <div class="navItem" @click="changeNavItem(3)">
            <!-- 扫码邀请 -->
            <span :class="navchoose == 3 ? 'active' : ''">闪会码</span>
            <div :class="navchoose == 3 ? 'navborder' : ''"></div>
          </div>
        </div>
        <div class="innerInvite" v-if="!liveMode || liveMode == 0 || (liveMode == 1 && navchoose == 1)">
          <div class="dialogLeftOne" v-if="[1, 2, 5, 6].indexOf(selectType) !== -1">
            <div class="searchMember">
              <div class="searchdiv" ref="searchdivRef">
                <div class="chooseMember" v-if="chooseMemeberList">
                  <!-- 搜索置顶 -->
                  <el-input v-model="inputNameValue" placeholder="搜索" ref="inputNameRef" @input="inputNameFn" />
                  <p class="fixedMember" v-for="(item, index) in chooseMemebers" :key="'i' + index">
                    {{ item.name }}
                  </p>
                  <p class="memberItem" v-for="(item, index) in chooseMemeberList" :key="'j' + index">
                    <span class="memberName">
                      {{ item.name }}
                    </span>
                    <img class="deleteImg" src="../assets/images/deleteselect.svg" alt=""
                      @click="deleteMemeberFn(item, index)" />
                  </p>
                </div>
              </div>
              <div class="searchResult" ref="searchResultRef" v-if="isSearchResult">
                <MemberSearch v-if="selectType == 5 || selectType == 6" ref="memSearch" :selectType="selectType"
                  :userId="myId" :keyword="inputNameValue" @addMember="addMemberFn" />
                <SelectSearch v-else :searchMemberList="searchMemberList" ref="selectSearch" @addMember="addMemberFn"
                  @showChange="isShowChangeFn" @changeShow="changeShowFn(arguments)">
                </SelectSearch>
              </div>
            </div>
            <!-- <div>{{zfDetails}}</div> -->
            <div v-if="selectType == 5" class="leaveBox">
              <div class="leaveMes" v-if="zfDetails.forwardIds.length == 1 && zfDetails.showContent">
                <span v-if="zfDetails.showContent.split('：')[1]">{{ zfDetails.showContent.split('：')[1] }}</span>
                <span v-if="zfDetails.showContent.split(':')[1]">{{ zfDetails.showContent.split(':')[1] }}</span>
              </div>
              <div class="leaveMes" v-if="zfDetails.forwardIds.length !== 1">
                <div v-if="zfDetails.msgType && zfDetails.msgType == 8">
                  <span>[合并转发]</span>
                  <span v-if="zfDetails.chatType == 1">群聊的聊天记录</span>
                  <span v-if="zfDetails.chatType !== 1">{{ zfDetails.fromName.length > 3 ?
                    zfDetails.fromName.slice(0, 3) + '...' : zfDetails.fromName }}和{{ zfDetails.toName.length > 3 ?
    zfDetails.toName.slice(0, 3) + '...' : zfDetails.toName }}的聊天记录</span>
                </div>
                <div v-else>
                  <span>[逐条转发]</span>
                  <span>共{{ zfDetails.forwardIds.length }}条消息</span>
                </div>
              </div>
              <div class="underLine"></div>
              <el-input type="textarea" v-model="leaveValue" placeholder="留言..." />
              <!-- <div class="none"></div> -->
              <div>
                <button class="confirmButton" :class="isconfirmBtn
                  ? 'canconfirmButton'
                  : 'notconfirmButton'
                  " @click="confirmFn">
                  确定({{ memberSum }}/{{ selectType == 5 ? maxUser - chooseMemebers.length : maxUser -
                    chooseMemebers.length
                  }})
                </button>
                <button class="concelButton" @click="cancelFn">取消</button>
              </div>
            </div>
            <div v-if="selectType !== 5" class="groupName" ref="groupNameRef">
              <div v-if="selectType !== 6" class="lineBottom"></div>
              <p v-if="selectType !== 6" class="groupTitle" style="display: flex; align-items: center">
                群名称
                <span style="color: #d5d5d6; font-size: 14px">{{
                  "&nbsp;" + "-" + "&nbsp;" + "必填"
                }}</span>
              </p>
              <el-input v-if="selectType !== 6" v-model="inputGroupValue" placeholder="取个群名称方便后续搜索"
                oninput="if(value.length>50)value=value.slice(0,50)" />
              <div>
                <button :class="isconfirmBtn
                  ? 'confirmButton canconfirmButton'
                  : 'confirmButton notconfirmButton'
                  " @click="confirmFn">
                  确定({{ memberSum }}/{{ selectType == 5 ? maxUser - chooseMemebers.length : maxUser -
                    chooseMemebers.length
                  }})
                </button>
                <button class="concelButton" @click="cancelFn">取消</button>
              </div>
            </div>
          </div>
          <div class="dialogLeftThree" v-if="[3, 4].indexOf(selectType) !== -1">
            <div class="searchMember">
              <div class="searchdiv" ref="searchdivRef">
                <div class="chooseMember" v-if="chooseMemeberList">
                  <p class="memberItem" v-for="(item, index) in chooseMemeberList" :key="'k' + index">
                    <span class="memberName">
                      {{ item.name }}
                    </span>
                    <img class="deleteImg" src="../assets/images/deleteselect.svg" alt=""
                      @click="deleteMemeberFn(item, index)" />
                  </p>
                  <el-input v-model="inputNameValue" placeholder="搜索联系人" ref="inputNameRef" @input="inputNameFn" />
                </div>
              </div>
              <div class="searchResult" ref="searchResultRef" v-if="isSearchResult">
                <SelectSearch :searchMemberList="searchMemberList" ref="selectSearch" @addMember="addMemberFn"
                  @showChange="isShowChangeFn" @changeShow="changeShowFn(arguments)">
                </SelectSearch>
              </div>
            </div>
            <div class="middleBox"></div>
            <div class="buttonBox">
              <button :class="isconfirmBtn
                ? 'confirmButton canconfirmButton'
                : 'confirmButton notconfirmButton'
                " @click="confirmFn">
                确定({{ memberSum }}/{{ maxUser - chooseMemebers.length }})
              </button>
              <button class="concelButton" @click="cancelFn">取消</button>
            </div>
          </div>
          <div class="dialogRight">
            <div class="line"></div>
            <div class="structureMain" v-if="isRight == 0">
              <div v-if="selectType == 5 || selectType == 6" class="myGroup" @click="jumpRight(1)">
                <img class="groupImg" src="../assets/images/myGroup.svg" alt="" />
                <span class="groupName">按群聊选</span>
              </div>
              <div class="company">
                <img class="companyImg" src="../assets/images/companyLogo.svg" alt="" />
                <span class="companyName">大汉软件股份有限公司</span>
                <img class="directionImg" :src="directionImgSrc" alt="" @click="changeDirectionFn" />
              </div>
              <div class="structure" style="cursor: pointer" ref="structrueRef" @click="jumpRight(2)">
                <img class="strImg" src="../assets/images/structrueLogo.svg" alt="" />
                <span class="strName">按组织架构选</span>
              </div>
            </div>
            <div class="structureChoose" v-if="isRight == 2">
              <SelectRight ref="selectRight" :chooseMemebers="chooseMemebers" :fixedMemberList="fixedMemberList"
                :groupMemberList="groupMemberList" :chooseMemeberList="chooseMemeberList" :meetingObj="meetingObj"
                @changeMemsum="changeMemsumFn(arguments)" @changeMemlist="changeMemlistFn(arguments)"
                @changeIsRight="jumpRight" :basic="basic">
              </SelectRight>
            </div>
            <div class="groupList" v-if="isRight == 1">
              <SelectGroup ref="selectGroup" :chooseMemeberList="chooseMemeberList" :meetingObj="meetingObj"
                @changeMemsum="changeMemsumFn(arguments)" @changeMemlist="changeMemlistFn(arguments)"
                @changeIsRight="jumpRight" :chooseMemebers="chooseMemebers"></SelectGroup>
            </div>
          </div>
        </div>
        <LinkInvite v-if="liveMode && liveMode !== 0 && navchoose == 2" @dismiss="cancelFn" :liveMode="liveMode"
          :initLiveInfo="initLiveInfo" :meetingObj="meetingObj">
        </LinkInvite>
        <CodeInvite v-if="liveMode && liveMode !== 0 && navchoose == 3" @dismiss="cancelFn" :liveMode="liveMode"
          :initLiveInfo="initLiveInfo" :meetingObj="meetingObj">
        </CodeInvite>
      </slot>
    </el-dialog>
  </div>
</template>
<script>
import Qs from "qs";
import axios from "axios";
import { baseUrl } from "../config.js";
import http from "../services/message";
import SelectRight from "./SelectRight.vue";
import LinkInvite from "./LinkInvite";
import CodeInvite from "./CodeInvite";
import SelectSearch from "./SelectSearch.vue";
import SelectGroup from './SelectGroup.vue';
import MemberSearch from "./MemberSearch";
export default {
  name: "SelectContact",
  props: [
    "isSelectContact",
    "selectType",
    "chatId",
    "chatType",
    "cardDetails",
    "zfDetails",
    "maxUser",
    "chooseMemebers",
    "liveMode",
    "type",
    "meetingObj",
    "initLiveInfo",
    "basic"
  ],
  components: {
    SelectRight,
    SelectSearch,
    SelectGroup,
    MemberSearch,
    LinkInvite,
    CodeInvite
  },
  data() {
    return {
      navchoose: 1,
      isRight: 0,//0:首页，1：我的群组，2:组织架构
      timeout: null,//输入框防抖
      warnTimeout: true,//最多选择50人提示节流
      createNewGroup: false,
      inputNameValue: "",
      inputGroupValue: "",
      isSearchResult: false,
      direction: "up",
      checkItemList: [],
      searchMemberList: [],
      chooseMemeberList: [],
      memberSum: 0,
      pageNo: 1,
      fixedMemberList: [],
      memberIds: [],
      groupIds: [],
      groupMemberList: [],
      isconfirmBtn: false,
      leaveValue: '',//留言
      directionImgSrc: require('../assets/images/up.svg'),
    };
  },
  methods: {
    changeNavItem(index) {
      this.navchoose = index;
    },
    jumpRight(data) {
      this.isRight = data;
    },
    changeDirectionFn() {
      if (this.direction == 'down') {
        this.directionImgSrc = require('../assets/images/up.svg')
        this.direction = 'up'
        this.$refs.structrueRef.style.display = 'flex'
      } else {
        this.directionImgSrc = require('../assets/images/down.svg')
        this.direction = 'down'
        this.$refs.structrueRef.style.display = 'none'
      }
    },
    changeMemlistFn(data) {
      if (data[0] == 'add') {
        this.chooseMemeberList.push(data[1])
      } else if (data[0] == 'delete') {
        this.chooseMemeberList.splice(data[1], 1)
      } else if (data[0] == 'userIds') {
        this.chooseMemeberList[data[1]].userIds = data[2];
      }
    },
    changeMemsumFn(data) {
      if (data[0]) {
        this.memberSum += data[1]
      } else {
        this.memberSum -= data[1]
      }
    },
    isShowChangeFn(index) {
      this.searchMemberList[index].isShow = false;
      this.searchMemberList[index].isChange = true;
      // this.$forceUpdate();
    },
    changeShowFn(data) {
      this.$set(this.searchMemberList[data[0]], "isShow", data[1]);
      // this.$forceUpdate();
    },
    //1是请求自己名片，2是请求他人名片
    getMemberDetails(data) {
      let paramas = {
        myId: this.myId,
        otherId: (data == 1 ? '' : this.chatId),
      };
      http
        .getMemberDetails(paramas)
        .then((res) => {
          if (res.data.code == 200) {
            this.fixedMemberList.push({
              type: 1,
              name: res.data.data.mainPage.name,
              id: res.data.data.mainPage.id,
            });
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSearch() {
      let paramas = {
        userId: this.myId,
        keyword: this.inputNameValue.trim(),
        pageNo: this.pageNo++,
        pageSize: 10,
      };
      http
        .getSearch(paramas)
        .then((res) => {
          if (res.data.code == 200) {
            res.data.data.list.forEach((item) => {
              item.isShow = false;
            });
            this.searchMemberList = this.searchMemberList.concat(
              res.data.data.list
            );
            this.isSearchResult =
              this.searchMemberList.length > 0 ? true : false;
          } else {
            console.log("err", res.data.message);
          }
        })
        .catch((err) => {
          this.isSearchResult = false;
          console.log(err);
        });
    },
    getInviteMember(data) {
      let url = baseUrl.serverUrl + "/front/group/inviteMembers";
      let criteria = {
        operationId: this.myId,
        groupId: this.chatId,
        userId: data,
      };
      axios({
        url: url,
        method: "post",
        // params: '必须是一个无格式对象 query参数',
        data: Qs.stringify(criteria),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((res) => {
          if (res.data.code == 200) {
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getCreateGroup(data) {
      let url = baseUrl.serverUrl + "/front/group/createGroupWithJsonParam";
      let criteria = {
        createUserId: this.myId,
        groupName: this.inputGroupValue,
        memberIds: data,
      };
      axios({
        url: url,
        method: "post",
        // params: '必须是一个无格式对象 query参数',
        data: criteria,
        // headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((res) => {
          if (res.data.success) {
            this.$busMeeting.$emit("createGroup", 1);
            let index = localStorage.getItem("topchatList")
              ? JSON.parse(localStorage.getItem("topchatList").length)
              : 0;
            this.meetingObj.listActive = index
          } else {
            this.$toast(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    confirmFn() {
      if (!this.isconfirmBtn) { return }
      if (
        (this.selectType == 1 && this.memberSum < 2) ||
        (this.selectType == 2 && this.memberSum < 1)
      ) {
        // this.$Message({
        //   message: "最少选择两名群成员",
        //   type: "warning",
        // });
        this.$message['warning']('最少选择两名群成员')
        return;
      }
      if (this.selectType == 1 || this.selectType == 2) {
        if (!this.inputGroupValue) {
          // this.$Message({
          //   message: "请输入群名称",
          //   type: "warning",
          // });
          this.$message['warning']('请输入群名称')
          return;
        }
      }
      this.chooseMemeberList.forEach((item) => {
        if (item.type == 1) {//组织
          this.memberIds = this.memberIds
            ? this.memberIds.concat(item.userIds)
            : item.userIds;
        } else if (item.type == 3) {//转发至群聊
          this.groupIds.push(item.id);
        } else {//个人
          this.memberIds.push(item.id);
        }
        this.memberIds = [...new Set(this.memberIds)];
        if (this.selectType !== 5) { //可转发给自己
          this.memberIds = this.memberIds.filter((item) => item != this.myId);
        }
      });
      if (this.selectType == 1) {
        //新添加群
        this.getCreateGroup(JSON.stringify(this.memberIds));
      } else if (this.selectType == 2) {
        //在好友对话框中建群
        this.fixedMemberList.forEach((item) => {
          if (item.id != this.myId) {
            this.memberIds.push(item.id);
          }
        });
        this.memberIds = [...new Set(this.memberIds)].filter(
          (item) => item != this.myId
        );
        this.getCreateGroup(JSON.stringify(this.memberIds));
      } else if (this.selectType == 3) {
        //在群中添加好友
        this.groupMemberList.forEach((item) => {
          this.memberIds = this.memberIds.filter(
            (itemin) => itemin !== item.imUserId
          );
        });
        this.getInviteMember(JSON.stringify(this.memberIds));
        this.$busMeeting.$emit("addGroupMember", true);
      } else if (this.selectType == 4) {
        //发送名片
        this.$busMeeting.$emit("sendCard", {
          cardDetails: this.cardDetails,
          memberIds: this.memberIds,
        });
      } else if (this.selectType == 5) {
        //转发消息
        // this.$busMeeting.$emit("sendZf", {
        //   zfDetails: this.zfDetails,
        //   memberIds: this.memberIds,
        //   groupIds:this.groupIds,
        //   leaveValue:this.leaveValue,
        // });

        //转发消息
        this.$busMeeting.$emit("sendZf", {
          zfDetails: this.zfDetails,
          memberIds: this.memberIds,
        });
      } else if (this.selectType == 6) {
        if (this.type == 1) {
          // 创建会议
          this.$emit('chooseMeetingMem', this.memberIds, this.groupIds)
        } else {
          //发起视频会议
          this.$busMeeting.$emit('sendZf', {
            groupIds: this.groupIds,
            memberIds: this.memberIds,
            memberDetailList: this.chooseMemeberList
          });
        }
      }
      this.$emit("closeSelectContact");
    },
    cancelFn() {
      this.$emit("closeSelectContact");
    },
    addMemberFn(item) {
      this.isSearchResult = false;
      if (
        this.chooseMemeberList.findIndex((itemin) => itemin.id == item.id) !==
        -1
      ) {
        // this.$Message({
        //   message: "重复添加无效",
        //   type: "warning",
        // });
        this.$message['warning']('重复添加无效')
        this.inputNameValue = "";
        return;
      }
      if (
        this.selectType == 3 && this.groupMemberList.findIndex(
          (itemin) => itemin.imUserId == item.id
        ) !== -1
      ) {
        this.inputNameValue = "";
        // this.$Message({
        //   message: item.name + "已存在",
        //   type: "warning",
        // });
        this.$message['warning'](item.name + "已存在")
        return;
      }
      this.inputNameValue = "";
      this.memberSum++;
      this.chooseMemeberList.push(item);
      this.$refs.inputNameRef.focus();
    },
    getGroupMembers() {
      let paramas = {
        myId: this.myId,
        groupId: this.chatId,
        pageNo: this.groupMemberList.length,
        pageSize: 40,
      };
      http
        .getGroupMembers(paramas)
        .then((res) => {
          if (res.data.code == 200) {
            if (res.data.data.list) {
              this.groupMemberList = this.groupMemberList.concat(res.data.data.list);
              this.getGroupMembers();
            }
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteMemeberFn(item, index) {
      this.add = false;
      this.chooseMemeberList.splice(index, 1);
      let indexin;
      if (indexin == -1 || item.type !== 1) {
        this.memberSum--;
      }
      if (this.isRight == 1) {
        indexin = this.$refs.selectGroup.deleteMem(item);
      } else {
        indexin = this.$refs.selectRight.deleteMem(item);
      }
    },
    inputNameFn() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (!this.inputNameValue) {
        this.isSearchResult = false;
        return;
      }
      this.timeout = setTimeout(() => {
        if (this.selectType && (this.selectType == 5 || this.selectType == 6)) {
          this.isSearchResult = true;
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.memSearch.refreshData(this.inputNameValue);
            });
          }, 300);
        } else {
          this.searchMemberList = [];
          this.pageNo = 1;
          this.getSearch();
        }
      }, 200)
    },
    scroll() {
      const scrollTop = this.$refs.searchResultRef.scrollTop;
      // 获取可视区的高度
      const windowHeight = this.$refs.searchResultRef.clientHeight;
      // 获取滚动条的总高度
      const scrollHeight = this.$refs.searchResultRef.scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight) {
        this.getSearch(); // 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
      }
    },
  },
  watch: {
    memberSum(newd) {
      if (
        (this.selectType == 1 && newd >= 2) ||
        (this.selectType == 2 && newd > 0) ||
        (this.selectType == 3 && newd > 0) ||
        (this.selectType == 4 && newd <= this.maxUser && newd > 0) ||
        (this.selectType == 5 && newd <= this.maxUser && newd > 0) ||
        (this.selectType == 6 && newd <= this.maxUser - this.chooseMemebers.length && newd > 0)
      ) {
        this.isconfirmBtn = true;
      } else {
        this.isconfirmBtn = false;
        if ((this.selectType == 4 && newd > this.maxUser) || (this.selectType == 5 && newd > this.maxUser)) {
          if (this.warnTimeout) {
            setTimeout(() => {
              // this.$Message({
              //   message: "最多只能选择50个人",
              //   type: "warning",
              // });
              this.$message['warning']("最多只能选择50个人")
              this.warnTimeout = true;
            }, 500);
            this.warnTimeout = false;
          }
        }
        // 视频会议邀请人超出时
        if (this.selectType == 6 && newd > this.maxUser - this.chooseMemebers.length) {
          if (this.warnTimeout) {
            setTimeout(() => {
              // this.$Message({
              //   message: `最多只能选择${this.maxUser}个人`,
              //   type: "warning",
              // });
              this.$message['warning'](`最多只能选择${this.maxUser - this.chooseMemebers.length}个人`)
              this.warnTimeout = true;
            }, 500);
            this.warnTimeout = false;
          }
        }
      }
    },
    isSelectContact(newd) {
      if (newd) {
        this.$nextTick(() => {
          this.$refs.inputNameRef.focus();
        });
      }
    },
    isSearchResult: {
      handler(newd) {
        if (newd) {
          this.$nextTick(() => {
            if (this.selectType == 1 || this.selectType == 2 || this.selectType == 5) {
              let searchdivHeight =
                this.$refs.searchdivRef.offsetHeight >= 196
                  ? 200
                  : this.$refs.searchdivRef.offsetHeight;
              let height = 445 - searchdivHeight + "px";
              this.$refs.searchResultRef.style.height = height;
              this.$refs.searchResultRef.addEventListener(
                "scroll",
                this.scroll
              );
            } else if (
              this.selectType == 3 ||
              this.selectType == 4 ||
              this.selectType == 6
            ) {
              let searchdivHeight =
                this.$refs.searchdivRef.offsetHeight >= 280
                  ? 280
                  : this.$refs.searchdivRef.offsetHeight;
              let height = 445 - searchdivHeight + "px";
              this.$refs.searchResultRef.style.height = height;
              this.$refs.searchResultRef.addEventListener(
                "scroll",
                this.scroll
              );
            }
          });
        }
      },
    },
  },
  created() {
    this.navchoose = (this.liveMode == 0 || this.liveMode == 1 && this.meetingObj.userType !== -1) ? 1 : 2;
    this.myId = this.meetingObj.userId;
    // if (this.selectType == 2) {
    //   this.getMemberDetails(1);
    //   this.getMemberDetails(2);
    // } else if (this.selectType == 3) {
    //   this.getGroupMembers();
    //   this.inputGroupValue = imMethods.getGroup(this.chatId).groupName;
    // }
    // else if (this.selectType == 4 || this.selectType == 5) {
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.inputNameRef.focus();
    })
  },
};
</script>
<style lang="less" scoped>
.main {
  ::v-deep .el-dialog {
    border-radius: 10px;
  }

  ::v-deep .el-dialog__header {
    display: flex;
    background: #f5f6f8;
    padding: 19px 31px 16px 30px;
    border-radius: 10px 10px 0 0;
  }

  ::v-deep .el-dialog__title {
    font-size: 16px;
    font-weight: 500;
    color: #17181a;
    line-height: 22px;
  }

  ::v-deep .el-dialog__headerbtn {
    top: auto !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0;
    // display: flex;
    // height: 488px;
  }

  .nav {
    display: flex;
    padding: 20px 30px 0;

    .navItem {
      margin-right: 24px;

      span {
        font-size: 16px;
        line-height: 24px;
        cursor: pointer;
      }

      .active {
        color: #1890FF;
        font-weight: 500;
      }

      .navborder {
        border-bottom: 2px solid #1890FF;
        margin-top: 10px;
      }
    }
  }

  .innerInvite {
    display: flex;
    height: 488px;
    width: 100%;
  }
}

.dialogLeftOne {
  width: 50%;
  display: flex;
  flex-direction: column;

  .searchMember {
    scrollbar-width: none;
    height: 205px;
    padding: 16px 13px 6px 30px;
    flex-direction: column;
    overflow-y: scroll;

    .searchdiv {
      display: flex;
      flex-flow: wrap;
      align-items: center;
      position: relative;

      .fixedMember {
        border: 1px solid #eff0f1;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        background: #f2f2f6;
        padding: 4px 6px;
        margin: 3px 8px 3px 0;
      }
    }

    .chooseMember {
      display: flex;
      align-items: center;
      flex-flow: wrap;

      .memberItem {
        background: #f2f2f6;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding: 3px 8px;
        margin: 3px 8px 3px 0;
        height: fit-content;

        .memberName {
          font-size: 12px;
          font-weight: 500;
          color: #333333;
          line-height: 20px;
          margin-right: 8px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .deleteImg {
          width: 12px;
          height: 12px;
          cursor: pointer;
        }
      }
    }

    ::v-deep .el-input {
      position: relative;
      width: 90px;
    }

    ::v-deep input {
      border: 0;
      width: 100%;
      padding: 0;
      font-size: 14px;
      color: rgba(23, 26, 29, 0.5);
    }

    ::v-deep .el-input__inner {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #666666;
      background: #fff;
    }

    .searchResult {
      scrollbar-width: none;
      background: #ffffff;
      border: 1px solid #eff0f1;
      box-shadow: 0px 2px 4px 0px;
      border-radius: 6px;
      margin-top: 7px;
      padding: 11px 0;
      z-index: 2000;
      overflow-y: scroll;
      overflow-x: hidden;
      position: absolute;
      bottom: 20px;
      width: 300px;
      box-sizing: border-box;
    }

    .searchResult ::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }
  }

  .leaveBox {
    padding: 10px 19px 24px 30px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .leaveMes {
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      padding: 5px 8px;
      background: #F2F2F2;
      border-radius: 4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .underLine {
      border-bottom: 1px solid #f2f2f2;
      margin: 8px 0 16px 0;
    }

    ::v-deep .el-textarea {
      flex: 1;
    }

    ::v-deep .el-textarea__inner {
      min-height: 90% !important;
      resize: none;
      border: none;
    }

    // ::v-deep .el-input__inner{
    //   padding: 0;
    //   background: #fff;
    // }
    // .none{
    //   flex: 1;
    // }
  }

  .groupName {
    padding: 0 19px 24px 30px;
    height: 260px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: flex-end;

    .lineBottom {
      width: 100%;
      border-bottom: 1px solid #eff0f1;
      margin-bottom: 16px;
    }

    .groupTitle {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 22px;
    }

    .el-input {
      flex: 1;
    }

    ::v-deep .el-input__inner {
      height: 31px;
      line-height: 31px;
      border: 1px solid #eff0f1 !important;
      padding: 0 12px;
      font-size: 14px;
      color: #666666;
      border-radius: 4px;
      background: #fff;
      width: 100%;
    }
  }
}

.dialogLeftThree {
  width: 50%;
  display: flex;
  flex-direction: column;

  .searchMember {
    scrollbar-width: none;
    max-height: 280px;
    padding: 16px 13px 6px 30px;
    flex-direction: column;
    overflow-y: scroll;

    .searchdiv {
      display: flex;
      flex-flow: wrap;
      align-items: center;
      position: relative;
    }

    .chooseMember {
      display: flex;
      align-items: center;
      flex-flow: wrap;

      .memberItem {
        background: #f2f2f6;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding: 3px 8px;
        margin: 3px 8px 3px 0;
        // height: 20px;
        height: fit-content;

        .memberName {
          font-size: 12px;
          font-weight: 500;
          color: #333333;
          line-height: 20px;
          margin-right: 8px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .deleteImg {
          width: 12px;
          height: 12px;
          cursor: pointer;
        }
      }
    }

    ::v-deep .el-input {
      position: relative;
      width: 155px;
    }

    ::v-deep input {
      border: 0;
      width: 100%;
      padding: 0;
      font-size: 14px;
      color: rgba(23, 26, 29, 0.5);
    }

    ::v-deep .el-input__inner {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #666666;
      background: #fff;
    }

    .searchResult {
      scrollbar-width: none;
      background: #ffffff;
      border: 1px solid #eff0f1;
      box-shadow: 0px 2px 4px 0px;
      border-radius: 6px;
      margin-top: 7px;
      padding: 11px 0;
      z-index: 2000;
      overflow-y: scroll;
      overflow-x: hidden;
      position: absolute;
      bottom: 20px;
      width: 300px;
      box-sizing: border-box;
    }
  }

  .middleBox {
    flex: 1;
  }

  .buttonBox {
    padding: 0 19px 24px 30px;
  }
}

.confirmButton {
  margin-right: 12px;
  border-radius: 4px;
  width: 123px;
  height: 36px;
  font-size: 14px;
  color: #ffffff;
  border: 0;
}

.canconfirmButton {
  background: #1890ff !important;
}

.notconfirmButton {
  background: #8ec0fa !important;
  color: #bcd9fb !important;
}

.concelButton {
  height: 36px;
  font-size: 14px;
  border: 1px solid #eff0f1;
  border-radius: 4px;
  color: #000;
  background: #ffffff;
  width: 84px;
}

.dialogRight {
  display: flex;
  width: 50%;

  .line {
    border-right: 1px solid #eff0f1;
  }

  .structureMain {
    width: calc(100% - 1px);

    .myGroup {
      display: flex;
      align-items: center;

      .groupImg {
        width: 41px;
        height: 41px;
        margin: 10px 14px 10px 24px;
      }

      .groupName {
        color: #000;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
      }
    }

    .company {
      display: flex;
      align-items: center;

      .companyImg {
        width: 41px;
        height: 41px;
        margin: 10px 14px 10px 24px;
      }

      .companyName {
        color: #000;
        // text-align: center;
        font-size: 14px;
        line-height: 20px;
        flex: 1;
        text-align: left;
      }

      .directionImg {
        width: 10px;
        height: 10px;
        margin-right: 36px;
      }
    }

    .structure {
      display: flex;
      align-items: center;
      transition: all 0.5s ease 0s;
      background: #fff;
      border-radius: 4px;

      .strImg {
        width: 10px;
        height: 10px;
        margin: 0 27px 0 22px;
      }

      .strName {
        color: #000;
        letter-spacing: 0.2px;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }

  .structureChoose {
    width: calc(100% - 1px);
  }

  .groupList {
    width: calc(100% - 1px);
  }
}

&::placeholder {
  color: #afafb0;
  font-size: 14px;
}

::v-deep input::-webkit-input-placeholder,
::v-deep textarea::-webkit-input-placeholder {
  /* WebKit browsers 适配谷歌 */
  color: #afafb0;
  font-size: 14px;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 适配火狐 */
  color: #afafb0;
  font-size: 14px;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
  /* Mozilla Firefox 19+ 适配火狐 */
  color: #afafb0;
  font-size: 14px;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  /* Internet Explorer 10+  适配ie*/
  color: #afafb0;
  font-size: 14px;
}

.searchMember::-webkit-scrollbar {
  display: none;
}
</style>