// import requestJpaas from "../tools/jpaas_request";
import { axios, axiosFile } from "../tools/requestAxios";
import { jmeetingUrl } from "../common/config.js";
export const jmeetingWebAPI = {
  // 关键词获取
  extractKeywords(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/extractKeywords",
      method: "post",
      params: parameter,
    });
  },
  // 录制回放列表
  playbackList(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/playbackList",
      method: "post",
      params: parameter,
    });
  },
  // 录制详情
  playbackDetail(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/playbackDetail",
      method: "post",
      params: parameter,
    });
  },
  // 会议成员语音转文字内容列表
  audioToTextList(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/audioToTextList",
      method: "post",
      params: parameter,
    });
  },
  // 分享权限设置
  sharePermissionSettings(params,parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/sharePermissionSettings",
      method: "post",
      data: parameter,
      params: params,
      headers: {
        'Content-Type': 'application/json', // 设置请求头
      },
    });
  },
  // 修改回放会议视频名称
  modifyPlaybackVideoName(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/modifyPlaybackVideoName",
      method: "post",
      params: parameter,
    });
  },
  // 会议纪要
  meetingSummary(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/meetingSummary",
      method: "post",
      params: parameter,
    });
  },
  // 删除回放
  deletePlayback(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/deletePlayback",
      method: "post",
      params: parameter,
    });
  },
  // 提供hos地址接口
  getHosList(parameter) {
    return axios({
      url: jmeetingUrl.serverUrl + "/front/recording/getHosList",
      method: "post",
      params: parameter,
    });
  },
  // 导出
  fileExport(parameter) {
    return axiosFile({
      url: jmeetingUrl.serverUrl + "/front/recording/fileExport",
      method: "get",
      params: parameter,
    });
  },
};
