<template>
  <div class="loginMain">
    <HanwebNav />
    <div class="mainCss">
      <h3 class="title">申请试用</h3>
      <h6 class="tips">我们如何联系您？</h6>
      <p class="longTips">留下联系方式，我们将在3个工作日内通过您所填写的邮箱发送试用账号</p>
      <div class="dolid"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="applicantTelephone">
          <el-input v-model="form.applicantTelephone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="applicantMail">
          <el-input v-model="form.applicantMail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="试用时长">
          <el-radio-group v-model="form.trialDuration">
            <el-radio label="0">1天</el-radio>
            <el-radio label="1">7天</el-radio>
            <el-radio label="不限时" disabled></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单场时长">
          <el-radio-group v-model="form.singleDuration">
            <el-radio label="0">2小时</el-radio>
            <el-radio label="1" disabled>8小时</el-radio>
            <el-radio label="2" disabled>不限时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单场最大人数">
          <el-radio-group v-model="form.singleMaxParticipants">
            <el-radio label="0">10人</el-radio>
            <el-radio label="1" disabled>20人</el-radio>
            <el-radio label="2" disabled>不限人数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="center">
          <el-button type="primary" class="btn" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <HanwebFooter />
  </div>
</template>
<script>
import HanwebNav from "@/components/HanwebNav.vue";
import HanwebFooter from "@/components/HanwebFooter.vue";
import { jmeetingWebAPI } from "../../services/meeting";
import { jpassConfig } from '../../common/config.js';
import { tools } from "../../tools/tool";
export default {
  name: 'applyFrom',
  components: {
    HanwebNav,
    HanwebFooter
  },
  data() {
    const companyNameRule = (rule, value, callback) => {
      console.log(value);
      if (value === '') {
        callback(new Error('请输入公司名称!'));
      } else {
        callback();
      }
    }
    const creditCodeRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入统一社会信用代码!'));
      } else if (!tools.validateUnifiedSocialCreditCode(value)) {
        callback(new Error('统一社会信用代码格式错误!'));
      } else {
        callback();
      }
    }
    const applicantTelephoneRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话!'));
      } else if (!tools.isPhone(value)) {
        callback(new Error('联系电话格式错误!'));
      } else {
        callback();
      }
    }
    const applicantMailRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱!'));
      } else if (!tools.isEmail(value)) {
        callback(new Error('邮箱格式错误!'));
      } else {
        callback();
      }
    }
    return {
      form: {
        companyName: "",
        creditCode: "",
        applicantTelephone: "",
        applicantMail: "",
        trialDuration: "1",
        singleDuration: "0",
        singleMaxParticipants: "0",
      },
      rules: {
        companyName: [
          { validator: companyNameRule, trigger: 'blur' },
        ],
        creditCode: [
          { validator: creditCodeRule, trigger: 'blur' },
        ],
        applicantTelephone: [
          { validator: applicantTelephoneRule, trigger: 'blur' },
        ],
        applicantMail: [
          { validator: applicantMailRule, trigger: 'blur' },
        ],
      }
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      //事件对象兼容
      let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
      //键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
      //左
      if (e1.code === 'Enter') {
        // this.login()
        this.onSubmit()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            companyName: this.form.companyName,
            creditCode: this.form.creditCode,
            applicantTelephone: this.form.applicantTelephone,
            applicantMail: this.form.applicantMail,
            trialDuration: this.form.trialDuration,
            singleDuration: this.form.singleDuration,
            singleMaxParticipants: this.form.singleMaxParticipants
          }
          let data = {
            encryptedInput: tools.encrypt(JSON.stringify(params), jpassConfig.publicKey)
          }

          jmeetingWebAPI.submitApplication(data)
            .then((res) => {
              console.log(res);
              if (res.success) {
                this.$router.push({
                  name: "applySuccess"
                })
              } else {
                this.$message.error(res.message)
              }
            })
            .catch(err => console.log(err))
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
    // height: calc(100% - 200px);
    // padding: 70px 0 110px 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    box-sizing: border-box;
    width: 62%;
    height: auto;
    min-width: 900px;
    max-width: 1200px;
    // max-height: calc(100% - 200px);
    background: #fff;
    padding: 40px 0;
    margin: 40px 0;

    .title {
      font-family: PingFangSC-Semibold;
      font-size: 32px;
      color: #333333;
      text-align: left;
      font-weight: 600;
      margin-bottom: 30px;
    }

    .tips {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #333333;
      text-align: center;
      line-height: 32px;
      font-weight: 600;
    }

    .longTips {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #999999;
      text-align: center;
      line-height: 32px;
      font-weight: 400;
      margin-bottom: 30px;
    }

    .dolid {
      width: 700px;
      height: 1px;
      border-top: 1px dashed rgba(221, 221, 221, 1);
    }
  }

  .el-form {
    margin-top: 30px;
  }

  .el-input {
    width: 455px;
  }

  ::v-deep .el-form-item__label {
    font-size: 16px;
    color: #333333;
    text-align: right;
    // line-height: 40px;
    font-weight: 400;
    width: 150px !important;
  }

  ::v-deep .el-form-item__content {
    margin-left: 150px !important;
  }

  ::v-deep .el-form-item {

    &:nth-last-child(2) {
      margin-bottom: 52px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  ::v-deep .el-radio__label {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
    font-weight: 400;
  }

  ::v-deep .el-input__inner {
    font-size: 16px;
    color: #333333;
    text-align: left;
    font-weight: 400;
  }

  ::v-deep .el-radio__inner {
    width: 16px;
    height: 16px;
  }

  .center {
    ::v-deep .el-form-item__content {
      // width: 100%;
      display: flex;
      justify-content: center;
      margin-left: 0 !important;
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
