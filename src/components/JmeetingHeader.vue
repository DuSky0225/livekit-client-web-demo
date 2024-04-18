<template>
  <div class='clearfix'>
    <div class="topTitle" v-if="$basic.homepageHeader && jmeetingHeader == 'true'">
      <div class="topIcon">
        <img :src="$basic.jmeetingIcon ? $basic.jmeetingIcon : require('../assets/meeting/company.png')" alt="">
        <span>{{ $basic.jmeetingName }}</span>
      </div>
      <div class="flex">
        <div class="flex client pointer" @click="jumpDown()">
          <img src="../assets/meeting/computerIcon.png" alt="">
          <span>体验客户端</span>
        </div>
        <div class="divider"></div>
        <div class="userImg" @click.stop="actionShow"
          :style="userAgent.indexOf('jmeeting') > -1 ? 'cursor: pointer;' : ''">
          <img :src="user.img ? user.img : require('../assets/ic_default_avatar.png')" alt="">
          <span v-if="user.userName.length < 4">{{ user.userName }}</span>
          <span class="relative" v-else>{{ user.userName.slice(0, 3) + '...' }}
            <a class="noneName">{{ user.userName }}</a>
          </span>
          <div class="userBtns" v-if="isShowUserOperate">
            <!-- <span class="pointer" @click="$refs.modal.edit(1, user.img)">修改头像</span> -->
            <span class="pointer" @click="loginOut()">退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <AvatarModal ref="modal" @uploadSuccess="uploadSuccess"></AvatarModal>
  </div>
</template>
<script>
import AvatarModal from "./AvatarModal.vue";
import { accountAPI } from '../api/account/account';
import { tools } from "../tools/tool";
export default {
  components: {
    AvatarModal
  },
  props: {
    jmeetingHeader: {
      type: String,
      required: false,
      default: 'true'
    },
    user: {
      type: Object,
      required: true,
      default: {
        img: "",
        userName: "",
      }
    }
  },
  data() {
    return {
      userAgent: navigator.userAgent.toLowerCase(),
      electron: false,
      isShowUserOperate: false,
    };
  },
  mounted() {
    // 判断是否在盒子
    let userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('electron') > -1) {
      this.electron = true;
    }
  },
  methods: {
    // 退出登录
    loginOut() {
      const that = this
      this.$confirm({
        title: '退出登录',
        content: '您确定要退出登录吗 ?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          return accountAPI.logout().then(() => {
            console.log('退出登录');
            tools.removeCookie("access-token");
            tools.removeCookie("userName");
            tools.removeCookie("userId");
            // 会议中时关闭会议
            if (that.electron) {
              // window.electron.closeMeeting(location.href)
              window.electron.logout()
            }
            let sign = sessionStorage.getItem('jmeetingSign');
            if (sign == 'work') {
              that.backHome()
            } else {
              that.$router.replace({
                name: "boxLogin"
              })
            }

          })
        }
      })
    },
    backHome() {
      accountAPI.logout({
      }).then(res => {
        if (res.success) {
          // 清除缓存
          let host = window.location.host == "meeting.hanweb.com" ? "work.hanweb.com" : window.location.host;
          document.cookie = 'access-token' + "=" + "" + "; domain=" + host + "; path=/";
          document.cookie = 'access-token' + "=" + "" + "; domain=." + host + "; path=/";
          let backUrl = res.data.redirecturl;
          location.replace(backUrl)
        }
      })
    },
    // 更新头像
    uploadSuccess(uploadSuccess) {
      this.isShowUserOperate = false;
      let headPath = uploadSuccess.split(',')[0] + '?r=' + new Date().getMilliseconds();
      if (headPath === '' || headPath === null) {
        this.user.img = process.env.BASE_URL + 'images/avator.png'
      } else {
        this.user.img = headPath.split(',')[0]
      }
    },
    jumpDown() {
      const { href } = this.$router.resolve({
        name: "download",
      });
      window.open(href, '_blank');
    },
    actionShow() {
      // let userAgent = navigator.userAgent.toLowerCase()
      // if (userAgent.indexOf('jmeeting') > -1) {
      this.isShowUserOperate = true;
      // }
    },
  },
};
</script>
<style lang="less" scoped>
.topTitle {
  padding: 15px 0;
  margin: 0 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ebeced;
}

.topIcon {
  display: flex;
  align-items: center;

  img {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    margin-right: 8px;
  }

  span {
    font-family: AlibabaPuHuiTiB, Helvetica, Arial, Verdana, Tahoma, sans-serif;
    font-size: 21.6px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 700;
  }
}

.flex {
  display: flex;
  align-items: center;
  position: relative;
}

.client {
  padding: 2px 6px;
  background: #eff1f1;
  border-radius: 4px;

  img {
    width: 14px;
    height: 12px;
    margin-right: 8px;
  }

  span {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #171a1d;
    font-weight: 400;
  }
}

.divider {
  width: 1px;
  height: 22px;
  background: #ebeced;
  margin: 0 12px;
}

.userImg {
  display: flex;
  align-items: center;
  position: relative;

  img {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    margin-right: 8px;
  }

  span {
    font-family: PingFangSC-Medium, Helvetica, Arial, Verdana, Tahoma,
      sans-serif;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
  }

  .relative {
    position: relative;

    &:hover .noneName {
      display: block;
    }
  }

  .noneName {
    min-width: 100px;
    background: #ffffff;
    padding: 12px;
    font-family: PingFangSC-Medium, Helvetica, Arial, Verdana, Tahoma,
      sans-serif;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
    display: none;
    position: absolute;
    top: 24px;
    left: -10px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    z-index: 2000;
    line-height: 1.4;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    word-break: break-all;
  }

  .userBtns {
    position: absolute;
    // bottom: -84px;
    bottom: -52px;
    left: -20px;
    width: 100px;
    padding: 4px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.12);
    border-radius: 8px;

    span {
      width: 92px;
      display: inline-block;
      padding-left: 8px;
      height: 33px;
      text-align: left;
      line-height: 33px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      font-weight: 400;
      border-bottom: 92px;

      &:hover {
        cursor: pointer;
      }

      &:active {
        background: #eff1f1;
        border-radius: 4px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
      }
    }
  }
}
</style>