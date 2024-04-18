import { axios,axiosFile } from '../tools/requestAxios'
export const jmeetingLoginAPI = {
  // 获取登录方式
  getLoginFunc() {
    return axios({
      url: "/common-ucenter-server/login-prop",
      method: "get"
    });
  },
  // 登录
  login(parameter,cookie,imgToken) {
    return axios({
      url: "/common-ucenter-server/login",
      method: "post",
      data: parameter,
      headers: {
        'verify-code-id': imgToken ? imgToken : '',
        Cookies: cookie
      }
    });
  },
  // 轮询是否登陆成功接口
  checkLogin(params) {
    return axios({
      url: "/common-ucenter-server/check-qrcode-login",
      method: "get",
      params: params,
      // headers: {
      //   Cookie: document.cookie
      // }
    });
  },
  // 获取登录二维码
  loginQrcode(params) {
    return axiosFile({
      url: `/common-ucenter-server/login-qrcode?${params}`,
      method: "get",
      responseType: 'arraybuffer',
    });
  },
  // 获取登录用户信息
  getLoginUser(token) {
    return axios({
      url: `/common-ucenter-server/manager/onlineuser/current`,
      method: "get",
      headers: {
        'access-token': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  // 判断是否登录
  checkUser(token) {
    return axios({
      url: `/common-ucenter-server/oauth2/checkuser`,
      method: "get",
      headers: {
        'access-token': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  checkUsers(token) {
    return axios({
      url: `/jpaas-web-server/front/check-user?accessToken=${token}`,
      method: "get",
      headers: {
        'access-token': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
}