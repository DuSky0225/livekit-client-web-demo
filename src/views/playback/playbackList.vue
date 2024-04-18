<template>
  <div class='clearfix'>
    <div class="topIcon">
      <img :src="$basic.jmeetingIcon ? $basic.jmeetingIcon : require('../../assets/meeting/company.png')" alt="">
      <span>{{ $basic.jmeetingName }}</span>
    </div>
    <div class="content">
      <div class="titleBox">
        <span class="pointer" :class="listType == 0 ? 'active' : ''" @click="changeListType(0)">归我所有</span>
        <span class="pointer" :class="listType == 1 ? 'active' : ''" @click="changeListType(1)">与我共享</span>
      </div>
      <RecordingList v-show="listType == 0" listType="0"></RecordingList>
      <RecordingList v-show="listType == 1" listType="1"></RecordingList>
    </div>
  </div>
</template>
<script>
import RecordingList from '../../components/RecordingList.vue';
export default {
  components: {
    RecordingList,
  },
  data() {
    return {
      listType: 0,
    };
  },
  created() {
    // 判断是否从详情页删除返回
    let { isCanceled } = this.$route.params;
    if (isCanceled) {
      this.$message.success('删除成功');
    }
  },
  mounted() { },
  methods: {
    changeListType(listType) {
      if (listType == this.listType) return
      this.listType = listType;
    },
  },
};
</script>
<style lang="less" scoped>
.clearfix {
  overflow: hidden;
  padding: 0 70px;
  height: 100vh;
}

.topIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 16px 20px 16px;

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

.content {
  .titleBox {
    border-bottom: 1px solid #EBECED;
    padding-bottom: 14px;

    span {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #999999;
      text-align: center;
      font-weight: 400;
      margin: 0 20px 0 10px;
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
        bottom: -13px;
        left: 20px;
      }
    }
  }
}
</style>