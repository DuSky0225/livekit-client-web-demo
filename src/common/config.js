const meetUrl = window.location.origin + "/jmeeting-web/#/"; //pc地址
const meetUrl_h5 = window.location.origin + "/jmeeting-h5/#/"; //h5地址

// 直连接口地址
const baseUrl = {
  serverUrl: "/jpaas-jim-web-server",
};
//视频会议直连接口地址
const jmeetingUrl = {
  serverUrl: "/jpaas-jmeeting-web-server",
};

export { meetUrl, meetUrl_h5, baseUrl, jmeetingUrl };

/*
 * Jpaas网关接口地址
 */
export const jpassConfig = {
  publicKey:
    "04a2b43e3c4dd427d7c5b35ed538d0bfa512026ce487cb6e045f17d78d360d61213107acb7045f522c793e9dd7417bb926fbe5aea309d8650e47e170824dfb28cf",

  backUrl: "/jmeeting-web/#/boxIndex",
};
