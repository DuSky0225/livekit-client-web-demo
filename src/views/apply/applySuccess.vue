<template>
  <div class="loginMain">
    <HanwebNav />
    <div class="mainCss">
      <i class="el-icon-success"></i>
      <h3>提交成功</h3>
      <p>我们将在3个工作日内通过您所填写的邮箱发送试用账号</p>
      <el-button type="primary" class="btn" @click="goBack">返回首页</el-button>
    </div>
    <HanwebFooter />
  </div>
</template>
<script>
import HanwebNav from "@/components/HanwebNav.vue";
import HanwebFooter from "@/components/HanwebFooter.vue";
export default {
  name: 'success',
  components: {
    HanwebNav,
    HanwebFooter
  },
  methods: {
    goBack() {
      location.replace('https://www.hanweb.com')
    }
  },
}
</script>

<style lang="less" scoped>
.loginMain {
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  // background-image: url('../assets/image/bg.png');
  background-image: linear-gradient(to bottom right, rgb(255, 255, 255), rgb(217, 232, 255));

  .mainCss {
    display: flex;
    height: calc(100% - 200px);
    // padding: 70px 0 110px 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    box-sizing: border-box;
    width: 62%;
    // height: auto;
    min-width: 900px;
    max-width: 1200px;
    background: #fff;
    padding: 40px 0;
    margin: 40px 0;

    .el-icon-success {
      color: #1677FF;
      font-size: 64px;
      margin-bottom: 24px;
    }

    h3 {
      font-family: PingFangSC-Medium, PingFangSC-Regular;
      font-size: 24px;
      color: #333333;
      font-weight: 500;
      margin-bottom: 16px;
    }

    p {
      font-family: PingFangSC-Regular, PingFangSC-Medium;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      text-align: center;
      font-weight: 400;
      margin-bottom: 30px;
    }


  }

  .btn {
    width: 160px;
    height: 50px;
    background: #1677FF;
    border-radius: 4px;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    // line-height: 50px;
    font-weight: 400;
  }
}
</style>
