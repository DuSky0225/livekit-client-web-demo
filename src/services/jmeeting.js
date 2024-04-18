import { axios } from "../tools/requestAxios";
import { jmeetingUrl } from "../common/config";
export const jmeetingWebAPI = {
  // 创建会议
  internalCreate(params, parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/internalCreate",
      method: "post",
      params: params,
      data: parameter,
    });
  },
  // 接受会议接口
  acceptMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/acceptMeeting",
      method: "post",
      params: parameter,
    });
  },
  // 创建会议接口
  externalCreate(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/external/externalCreate",
      method: "post",
      params: parameter,
    });
  },
  // 关闭会议接口
  closeMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/closeMeeting",
      method: "post",
      params: parameter,
    });
  },
  // 离开会议接口
  leaveMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/leaveMeeting",
      method: "post",
      params: parameter,
    });
  },
  // 查询正在进行会议的接口
  getInProcessMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getInProcessMeeting",
      method: "post",
      params: parameter,
    });
  },
  // 会议详情接口
  getLiveInfo(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getLiveInfo",
      method: "post",
      params: parameter,
    });
  },
  // 会议中成员接口
  getMeetingUsers(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getMeetingUsers",
      method: "post",
      params: parameter,
    });
  },
  // 更改会议模式接口
  changeLiveMode(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/changeLiveMode",
      method: "post",
      params: parameter,
    });
  },
  //  会议历史接口
  getUserHistoryMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getUserHistoryMeeting",
      method: "post",
      params: parameter,
    });
  },
  //会议允许最大人数
  meetingSetting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/meetingSetting",
      method: "post",
      params: parameter,
    });
  },
  // 邀请人员
  addMeetingPeople(params, parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/addMeetingPeople",
      method: "post",
      params: params,
      data: parameter,
      headers: { "Content-Type": "application/json" },
    });
  },
  // 短信验证码发送接口
  sendValidateCode(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/external/sendValidateCode",
      method: "post",
      params: parameter,
    });
  },
  //短信验证码校验接口
  check(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/external/check",
      method: "post",
      params: parameter,
    });
  },
  //外部关闭会议接口
  externalClose(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/external/externalClose",
      method: "post",
      params: parameter,
    });
  },
  //外部历史会议接口
  externalHistory(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/external/externalHistory",
      method: "post",
      params: parameter,
    });
  },
  //置顶接口
  topping(params, parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/setting/roomSetting",
      method: "post",
      params,
      data: parameter,
      headers: { "Content-Type": "application/json" },
    });
  },
  // 语音通话创建会议
  // liveCreatorId=1&liveCreatorName=1&callerId=1&liveName=1
  createSingleChatMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/createSingleChatMeeting",
      method: "post",
      params: parameter,
    });
  },
  // 语音通话进入会议
  acceptSingleChatMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/acceptSingleChatMeeting",
      method: "post",
      params: parameter,
    });
  },
  // 结束会议
  closeSingleChatMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/closeSingleChatMeeting",
      method: "post",
      params: parameter,
      // liveId=cFQQtVU1TxyDodcBNf0QZ&userId=37507ab0ef4643b4bd92564f093c1163&type=1
      // type：类型 0未响应，1结束，2拒绝，3忙线，4取消
    });
  },
  getMobileNumber(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/apply/getMobileNumber",
      method: "post",
      params: parameter,
    });
  },
};
