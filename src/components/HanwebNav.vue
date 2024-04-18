<template>
  <div class="nav">
    <img class="logoIcon" :src="$basic.jmeetingIcon ? $basic.jmeetingIcon : require('@/assets/meeting/company.png')"
      alt="">
    <span>{{ $basic.jmeetingName }}</span>

  </div>
</template>
<script>
export default {
  name: "HanwebNav"
};
</script>
<style lang="less" scoped>
.nav {
  width: 100%;
  display: flex;
  // position: fixed;
  // top: 0;
  align-items: center;
  padding: 50px 0 0 50px;

  .logoIcon {
    width: 50px;
    height: 50px;
    // margin: 60px 0 0 100px;
  }

  span {
    margin-left: 20px;
    color: #333;
    font-size: 30px;
    font-weight: 600;
  }
}
</style>