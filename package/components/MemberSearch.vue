<template>
  <div :class="selectType && (selectType==5 || selectType==6) ? 'selectMain main' :'main'">
    <div class="tabs">
      <div class="tabItem" @click.stop="onTab(0)">
        <div class="tab" :class="tabindex == 0 ? 'tabActive' : ''">综合</div>
        <div
          class="tabBorder"
          :class="tabindex == 0 ? 'tabBorderActive' : ''"
        ></div>
      </div>
      <div class="tabItem" @click.stop="onTab(1)">
        <div class="tab" :class="tabindex == 1 ? 'tabActive' : ''">联系人</div>
        <div
          class="tabBorder"
          :class="tabindex == 1 ? 'tabBorderActive' : ''"
        ></div>
      </div>
      <div class="tabItem" @click.stop="onTab(2)">
        <div class="tab" :class="tabindex == 2 ? 'tabActive' : ''">群组</div>
        <div
          class="tabBorder"
          :class="tabindex == 2 ? 'tabBorderActive' : ''"
        ></div>
      </div>
    </div>
    <div class="line"></div>
    <div class="search-list" v-if="tabindex == 0">
      <div v-if="contactList.length > 0">
        <div class="titleName">联系人</div>
        <div
          class="service"
          v-for="(item, i) in contactList"
          :key="i"
          @click="toNext(item, 1)"
        >
          <img
            resize="contain"
            class="navImg"
            :src="item.icon ? item.icon : avatarImg"
            :onerror="errorImage"
            alt=""
          />
          <div class="navright">
            <p class="serviceName">
              <span v-html="eachColor(item.name, searchKeyword)"></span>
              <span>(</span>
              <span v-html="eachColor(item.userName, searchKeyword)"></span>
              <span>)</span>
            </p>
            <p v-if="item.userPosition" class="servicePosition">
              {{ item.userPosition }}
            </p>
            <p
              ref="serviceGroup"
              v-if="item.hierarchicalOrganization"
              :class="item.isShow ? 'notserviceGroup' : 'serviceGroup'"
            >
              <span>{{ getOrganization(item.hierarchicalOrganization) }}</span>
              <img
                @click.stop="isShowChangeFn(i)"
                v-if="item.isShow"
                src="../assets/images/showmore.svg"
                alt=""
              />
            </p>
          </div>
        </div>
        <div class="more-main" @click="onTab(1)">
          <div class="more-left">
            <img class="search-img" :src="moreImg" alt="" />
            <div class="more-text">查看更多</div>
          </div>
          <img class="downImg" :src="jumpImg" alt="" />
        </div>
      </div>
      <div v-if="memberList.length > 0">
        <div class="titleName">我的群组</div>
        <div>
          <div
            class="service"
            v-for="(its, j) in memberList"
            :key="j"
            @click="toNext(its, 2)"
          >
            <img
              resize="contain"
              class="navImg"
              :src="its.groupNick ? its.groupNick : avatarImg"
              alt=""
            />
            <div
              class="serviceName navright"
              v-html="eachColor(its.groupName, searchKeyword)"
            ></div>
          </div>
          <div class="more-main" v-if="tabindex == 0" @click="onTab(2)">
            <div class="more-left">
              <img class="search-img" :src="moreImg" alt="" />
              <div class="more-text">查看更多</div>
            </div>
            <img class="downImg" :src="jumpImg" alt="" />
          </div>
        </div>
      </div>
      <div
        class="nodata"
        v-if="contactList.length == 0 && memberList.length == 0"
      >
        {{ searchKeyword == "" ? "输入关键词开始搜索" : "已显示全部数据" }}
      </div>
    </div>
    <div class="search-list" v-else>
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="已显示全部数据"
        offset="20"
        v-if="userList && userList.length > 0"
        @load="loadData(0)"
      >
        <div
          class="service"
          v-for="(item, index) in userList"
          :key="index"
          @click="toNext(item, tabindex)"
        >
          <img
            resize="contain"
            class="navImg"
            alt=""
            :src="
              tabindex == 1
                ? item.icon
                  ? item.icon
                  : avatarImg
                : item.groupNick
                ? item.groupNick
                : avatarImg
            "
            :onerror="errorImage"
          />
          <div class="navright">
            <p class="serviceName">
              <span
                v-html="
                  eachColor(
                    tabindex == 1 ? item.name : item.groupName,
                    searchKeyword
                  )
                "
              ></span>
              <span v-if="tabindex == 1">(</span>
              <span
                v-if="tabindex == 1"
                v-html="
                  eachColor(
                    tabindex == 1 ? item.userName : item.groupName,
                    searchKeyword
                  )
                "
              ></span>
              <span v-if="tabindex == 1">)</span>
            </p>
            <p v-if="item.userPosition" class="servicePosition">
              {{ item.userPosition }}
            </p>
            <p
              ref="serviceGroup"
              v-if="item.hierarchicalOrganization"
              :class="item.isShow ? 'notserviceGroup' : 'serviceGroup'"
            >
              <span>{{ getOrganization(item.hierarchicalOrganization) }}</span>
              <img
                @click.stop="isShowChangeFn(index, 'userList')"
                v-if="item.isShow"
                src="../assets/images/showmore.svg"
                alt=""
              />
            </p>
          </div>
        </div>
      </van-list>
      <div class="nodata" v-if="userList.length == 0 && !isRequest">
        {{ searchKeyword == "" ? "输入关键词开始搜索" : "已显示全部数据" }}
      </div>
    </div>
  </div>
</template>
<script>
import http from "../services/message";
export default {
  name: "search",
  props: ["userId", "keyword","selectType"],
  data() {
    return {
      contactList: [],
      memberList: [],
      userList: [],
      tabindex: 0,
      searchKeyword: this.keyword,
      pageNo: 1,
      pageSize: 10,
      isShowNoData: false,
      loading: false,
      finished: false,
      refreshing: false,
      isRequest: true,
      avatarImg: require("../assets/images/ic_default_avatar.png"),
      moreImg: require("../assets/images/img_search_more.png"),
      jumpImg: require("../assets/images/jump.png"),
      errorImage:
        ' this.src=" ' + require("../assets/images/ic_default_avatar.png") + ' " ',
    };
  },
  created() {
    if (this.searchKeyword != undefined && this.searchKeyword != "") {
      this.loading = true;
      this.onTab(0);
    }
  },
  methods: {
    isShowChangeFn(index, data) {
      if (data && data == "userList") {
        this.userList[index].isShow = false;
        this.userList[index].isChange = true;
      } else {
        this.contactList[index].isShow = false;
        this.contactList[index].isChange = true;
      }
      this.$forceUpdate();
    },
    getOrganization(data) {
      let dataj = JSON.parse(data);
      let organization = dataj[0];
      dataj.forEach((item, index) => {
        if (index != 0) {
          organization = organization + "-" + item;
        }
      });
      return organization;
    },
    //搜索结果关键字改变颜色
    eachColor(content, searchVal) {
      let nt = '<span style = "color:#0078EF">' + searchVal + "</span>";
      return content.replace(searchVal, nt) + "&nbsp;";
    },
    onTab(index) {
      this.tabindex = index;
      this.pageNo = 1;
      this.pageSize = 10;
      this.userList = [];
      this.loading = false;
      this.finished = false;
      this.isRequest = true;
      if (index == 0) {
        this.getUser(1, 3, this.searchKeyword);
        this.getMember(1, 3, this.searchKeyword);
      } else if (index == 1) {
        this.getUser(this.pageNo, this.pageSize, this.searchKeyword);
      } else if (index == 2) {
        this.getMember(this.pageNo, this.pageSize, this.searchKeyword);
      }
    },
    refreshData(words) {
      this.searchKeyword = words;
      this.onTab(this.tabindex);
    },
    toNext(item, index) {
      this.$emit("hide", true);
      if (index == 1) {
        if(this.selectType && (this.selectType == 5 || this.selectType ==6)){
          this.$emit('addMember', {
            name: item.name,
            id: item.id,
            type: 2,
          });
        }else{
          this.$busMeeting.$emit("jumpMemberId", item.id);
        }
      } else if (index == 2) {
        if(this.selectType && this.selectType == 5 || this.selectType ==6){
          this.$emit('addMember',{
            name: item.groupName,
            id: item.iid,
            type: 3,
          });
        }else{
          this.$busMeeting.$emit("jumpGroupId", item.iid);
        }
      }
    },
    loadData() {
      this.pageNo++;
      if (this.tabindex == 1) {
        this.getUser(this.pageNo, this.pageSize, this.searchKeyword);
      } else {
        this.getMember(this.pageNo, this.pageSize, this.searchKeyword);
      }
    },
    getUser(pageNo, pageSize, keyword) {
      if (keyword == "") {
        if (this.tabindex == 0) {
          this.contactList = [];
        } else {
          this.userList = [];
          this.isRequest = false;
        }
        return;
      }
      let paramas = {
        userId: this.userId,
        keyword,
        pageNo,
        pageSize,
      };
      http
        .getSearch(paramas)
        .then((res) => {
          this.loading = false;
          if (res.data.code == 200) {
            if (JSON.stringify(res.data.data) == "{}") {
              this.finished = false;
            } else {
              if (this.tabindex == 0) {
                this.contactList = res.data.data.list;
                this.contactList.forEach((item) => {
                  item.isShow = false;
                });
                this.$nextTick(() => {
                  this.contactList.forEach((item, index) => {
                    if (
                      !item.isChange && this.$refs.serviceGroup[index]&&
                      this.$refs.serviceGroup[index].offsetHeight > 20
                    ) {
                      this.$set(this.contactList[index], "isShow", true);
                    }
                  });
                  this.$forceUpdate();
                });
              } else {
                this.isRequest = false;
                res.data.data.list.forEach((item) => {
                  item.isShow = false;
                });
                let list = res.data.data.list;
                this.userList = [...this.userList, ...list];
                if (list.length < this.pageSize) {
                  this.finished = true;
                }
                this.$nextTick(() => {
                  this.userList.forEach((item, index) => {
                    if (
                      !item.isChange && this.$refs.serviceGroup[index] &&
                      this.$refs.serviceGroup[index].offsetHeight > 20
                    ) {
                      this.$set(this.userList[index], "isShow", true);
                    }
                  });
                  this.$forceUpdate();
                });
              }
            }
          } else {
            this.isRequest = false;
          }
        })
        .catch(() => {
          this.loading = false;
          this.finished = true;
          this.isRequest = false;
        });
    },
    getMember(pageNo, pageSize, keyword) {
      if (keyword == "") {
        if (this.tabindex == 0) {
          this.memberList = [];
        } else {
          this.userList = [];
          this.isRequest = false;
        }
        return;
      }
      let paramas = {
        userId: this.userId,
        keyword,
        pageNo,
        pageSize,
      };
      http
        .getSearchMember(paramas)
        .then((res) => {
          if (res.data.code == 200) {
            if (JSON.stringify(res.data.data) == "{}") {
              this.finished = false;
            } else {
              if (this.tabindex == 0) {
                this.memberList = res.data.data.list;
              } else {
                this.isRequest = false;
                let list = res.data.data.list;
                this.userList = [...this.userList, ...list];
                if (list.length < this.pageSize) {
                  this.finished = true;
                }
              }
            }
          } else {
            this.isRequest = false;
          }
        })
        .catch(() => {
          this.loading = false;
          this.finished = true;
          this.isRequest = false;
        });
    },
  },
  watch: {
    keyword(val) {
      this.searchKeyword = val;
    },
  },
};
</script>
<style lang="less" scoped>
p {
  margin-bottom: auto !important;
}
.main {
  display: flex;
  flex-direction: column;
  // width: 343px;
  width: 100%;
  box-sizing: border-box;
}

.search-list {
  height: 400px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: 9px;
  overflow-y: scroll;
  scrollbar-width: none;
}

.search-list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.search-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background: #d0d0d0;
}

.search-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 10px;
  background: #ededed;
}

.tabItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.tabs {
  display: flex;
  padding: 8px 11px 3px;
  flex-direction: row;
  align-items: center;
}

.tab {
  padding: 6px 14px;
  font-family: PingFangSC-Regular,Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  font-weight: 400;
}

.tabBorder {
  height: 3px;
  width: 20px;
}

.tabActive {
  color: #000000;
}

.tabBorderActive {
  background-color: #000000;
  color: #000000;
}

.line {
  height: 1px;
  background-color: #e8e8e8;
}

.titleName {
  margin: 8px 16px 0;
  font-family: PingFangSC-Semibold,Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #eff0f1;
}

.service {
  display: flex;
  flex-direction: row;
  align-items: start;
  box-sizing: border-box;
  padding: 12px 16px 0;
  // width: 320px;
  margin: 0px 16px 0 9px;
  cursor: pointer;
}

.service:hover {
  opacity: 0.69;
  background: #f2f2f2;
  border-radius: 8px;
  margin: 0px 16px 0 9px;
}

.navImg {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 8px;
}
.navright{
  width: 100%;
  min-height: 41px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eff0f1;
}
.serviceName {
  font-family: PingFangSC-Regular,Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
}
.serviceGroup {
  font-size: 12px;
  color: #909396;
}
.notserviceGroup {
  font-size: 12px;
  color: #ad9c9f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    // width: 460px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  img {
    width: 16px;
    height: 16px;
  }
}
.servicePosition {
  font-family: PingFangSC-Regular,Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 12px;
  line-height: 17px;
  color: #747679;
}
.user-list {
  height: 400px;
  overflow: auto;
}

.more-main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 9px 0;
  margin: 0 16px;
  border-bottom: 1px solid #eff0f1;
  cursor: pointer;
}

.more-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-img {
  width: 12px;
  height: 12px;
}

.more-text {
  font-family: PingFangSC-Regular,Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #0078ef;
  text-align: center;
  font-weight: 400;
  margin-left: 9px;
}

.downImg {
  width: 12px;
  height: 12px;
}

.nodata {
  color: #969799;
  margin-top: 100px;
  text-align: center;
  font-size: 14px;
}
.selectMain{
  width: 100%;
  .service{
    width: 100% !important;
    margin: 0 !important;
  }
  .service:hover{
    margin: 0 !important;
  }
  .notserviceGroup{
    span{
      width: 200px;
    }
  }
}
</style>
