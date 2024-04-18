import axios from 'axios';

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

/**
 * @description 函数返回唯一的请求key **/
function getRequestKey(config) {
    let {
        method,
        url,
    } = config;
    // axios中取消请求及阻止重复请求的方法
    // 参数相同时阻止重复请求：
    // return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
    // 请求方法相同，参数不同时阻止重复请求
    return [method, url].join("&");
}
/**
 * @description 添加请求信息 **/
let pendingRequest = new Map()
function addPendingRequest(config) {
    let requestKey = getRequestKey(config);
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        if (!pendingRequest.has(requestKey)) {
            pendingRequest.set(requestKey, cancel);
        }
    });
}
/**
 * @description 取消重复请求 **/
function removePendingRequest(config) {
    if(config.url&&config.url.includes('getChatRecord')){
        let requestKey = getRequestKey(config);
    if (pendingRequest.has(requestKey)) {
        // 如果是重复的请求，则执行对应的cancel函数
        let cancel = pendingRequest.get(requestKey);
        cancel(requestKey);
        // 将前一次重复的请求移除
        pendingRequest.delete(requestKey);
    }
    }
    
}
/**
 * @description 请求拦截器 **/
axios.interceptors.request.use(
    function (config) {
        // 检查是否存在重复请求，若存在则取消已发的请求
        removePendingRequest(config);
        // 把当前请求信息添加到pendingRequest对象中
        addPendingRequest(config);
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
 /**
 * @description 响应拦截器 **/
axios.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        removePendingRequest(response.config);
        
        return response;
    },
    function (error) {
        // 从pendingRequest对象中移除请求
        removePendingRequest(error.config || {});
        return Promise.reject(error);
    })

export default service