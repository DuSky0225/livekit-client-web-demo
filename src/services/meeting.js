// import requestJpaas from "../tools/jpaas_request";
import { axios } from "../tools/requestAxios";
import { jmeetingUrl } from "../common/config.js";
export const jmeetingWebAPI = {
  // 是否开启领导模式
  isLeaderModeEnabled(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/isLeaderModeEnabled",
      method: "post",
      params: parameter,
    });
  },
  isMeetingFull(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/external/isMeetingFull",
      method: "post",
      params: parameter,
    });
  },
  // loginName 检测是否为外部人员
  isExternalApplicant(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/apply/isExternalApplicant",
      method: "post",
      params: parameter,
    });
  },
  // 申请试用
  submitApplication(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/apply/submitApplication",
      method: "post",
      params: parameter,
    });
  },
  // 查询会议状态
  liveIsClose(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/liveIsClose",
      method: "post",
      params: parameter,
    });
  },
  // 获取单聊通话记录
  getSingleChatHistory(params) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getSingleChatHistory",
      method: "post",
      params: params,
    });
  },
  // 获取未接通的单聊通话记录
  getUnSingleChatHistory(params) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getUnResponseHistory",
      method: "post",
      params: params,
    });
  },
  //创建单聊语音会议接口 192.168.85.163:9666/jpaas-jmeeting-web-server/front/live/createSingleChatMeeting?liveCreatorId=1&liveCreatorName=1&callerId=1&liveName=1
  createSingleChatMeeting(params) {
    return axios({
      url: "/jpaas-jmeeting-web-server/front/live/createSingleChatMeeting",
      method: "post",
      params: params,
    });
  },
  // 创建会议接口
  createVideoConferencing(params, parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/internalCreate",
      method: "post",
      data: parameter,
      params: params,
    });
  },
  // 会议冲突检验
  clientIsConflict(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/clientIsConflict",
      method: "post",
      params: parameter,
    });
  },
  // 拒绝会议
  jjMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/denyMeeting",
      method: "post",
      params: parameter,
    });
  },
  // 查看历史会议
  getUserHistoryMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getUserHistoryMeeting",
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
  // 查询某人正在进行会议列表
  getUserLivingMeeting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getUserLivingMeeting",
      method: "post",
      params: parameter,
    });
  },
  // 会议详情接口
  getLiveInfo(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/getLiveHistoryInfo",
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
  //会议允许最大人数
  meetingSetting(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/meetingSetting",
      method: "post",
      params: parameter,
    });
  },
  // 邀请人员
  addMeetingPeople(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/live/addMeetingPeople",
      method: "post",
      data: parameter,
      headers: { "Content-Type": "application/json" },
    });
  },
};
