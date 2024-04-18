import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
//push
Router.prototype.push = function push(location, onResolve, onReject) {
  // console.log("push======================>", location, onResolve, onReject);
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};
//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  // console.log("replace======================>", location, onResolve, onReject);
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch((err) => err);
};

export default new Router({
  mode: "hash",
  // mode: "history",
  // base: '/dist/',
  routes: [
    {
      path: "/index",
      name: "index",
      // component: (resolve) => require(["./views/index.vue"], resolve),
      component: () => import("./views/index.vue"),
      meta: {
        title: "会议",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work", "noWork"], // 受访问限制的角色
      },
    },
    // {
    //   path: "/createMeet",
    //   name: "createMeet",
    //   component: (resolve) => require(["./views/createMeet.vue"], resolve),
    //   meta: {
    //     title: "创建会议",
    //     keepAlive: false, //此组件不需要被缓存
    //     isBack: false, //用于判断上一个页面是哪个
    //   },
    // },
    {
      path: "/Settings",
      name: "Settings",
      // component: (resolve) => require(["./views/Settings.vue"], resolve),
      component: () => import("./views/Settings.vue"),
      meta: {
        title: "关于隐私设置",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work", "noWork"], // 受访问限制的角色
      },
    },
    {
      path: "/historyMeet",
      name: "historyMeet",
      // component: (resolve) => require(["./views/historyMeet.vue"], resolve),
      component: () => import("./views/historyMeet.vue"),
      meta: {
        title: "历史会议",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work", "noWork"], // 受访问限制的角色
      },
    },
    {
      path: "/check",
      name: "check",
      // component: (resolve) => require(["./views/check.vue"], resolve),
      component: () => import("./views/check.vue"),
      meta: {
        title: "闪会",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work", "noWork"], // 受访问限制的角色
      },
    },
    {
      path: "/login",
      name: "login",
      // component: (resolve) => require(["./views/login.vue"], resolve),
      component: () => import("./views/login.vue"),
      meta: {
        title: "登录",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work", "noWork"], // 受访问限制的角色
      },
    },
    {
      path: "/voiceCall",
      name: "voiceCall",
      component: () => import("./views/voiceCall.vue"),
      meta: {
        title: "语音通话",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work"], // 受访问限制的角色
      },
    },
    // {
    //   path: "/",
    //   redirect: "/boxLogin",
    // },
    {
      path: "/boxLogin",
      name: "boxLogin",
      component: () => import("./views/boxLogin/login.vue"),
      meta: {
        title: "登录",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work"], // 受访问限制的角色
      },
    },
    {
      path: "/forgetPwd",
      name: "forgetPwd",
      component: () => import("./views/boxLogin/forgetPwd.vue"),
      meta: {
        title: "忘记密码",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work"], // 受访问限制的角色
      },
    },
    {
      path: "/download",
      name: "download",
      component: () => import("./views/download.vue"),
      meta: {
        title: basic.jmeetingName,
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work"], // 受访问限制的角色
      },
    },
    {
      path: "/boxIndex",
      name: "boxIndex",
      component: () => import("./views/boxIndex.vue"),
      meta: {
        title: basic.jmeetingName,
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work"], // 受访问限制的角色
      },
    },
    {
      path: "/playbackList",
      name: "playbackList",
      component: () => import("./views/playback/playbackList.vue"),
      meta: {
        title: basic.jmeetingName,
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work"], // 受访问限制的角色
      },
    },
    {
      path: "/playbackDetails",
      name: "playbackDetails",
      component: () => import("./views/playback/playbackDetails.vue"),
      meta: {
        title: basic.jmeetingName,
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work"], // 受访问限制的角色
      },
    },
    {
      path: "/applyForm",
      name: "applyForm",
      component: () => import("./views/apply/applyForm.vue"),
      meta: {
        title: "申请试用",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work", "noWork"], // 受访问限制的角色
      },
    },
    {
      path: "/applySuccess",
      name: "applySuccess",
      component: () => import("./views/apply/applySuccess.vue"),
      meta: {
        title: "申请试用",
        keepAlive: false, //此组件不需要被缓存
        isBack: false, //用于判断上一个页面是哪个
        roles: ["work", "noWork"], // 受访问限制的角色
      },
    },
    // {
    //   // path: "/:catchAll(.*)",
    //   path: "/:path(.*)+",
    //   name: "not-found",
    //   component: () => import("./components/404.vue"),
    //   meta: {
    //     title: "404",
    //     keepAlive: false, //此组件不需要被缓存
    //     isBack: false, //用于判断上一个页面是哪个
    //     roles: ["work", "noWork"], // 受访问限制的角色
    //   },
    // },
  ],
});
// const VueRouterPush = Router.prototype.push
// Router.prototype.push = function push(to) {
//   return VueRouterPush.call(this, to).catch(err => err)
// }
