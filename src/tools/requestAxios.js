import axios from "axios";
import Qs from "qs";
import store from "@/store";
import router from "@/router";
import VueAxios from "./axios";
import { tools } from "../tools/tool";
// import Notification from 'ant-design-vue/es/notification'
import Modal from "ant-design-vue/es/modal";
// const Vue = window.Vue
// const axios = window.axios

// 创建 axios 实例
const service = axios.create({
  baseURL: "/api-gateway", // api base_url
  timeout: 60000, // 请求超时时间 60s
  ignoreError: false, // 忽略200服务器返回失败，不提示
  transformRequest: [
    function (data, headers) {
      if (headers["Content-Type"]) {
        if (headers["Content-Type"] === "multipart/form-data") {
          return data;
        } else if (headers["Content-Type"] === "application/json") {
          return JSON.stringify(data);
        } else if (headers["Content-Type"] === "text/plain") {
          return JSON.stringify(data);
        } else {
          // 对 data 进行任意转换处理
          return Qs.stringify(data);
        }
      }
      // 对 data 进行任意转换处理
      return Qs.stringify(data, { indices: false });
    },
  ],
  transformResponse: [
    function (data) {
      if (typeof data == 'string') {
        return JSON.parse(data.startsWith("while") ? data.substr(9) : data); // 处理JSON劫持
      } else {
        return data;
      }
    },
  ],
});

const serviceFile = axios.create({
  baseURL: "/api-gateway", // api base_url
  timeout: 60000, // 请求超时时间 60s
  ignoreError: false, // 忽略200服务器返回失败，不提示
  responseType: 'blob',
  transformRequest: [
    function (data, headers) {
      if (headers["Content-Type"]) {
        if (headers["Content-Type"] === "multipart/form-data") {
          return data;
        } else if (headers["Content-Type"] === "application/json") {
          return JSON.stringify(data);
        } else if (headers["Content-Type"] === "text/plain") {
          return JSON.stringify(data);
        } else {
          // 对 data 进行任意转换处理
          return Qs.stringify(data);
        }
      }
      // 对 data 进行任意转换处理
      return Qs.stringify(data, { indices: false });
    },
  ],
  transformResponse: [
    function (data) {
      return data; // 处理JSON劫持
    },
  ],
});

const CancelToken = axios.CancelToken;
let unauthorizedConfirm = null; // 会话失效确认框

const err = (error) => {
  if (axios.isCancel(error)) {
    return new Promise(() => {});
  }

  if (error.response) {
    switch (error.response.status) {
      case 500:
        // Notification.error({
        //   key: 'Error',
        //   message: '内部错误',
        //   description: '服务器内部错误，请稍后重新尝试'
        // })
        break;
      case 403:
        // Notification.error({
        //   key: 'Forbidden',
        //   message: '无权限访问',
        //   description: ((error.response || {}).data || {}).message || '您无权访问该页面'
        // })
        break;
      case 404:
        // Notification.error({
        //   key: 'NotFound',
        //   message: '无法访问',
        //   description: ((error.response || {}).data || {}).message || '网络异常或服务无法访问，请稍后重新尝试'
        // })
        break;
      case 401:
        if (!unauthorizedConfirm) {
          unauthorizedConfirm = Modal.confirm({
            title: "会话无效",
            content: "会话失效或已过期，请重新登录",
            okText: "确认",
            cancelText: "取消",
            onOk() {
              router.replace({
                path: "/boxLogin",
                query: {
                  redirect: router.currentRoute.fullPath,
                },
              });
              tools.removeCookie("access-token");
              tools.removeCookie("userName");
              tools.removeCookie("userId");
              unauthorizedConfirm = null;
            },
            onCancel() {
              unauthorizedConfirm = null;
            },
          });
        }
        break;
      default:
      // Notification.error({
      //   key: 'Unknown',
      //   message: '未知错误',
      //   description: ((error.response || {}).data || {}).message || '未知错误，请稍后重新尝试'
      // })
    }
  }
  return Promise.reject(error);
};

function errorLog(err) {
  // Notification.error({
  //   message: '错误',
  //   description: err
  // })
}

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (!config.daemon) {
      // 存储非守护请求的取消函数
      // config.cancelToken = new CancelToken((cancel) => {
      //   console.log(cancel);
      //   store.state.requestCancels.push(cancel)
      // })
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// response interceptor
service.interceptors.response.use((response) => {
  const responseData = response.data;
  if (responseData) {
    // responseData.headers = response.headers;
    const { success, message } = responseData;
    // if (success || response.config.ignoreError) {
    //   return responseData
    // } else
    if (!success && !response.config.ignoreError) {
      errorLog(message);
    }
    return responseData;
  }
}, err);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service);
  },
};

// 取消请求
const cancelRequests = () => {
  store.state.requestCancels.forEach((cancel) => {
    cancel && cancel();
  });
  store.state.requestCancels = [];
};

export {
  installer as VueAxios,
  service as axios,
  serviceFile as axiosFile,
  cancelRequests,
};
