/**
 * 账户设置API
 */

 import { axios } from '../tools/requestAxios'

const api = {
  verifyCode: '/common-ucenter-server/manager/user/center/check-verifycode', // 个人设置-验证短信或者邮箱的验证码
  getTokens: '/common-captcha-server/interface/code/gettokens',
  imageCode: '/common-captcha-server/interface/code/imageCode', // 获取图片验证码
  checkCode: '/common-captcha-server/interface/code/checkCode', // 验证验证码
  findMobileCode: '/common-ucenter-server/front/open/find-authcode-by-mobile', // 获取手机激活码 forgetStep2
  findEmailCode: '/common-ucenter-server/front/open/find-mailbox-code', // 获取邮箱激活码 forgetStep2
  checkVerifyCode: '/common-ucenter-server/front/open/check-verifycode', // 忘记密码-验证短信或者邮箱的验证码 forgetStep1
  modifyPwd: '/common-ucenter-server/front/open/modify-pwd', // 修改密码 forgetStep3
  getOpenPubk: '/common-ucenter-server/front/open/get-pubk', // 获取公钥 forgetStep1
  findUserAuthinfo: '/common-ucenter-server/front/open/find-user-authinfo',// forgetStep1
}
export const accountAPI = {
  // 获取手机验证码
  findMobileCode (parameter) {
    return axios({
      url: api.findMobileCode,
      method: 'get',
      params: parameter
    })
  },
  findEmailCode (parameter) {
    return axios({
      url: api.findEmailCode,
      method: 'get',
      params: parameter
    })
  },

  modifyPwd (parameter, sKey) {
    return axios({
      url: api.modifyPwd,
      method: 'post',
      headers: { sKey: sKey },
      data: parameter
    })
  },
  getOpenPubk (parameter) {
    return axios({
      url: api.getOpenPubk,
      method: 'get',
      params: parameter
    })
  },
  // 忘记密码 验证码提交
  checkVerifyCode (parameter) {
    const verifyCodeId = parameter.verifyCodeId
    delete parameter.verifyCodeId
    return axios({
      url: api.checkVerifyCode,
      method: 'get',
      params: parameter,
      headers: {
        'verify-code-id': verifyCodeId
      }
    })
  },
  // 个人设置 验证码提交
  verifyCode (parameter) {
    const verifyCodeId = parameter.verifyCodeId
    delete parameter.verifyCodeId
    return axios({
      url: api.verifyCode,
      method: 'get',
      params: parameter,
      headers: {
        'verify-code-id': verifyCodeId
      }
    })
  },
  // 忘记密码
  getTokens (parameter) {
    return axios({
      url: api.getTokens,
      method: 'get',
      params: parameter,
      ignoreError: true
    })
  },
  imageCode (parameter) {
    return axios({
      url: api.imageCode,
      method: 'get',
      params: parameter,
      ignoreError: true
    })
  },
  checkCode (parameter) {
    return axios({
      url: api.checkCode,
      method: 'get',
      params: parameter,
      ignoreError: true
    })
  },
  findUserAuthinfo (parameter) {
    const verifyCodeId = parameter.verifyCodeId
    delete parameter.verifyCodeId
    return axios({
      url: api.findUserAuthinfo,
      method: 'get',
      params: parameter,
      headers: {
        'verify-code-id': verifyCodeId
      }
    })
  },
}
