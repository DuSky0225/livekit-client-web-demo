<template>
  <div>
    <div class="header">
      <div class="box">
        <img src="../../assets/meeting/company.png" alt="">
      <span>{{$basic.jmeetingName}}</span>
      </div>
    </div>
    <div class="activation">
      <!-- <div class="title">忘记密码</div> -->
      <div style="width:60%;margin: 30px auto;margin-top:50px;">
        <!-- 步骤条 -->
        <a-steps :current="current" size="default" style="width:80%;margin: 10px auto;margin-bottom:60px;min-width: 530px;">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <forget-step1 v-if="current === 0" @nextStep="nextStep" @setLastData="setLastData"></forget-step1>
        <forget-step2 v-if="current === 1" @nextStep="nextStep" :lastData="lastData" @pref="pref"
          @setTicket="setTicket"></forget-step2>
        <forget-step3 v-if="current === 2" @nextStep="nextStep" @pref="pref" :ticket="lastData.ticket"></forget-step3>
        <forget-step4 v-if="current === 3"></forget-step4>
      </div>
    </div>
  </div>
</template>

<script>
import ForgetStep1 from '../../components/forgetStep/ForgetStep1'
import ForgetStep2 from '../../components/forgetStep/ForgetStep2'
import ForgetStep3 from '../../components/forgetStep/ForgetStep3'
import ForgetStep4 from '../../components/forgetStep/ForgetStep4'
import IconSafety from '@ant-design/icons/svg/outline/safety.svg?inline'
export default {
  name: 'Forget',
  components: {
    ForgetStep1,
    ForgetStep2,
    ForgetStep3,
    ForgetStep4
  },
  data() {
    return {
      IconSafety,
      lastData: {
        ticket: ''
      },
      steps: [{ // 步骤条标题
        title: '填写登录账号'
      }, { // 步骤条标题
        title: '验证身份'
      }, {
        title: '设置新密码'
      }, {
        title: '完成'
      }],
      current: 0 // 步骤数
    }
  },
  computed: {
    logo() {
      if (window._platform && window._platform.logo) {
        return window._platform.logo
      } else {
        return this.$BASE_URL + 'logo/logo.svg'
      }
    }
  },
  methods: {
    setLastData(value) {
      this.lastData = value
    },
    setTicket(value) {
      this.lastData.ticket = value
    },
    nextStep() {
      if (this.current < 3) {
        this.current += 1
      }
    },
    pref() {
      this.current -= 1
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  // height: 50px;
  color: #fff;
  width: 100%;
  // background-color: #096dd9;
  

  .box {
    margin: 0 70px;
  padding: 15px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #EBECED;
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
}

.activation {
  height: calc(100vh - 100px);
  padding: 0 40px 32px 0;
  background-color: #fff;
  overflow-y: auto;
  display: flex;
  align-items: center;
  .title {
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.85);
    padding-left: 12px;
    border-left: 2px solid #1890FF;
  }
}

::v-deep .footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;
    font-size: 14px;

    a {
      color: rgba(0, 0, 0, 0.45);
      transition: all 0.3s;

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }

  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}

.logo-img {
  width: 32px;
  height: 50px;
  background-size: 32px 32px;
  background-position: 0;
  background-repeat: no-repeat;
  display: inline-block;
  vertical-align: middle;
}

.logo-text {
  line-height: 50px;
  font-size: 22px;
  vertical-align: middle;
  margin-left: 8px;
  color: #fff;
  font-weight: 700;
}</style>
