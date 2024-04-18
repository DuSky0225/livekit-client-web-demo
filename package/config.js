const meetUrl = window.location.origin + '/jmeeting-web/#/'//pc地址
const meetUrl_h5= window.location.origin + '/jmeeting-h5/#/'//h5地址

// 直连接口地址
const baseUrl = {
  // serverUrl:window.location.hostname == 'meeting.hanweb.com' ?  "https://work.hanweb.com/api-gateway/jpaas-jim-web-server" : "/api-gateway/jpaas-jim-web-server"
  serverUrl: "/api-gateway/jpaas-jim-web-server",
  // serverUrl: "https://workin.hanweb.com/api-gateway/jpaas-jim-web-server",
};
//视频会议直连接口地址
const jmeetingUrl = {
  // serverUrl:window.location.hostname == 'work.hanweb.com' ? "https://meeting.hanweb.com/api-gateway/jpaas-jmeeting-web-server" : window.location.origin + "/api-gateway/jpaas-jmeeting-web-server"
  serverUrl: "/jpaas-jmeeting-web-server",
  // serverUrl: "https://jpaasdev2.hanweb.com/api-gateway/jpaas-jmeeting-web-server",
};
const countUrl = {
  //  url:"https://work.hanweb.com/api-gateway/jpaas-jtodo-server/interface/open-api/all-count",     //测试
    // url:"http://work.hanweb.com/api-gateway/jpaas-jtodo-server/interface/open-api/all-count", 
    url:"/api-gateway/jpaas-jtodo-server/interface/open-api/all-count", 
}
const updateUrl={
  // url:"http://192.168.84.83:9009/jpaas-jim-push-server/interface/notify/updateBadge"
  // url:"https://work.hanweb.com/api-gateway/jpaas-jim-push-server/interface/notify/updateBadge" //测试
  // url:"http://work.hanweb.com/api-gateway/jpaas-jim-push-server/interface/notify/updateBadge" //正式
  url:"/api-gateway/jpaas-jim-push-server/interface/notify/updateBadge" //正式
}
const socketUrl={
  // socket : 'wss://workin.hanweb.com/jim-websocket/',//测试https
  // socket : 'wss://jpaasdev2.hanweb.com/jim-websocket/',//本地
  socket:'wss://' + location.hostname + '/jim-websocket/',
  // socket : 'ws://192.168.5.24:31659?userid='+userId+'&type=2',//测试http
  // socket : 'wss://work.hanweb.com/jim-websocket/',//正式
  // socket : 'ws://192.168.84.83:8888?userid='+userId+'&type=2',//本地
}
export {meetUrl,meetUrl_h5,baseUrl,jmeetingUrl,countUrl,socketUrl,updateUrl}


/*
  * Jjpaas网关接口地址
*/
export const jpassConfig = {
  
  //唯一标识
  // 'APP_ID': 'jmeetingnzjk',
  'APP_ID': 'jmeetingkitnzjk', //demo3
  // 'httpRequestJpaas': 'http://192.168.10.51:31110/jpaas-jags-server/interface/',// 本地

  // 'httpRequestJpaas': 'https://workin.hanweb.com/api-gateway/jpaas-jags-server/interface/',// 测试
  // 'httpRequestJpaas': 'https://jpaasdev2.hanweb.com/api-gateway/jpaas-jags-server/interface/',// 本地

  'httpRequestJpaas': '/api-gateway/jpaas-jags-server/interface/',// 开发

  // 'backUrl':'/jim-web/#/index',
  'publicKey':'04a2b43e3c4dd427d7c5b35ed538d0bfa512026ce487cb6e045f17d78d360d61213107acb7045f522c793e9dd7417bb926fbe5aea309d8650e47e170824dfb28cf',
  // 'backUrl':'/jim-web/#/index',
  'backUrl':window.location.hostname == 'kqxt.hanweb.com' ?  "https://work.hanweb.com/jim-web/#/boxIndex" : "/jim-web/#/boxIndex",
  'meetingPrivateKey':'7fdc10c5ee985c56483ae82589b5d0723e310117e660cc4e636be7dcbde3634f', // 视频会议 秘钥
  'meetingPublicKey':'04e9db7a9d78f931c74f4e538e4f928cd6cfa531563d9b2350afb2e288e77f3ce7618674889091ace46be7acdc71a1d7ac221b63d8f687e0604d0d686f752e010e', // 视频会议 公钥
  'ImPrivateKey':'3730a41db45fac47574647197e985ce349c97a8d62306a8501091e27531ee4ca'// im 秘钥
}
