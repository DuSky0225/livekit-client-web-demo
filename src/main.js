/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import ElementUI from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
import "ant-design-vue/dist/antd.css";
// import "./registerServiceWorker";
import "lib-flexible";
import "./assets/common.css";
// import "../node_modules/hanweb-ui/dist/hg-vcomponents.min.css";
import "vant/es/dialog/style";
import HTTP from "./tools/request";
import { axios } from "./tools/requestAxios";
import "./core/use";
// 集成rsa加解密
// import JSEncrypt from 'jsencrypt';
import { Room, VideoPresets, ScreenSharePresets } from "livekit-client";

const room = new Room({
  adaptiveStream: false,
  dynacast: true,
  publishDefaults: {
    simulcast: true,
    videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h720],
    videoCodec: "h264",
    screenShareSimulcastLayers: [VideoPresets.h1080, VideoPresets.h1080],
    screenShareEncoding: ScreenSharePresets.h1080fps30.encoding,
    audioPreset: "musicHighQualityStereo", //musicHighQualityStereo telephone
    forceStereo: true, //立体声音轨
  },
  audioCaptureDefaults: {
    echoCancellation: true, //回声取消
    noiseSuppression: true, //噪音抑制
    sampleRate: 48000, //每秒采样的次数
    sampleSize: 32, //每个采样点的位数
  },
  videoCaptureDefaults: {
    resolution: VideoPresets.h360,
  },
});

import JmeetingWeb from "../package/index";
import SelectContact from "../package/index";
// import JmeetingWeb from 'jmeeting-web';
// import SelectContact from 'jmeeting-web';
Vue.use(JmeetingWeb);
Vue.use(SelectContact);
import "jmeeting-web/jmeetingWeb.css";

// 网络请求注入vue实例
Vue.prototype.$http = HTTP;
Vue.prototype.axios = axios;
Vue.prototype.$basic = basic;
//引入swiper
// import "swiper/dist/css/swiper.css";

import Bus from "./tools/bus";
Vue.prototype.$bus = Bus;
// 无限滚动
import infiniteScroll from "vue-infinite-scroll";

// import SocketService from './services/websocket'

// 对服务端进行websocket的连接
// SocketService.Instance.connect()
// Vue.prototype.$socket = SocketService.Instance
import $ from "jquery";
window.jQuery = $;
window.$ = $;

import Storage from "vue-ls";
// vue-ls 的配置
const storageOptions = {
  namespace: "vue_", // key 键的前缀（随便起）
  name: "ls", // 变量名称（随便起） 使用方式：Vue.变量名称 或 this.$变量名称
  storage: "local", // 作用范围：local、session、memory
};
import "../static/zxcvbn.js";
Vue.use(Storage, storageOptions);
import GlobalLoader from "jpaas-component/utils/globalLoader.js";
Vue.prototype.$globalLoader = Vue.prototype.$GlobalLoader = GlobalLoader;
//引入vant
import {
  Grid,
  GridItem,
  Icon,
  Tabbar,
  TabbarItem,
  List,
  Cell,
  PullRefresh,
  Toast,
  Lazyload,
  Notify,
  DatetimePicker,
  Popup,
  Uploader,
  ActionSheet,
} from "vant";

import { message } from "ant-design-vue";

import {
  Form,
  FormItem,
  Radio,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Col,
  Switch,
  Input,
  Dialog,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  // Message,
  Upload,
  Collapse,
  Drawer,
  Progress,
  Dropdown,
  Image,
  DropdownMenu,
  DropdownItem,
  Loading,
  Select,
  Option,
  OptionGroup,
  Popover,
  Button,
} from "element-ui";

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Switch);
Vue.use(Dialog);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Col);
Vue.use(Input);
Vue.use(Upload);

Vue.use(Tabbar)
  .use(Form)
  .use(Icon)
  .use(FormItem)
  .use(Option)
  .use(OptionGroup)
  .use(Popover)
  .use(Select)
  .use(Radio)
  .use(Grid)
  .use(GridItem)
  .use(Drawer)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Collapse)
  .use(Progress)
  .use(RadioGroup)
  .use(Button)
  // .use(Message)
  .use(TabbarItem)
  .use(List)
  .use(Cell)
  .use(PullRefresh)
  .use(Toast)
  .use(Image)
  .use(Lazyload)
  .use(Dialog)
  .use(Notify)
  .use(Popup)
  .use(Uploader)
  .use(ActionSheet)
  .use(Checkbox)
  .use(CheckboxGroup);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Switch);
Vue.use(DatetimePicker); // 时间选择
Vue.prototype.$Dialog = Dialog;
// Vue.prototype.$Messages = Message;
Vue.prototype.$message = message;
Vue.config.productionTip = false;
Vue.use(Loading.directive);
Vue.use(infiniteScroll);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$room = room;
/* 路由发生变化修改页面title */
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  // if (from.name == "confirm") {
  //   to.meta.isBack = true;
  // }
  next();
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
/* eslint-disable */
