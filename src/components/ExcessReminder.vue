<template>
  <div class="timeOverPage">
    <div class="timeOverBox">
      <div class="timeOverTop">
        <span class="timeOverTitle">超额提示</span>
        <span class="timeOverMsg">{{ tipsText }}</span>
      </div>
      <div class="btnGroup">
        <button class="endBtn" @click="$emit('afterConfirm')">我知道了</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tipsText: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="less" scoped>
.timeOverPage {
  z-index: 999999;
  width: 100vw;
  height: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
}

.timeOverPage .timeOverBox {
  width: 484px;
  height: 169px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px 0 10px 0;
}

.timeOverPage .timeOverBox .timeOverTop {
  display: flex;
  flex-direction: column;
  padding: 0 25px 16px 24px;
  border-bottom: 1px solid #00000017;
}

.timeOverPage .timeOverBox .timeOverTop .timeOverTitle {
  height: 24px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 16px;
  color: #000000d9;
  line-height: 24px;
  margin-bottom: 16px;
}

.timeOverPage .timeOverBox .timeOverTop .timeOverMsg {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 14px;
  color: #000000d9;
}

.timeOverPage .timeOverBox .btnGroup {
  display: flex;
  justify-content: flex-end;
  padding: 10px 17px 10px 0;
}

.timeOverPage .timeOverBox .btnGroup .endBtn {
  /* width: 88px; */
  padding: 0 16px;
  height: 32px;
  background: #1890FF;
  border-radius: 4px;
  border: none;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
  text-align: left;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
}
</style>