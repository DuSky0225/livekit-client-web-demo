<template>
  <div>
    <ul v-show="ishow" class="list" v-infinite-scroll="playbackList" infinite-scroll-disabled="loading">
      <li class="line" v-for="item in list" :key="item.playbackId" @click="jumpDetails(item)">
        <div class="videoBox">
          <img lazy-load class="videoImg" :src="item.coverImageAddress" :onerror="errorImage" alt="">
          <p class="duration1" v-if="item.playbackStatus != 0">{{ item.playbackDuration }}</p>
        </div>
        <div class="intro">
          <div class="center">
            <!-- <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ item.meetingName }}</span>
                  </template>
                  <h3>{{ item.meetingName }}</h3>
                </a-tooltip> -->
            <h3>{{ item.meetingName }}</h3>
            <span v-if="item.playbackStatus == 0">生成中</span>
          </div>
          <p><span>{{ item.meetingHost }}</span><span>{{ item.playbackSize }}</span></p>
        </div>
      </li>
    </ul>
    <div class="nodata" v-show="!ishow">
      <img src="../assets/images/nodata.png" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import { jmeetingWebAPI } from "../services/playBackAPI";
export default {
  props: ['listType'],
  data() {
    return {
      userId: "",
      loading: true,
      pageNo: 1,
      list: [],
      ishow: true,
      errorImage:
        ' this.src=" ' + require('../assets/images/defaultVideo.jpg') + ' " ',
    };
  },
  created() {
    this.userId = Cookies.get('userId')
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    // 录制回放列表
    playbackList() {
      this.loading = true;
      jmeetingWebAPI.playbackList({
        userId: this.userId,
        listType: this.listType,//回放列表类型 0：归我所有 1：与我共享
        pageNo: this.pageNo,
        pageSize: 10,
        jmeeting: '12345678901234567890123456789012',
      }).then(res => {
        if (res.success) {
          if (this.pageNo == 1 && res.data.list.length == 0) {
            this.ishow = false
            return
          }
          this.pageNo++;
          this.ishow = true;
          if (res.data.list.length) {
            this.loading = false
          } else {
            this.loading = true
          }
          this.list.push(...res.data.list);
        } else {
          this.$message.error(res.message)
        }
      })
    },
    jumpDetails(item) {
      if (item.playbackStatus == 0) {
        this.$message.warn('录制文件还在生成中，请稍后再试！');
        return
      }
      this.$router.push({
        name: 'playbackDetails',
        query: {
          iid: item.playbackId
        }
      })
    }
  },
};
</script>
<style lang="less" scoped>
.nodata {
  margin-top: 24vh;
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
  }
}

.list {
  width: calc(100% + 16px);
  height: calc(100vh - 106px);
  overflow: auto;
  padding-top: 16px;
  margin: 0;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.line {
  display: inline-block;
  margin: 0 16px 16px 0;
  width: 18%;
  margin-right: 2%;
  cursor: pointer;

  .videoBox {
    position: relative;
    // width: 246px;
    // height: 138px;
    border-radius: 8px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .videoImg {
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .absolute {
    position: absolute;
    left: 0;
  }

  .duration {
    position: absolute;
    right: 12px;
    bottom: 7px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
    text-align: right;
    font-weight: 400;
  }

  .duration1 {
    width: 100%;
    height: 30px;
    padding: 0 12px 7px;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    bottom: 0;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
    text-align: right;
    font-weight: 400;
    background-image: -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(99%, rgba(0, 0, 0, .85)));
    background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .85) 99%);
    margin: 0;
  }

  .intro {
    .center {
      display: flex;
      align-items: center;

      span {
        width: 52px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background: #EDF5FF;
        border: 1px solid rgba(151, 195, 255, 1);
        border-radius: 4px;
        margin-left: 8px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #1677FF;
        font-weight: 400;
        flex: none;
      }
    }

    h3 {
      // width: 186px;
      width: 100%;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #333333;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0;

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        font-weight: 400;
      }
    }
  }
}
</style>