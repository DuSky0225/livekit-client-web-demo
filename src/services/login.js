/**
 * 登录API
 */

 import { axios } from '../tools/requestAxios'

 const api = {
   LoginProp: '/common-ucenter-server/login-prop',
   Login: '/common-ucenter-server/login', // '/auth/login',
   Logout: '/common-ucenter-server/logout',
   mobileLogin: '/common-ucenter-server/mobile-verifycode-login',
   ForgePassword: '/common-ucenter-server/auth/forge-password',
   Register: '/common-ucenter-server/auth/register',
   twoStepCode: '/common-ucenter-server/auth/2step-code',
   SendSms: '/common-ucenter-server/account/sms',
   SendSmsErr: '/common-ucenter-server/account/sms_err',
   // get my info
   UserInfo: '/common-ucenter-server/manager/onlineuser/current',
   Captcha: '/common-ucenter-server/verifyCode',
   paddingPermissions: '/common-ucenter-server/manager/onlineuser/padding-permissions',
   findLogoutUrl: '/common-ucenter-server/logout-url'
 }
 
 /**
  * login func
  * parameter: {
  *     username: '',
  *     password: '',
  *     remember_me: true,
  *     captcha: '12345'
  * }
  * @param parameter
  * @returns {*}
  */
 export function login (parameter) {
   const verifyCodeId = parameter.verifyCodeId
   delete parameter.verifyCodeId
   return axios({
     url: api.Login,
     method: 'post',
     data: parameter,
     headers: {
       'verify-code-id': verifyCodeId
     }
   })
 }
 
 export function mobileLogin (parameter) {
   const verifyCodeId = parameter.verifyCodeId
   delete parameter.verifyCodeId
   return axios({
     url: api.mobileLogin,
     method: 'post',
     data: parameter,
     headers: {
       'verify-code-id': verifyCodeId
     }
   })
 }
 
 export function getSmsCaptcha (parameter) {
   return axios({
     url: api.SendSms,
     method: 'post',
     data: parameter
   })
 }
 
 export function getInfo () {
   return axios({
     url: api.UserInfo,
     method: 'get',
     headers: {
       'Content-Type': 'application/json;charset=UTF-8'
     }
   })
 }
 
 export function logout (parameter) {
   return axios({
     url: api.Logout,
     method: 'get',
     params: parameter,
     headers: {
       'Content-Type': 'application/json;charset=UTF-8'
     }
   })
 }
 
 /**
  * get user 2step code open?
  * @param parameter {*}
  */
 export function get2step (parameter) {
   return axios({
     url: api.twoStepCode,
     method: 'post',
     data: parameter
   })
 }
 
 /**
  * 获取登陆前登台认证方式
  */
 export function getLoginProp () {
   return axios({
     url: api.LoginProp,
     method: 'get'
   })
 }
 
 /**
  * 验证码
  * @param {*} parameter
  */
 export function getCaptcha (parameter) {
   return axios({
     url: api.Captcha,
     method: 'get',
     params: parameter
   })
 }
 
 /**
  * 前台登录注入后台权限
  */
 export function paddingPermissions () {
   return axios({
     url: api.paddingPermissions,
     method: 'get'
   })
 }
 
 export function findLogoutUrl () {
   return axios({
     url: api.findLogoutUrl,
     method: 'get'
   })
 }
 