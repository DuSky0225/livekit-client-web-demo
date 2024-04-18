/**
 * 账户设置API
 */
import { baseUrl, jmeetingUrl } from "../../common/config";
import { axios } from "../../tools/requestAxios";

const ucenterServer = "/common-ucenter-server";
const api = {
  modifyHeadPath: ucenterServer + "/manager/user/center/modify-head-path", // 修改用户头像
  Logout: ucenterServer + "/logout", //退出登录
  getUcenterInfo: ucenterServer + "/manager/onlineuser/current", //ucenter获取用户信息
  // IM接口
  getUserInfo: baseUrl.serverUrl + "/front/user/mainPage", //IM获取用户信息
  downLoad: jmeetingUrl.serverUrl + "/front/version/download",
  meetingDownLoad:
    jmeetingUrl.serverUrl + "/front/version/getDownloadPageQRCode",
};
export const accountAPI = {
  // 修改用户头像
  modifyHeadPath(parameter) {
    return axios({
      url: api.modifyHeadPath,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Token": JSON.parse(localStorage.getItem("vue_ACCESS_TOKEN"))
          .value,
      },
      data: parameter,
    });
  },
  logout(parameter) {
    return axios({
      url: api.Logout,
      method: "get",
      params: parameter,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
  },
  getUcenterInfo() {
    return axios({
      url: api.getUcenterInfo,
      method: "get",
      params: {},
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Token": JSON.parse(localStorage.getItem("vue_ACCESS_TOKEN"))
          .value,
      },
    });
  },
  getUserInfo(parameter) {
    return axios({
      url: api.getUserInfo,
      method: "post",
      params: parameter,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        // "Access-Token":JSON.parse(localStorage.getItem('vue_ACCESS_TOKEN')).value
      },
    });
  },
  downLoad(parameter) {
    return axios({
      url: api.downLoad,
      method: "post",
      params: parameter,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
  },
  meetingDownLoad(parameter) {
    return axios({
      url: api.meetingDownLoad,
      method: "post",
      params: parameter,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
  },
};
