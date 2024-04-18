<template>
  <div>
    <a-form
      :form="form"
      layout="horizontal"
      style="width: 400px;margin: 30px auto;"
    >
      <a-form-item
        label="密码"
      >
        <h-password
          :form="this.form"
          placeholder="6-18位字符，建议字母、数字和符号组合"
          level="medium"
          :maxLength="18"
          v-decorator="['password', { rules: [{required: true, message: '请输入新的登录密码'}, {min: 6, message: '密码至少6位'}] }]"
        ></h-password>

      </a-form-item>

      <a-form-item
        label="确认密码"
      >
        <a-input
          placeholder="请再次输入密码"
          type="password"
          :maxLength="18"
          v-decorator="['againPassword', { rules: [{required: true, message: '请再次输入密码'}, {min: 6, message: '密码至少6位'}, {validator: validatePassword}], validateTrigger: 'blur' }]"
        />
      </a-form-item>
      <a-form-item>
        <h-button style="margin:5px;" type="primary" @click="nextStep">完成</h-button>
        <h-button style="margin:5px;" @click="pref">上一步</h-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { HButton, HPassword } from 'jpaas-component'
import { accountAPI } from '@/services/account'
import { nanoid } from 'nanoid'
import sm2 from 'jpaas-component/utils/encrypt/encrypt_2'
import sm4 from 'jpaas-component/utils/encrypt/encrypt_4'
export default {
  name: 'Forget',
  components: {
    HPassword,
    HButton
  },
  data () {
    return {
      form: this.$form.createForm(this),
      pubk: ''
    }
  },
  props: {
    ticket: {
      type: String,
      default: ''
    }
  },
  methods: {
    pref () {
      this.$emit('pref')
    },
    nextStep () {
      const {
        form: { validateFields }
      } = this
      validateFields((err, values) => {
        if (!err) {
          const generateStrs = nanoid(16)// 前端 先自己生成一个16位的 字符串  然后用ucenter 给的 pubk加密
          const sKey = sm2.encrypt(generateStrs, this.pubk)
          console.log('this.pubk',this.pubk)
          console.log('generateStrs',generateStrs)
          console.log('sKey',sKey)
          console.log('sm4.encrypt',sm4.encrypt)
          console.log('values.password',values.password)
          console.log('加密',sm4.encrypt(values.password, {key: 'TfQVPYNQEWsm6a8V',mode: "ecb",cipherType: 'base64'}))
          console.log('sm4.encrypt(values.password, generateStrs),',sm4.encrypt('1111', {key: 'TfQVPYNQEWsm6a8V',mode: "ecb",cipherType: 'base64'}),)
          accountAPI.modifyPwd({
            pwd: sm4.encrypt(values.password, {key: generateStrs,mode: "ecb",cipherType: 'base64'}),
            ticket: this.ticket
          }, sKey).then((res) => {
            if (res.success) {
              this.$emit('nextStep')
            } else {
              this.$notification.error({
                message: '您输入的密码和确认的密码不一致，请重新输入',
                description: res.message || '您输入的密码和确认的密码不一致，请重新输入',
                duration: 3
              })
            }
          })
        }
      })
    },
    // 处理两次密码输入不一致
    validatePassword (rule, value, callback) {
      const form = this.form
      const errMsg = '两次输入的密码不一致，请核对'
      if (form.getFieldValue('password') && !value) {
        callback(new Error('请输入确认密码'))
      } else if (form.getFieldValue('password') && value !== form.getFieldValue('password')) {
        callback(errMsg)
      } else {
        callback()
      }
    }

  },
  mounted () {
    // 获取修改密码时的加密公钥
    accountAPI.getOpenPubk().then(res => {
      if (res.success) {
        this.pubk = res.data.authPubk.pubKey
      }
    })
  },
  beforeCreate() {
    // this.$GlobalLoader.load(`${this.$Base_URL}jpaas-static/zxcvbn.js`).then(()=> {
    //   this.spinning = false
    // })
  }
}
</script>
