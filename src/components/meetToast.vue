<template>
  <div class="main" v-if="isMeetToast">
    <el-dialog title="提示" :visible.sync="isMeetToast" width="421px" top="261px" :close-on-click-modal="false">
      <div class="dialogMain">
        <div class="bodyTop">{{ toastText }}</div>
        <div class="bodyBottom">
          <button class="dismissBtn pointer" @click="goDown">下载{{ $basic.jmeetingName }}</button>
          <button class="cancelBtn pointer" @click="cancelFn">我知道了</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { accountAPI } from '../api/account/account';
export default {
  name: "MeetToast",
  // props: ,
  data() {
    return {
      isMeetToast: false,
      // toastText: '暂不支持在网页端发起音视频通话/会议，请使用微联叮客户端/桌面端获得完整体验'
      toastText: '',
    };
  },
  methods: {
    open(type) {
      // let sign = sessionStorage.getItem('jmeetingSign');
      // let appName = sign == 'work' ? '微联叮' : basic.jmeetingName;
      if (type == 'preview') {
        this.toastText = `暂不支持在网页端发起音视频通话/会议，请使用${basic.jmeetingName}客户端/桌面端获得完整体验`
      }
      this.isMeetToast = true;
    },
    goDown() {
      // let sign = sessionStorage.getItem('jmeetingSign');
      // if (sign == 'work') {
      //   this.jumpImApk()
      // } else {
        const { href } = this.$router.resolve({
          name: "download",
        });
        window.open(href, '_blank');
      // }
      this.isMeetToast = false;
    },
    cancelFn() {
      this.isMeetToast = false;
    },
    jumpImApk() {
      accountAPI.downLoad({
        systemType: "0"
      }).then(res => {
        // console.log(res);
        if (res.success) {
          window.open(res.data.imDownloadPageUrl, '_blank')
        } else {
          this.$toast(res.message)
        }
      })

    }
  },
  watch: {
  },
  created() {
    this.toastText = `暂不支持在网页端发起音视频通话/会议，请使用${basic.jmeetingName}客户端/桌面端获得完整体验`
  },
  mounted() { },
};
</script>
<style lang="less" scoped>
.main {
  ::v-deep .el-dialog {
    border-radius: 10px;
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
  }

  ::v-deep .el-dialog__headerbtn {
    top: auto !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0;
    display: flex;
  }
}

.dialogMain {
  width: 100%;

  .bodyTop {
    padding: 30px 26px 29px 30px;
    font-size: 14px;
    color: #000000;
    border-bottom: 1px solid #eff0f1;
  }

  .bodyBottom {
    padding: 8px 0;
    display: flex;
    justify-content: flex-end;

    button {
      background: #1677ff;
      border-radius: 4px;
      font-size: 14px;
      color: #ffffff;
      // width: 84px;
      // height: 36px;
      padding: 8px 12px;
    }

    .dismissBtn {
      background: #1890ff;
    }

    .cancelBtn {
      background: #f5f6f7;
      border: 1px solid #eff0f1;
      color: #000;
      margin: 0 24px 0 12px;
    }
  }
}
</style>
