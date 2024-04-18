<template>
  <div class="main">
    <el-dialog
      title="提示"
      :visible.sync="isRecall"
      width="421px"
      top="261px"
      :before-close="cancelFn"
      
    >
      <div class="dialogMain">
        <div class="bodyTop">呼叫{{reCallUser.remark}}</div>
        <div class="bodyBottom">
          <button class="dismissBtn" @click="reCallFn">呼叫</button>
          <button class="cancelBtn" @click="cancelFn">取消</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import requestJpaas from '../tools/jpaas_request'
import { jmeetingWebAPI } from '../services/jmeeting'
export default {
  name: "ReCall",
  props: ["liveId","userId"],
  data() {
    return {
      isRecall:false,
      reCallUser:{},//重新呼叫人员信息
    };
  },
  methods: {
    open(item){
      this.isRecall = true ;
      this.reCallUser = item ;
    },
    reCallFn(item,flag) {
      this.$emit("confirmGroupRecall");
      let that = this
      if (flag) {
        that.reCallUser = item;
      }
      that.isRecall = false;
      console.log('重新呼叫')
      jmeetingWebAPI
        .addMeetingPeople({jmeeting: that.userId},{
          // jmeeting:that.userId,
          jmeeting:'12345678901234567890123456789012',
          groupIds: [],
          friendIds: [that.reCallUser.id],
          mechanismId: [],
          liveId: that.liveId,
          myId: that.userId,
          reCall: true,
        })
        .then((res) => {
          if (res.success) {
          } else {
            this.$message['warning'](res.message)
          }
        })
        .catch((err) => {
          console.log(`邀请err`, err)
        })
    },
    cancelFn() {
      this.isRecall = false ;
    },
  },
  watch: {
  },
  created() {},
  mounted() {},
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
      width: 84px;
      height: 36px;
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

