import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    islogin: true,
    listId: "",
    listActive: 0,
    chooseMessage: null,
    newMessage: "",
    userId: "",
    userIdJoin: "",
    userName: "",
    noReadNum: "",
    draftList: {},
    groupList: [], //被踢出群聊群组
    liveInfo: {}, //会议信息
    liveCreatorId: "", //创建人信息
    liveName: "", //会议名称
    liveType: "", //会议类型 0-语音，1-视频
    liveId: "", //会议id
    liveMode: 0, //会议模式 1-混合 0-内部 -1-外部
    Initiator: 0, //是否为主持人 1-主持人
    allUserList: [], //全部参会人员
    unOnline: [], //未入会人员
    // mainWindow:"",//主屏幕id
    mainWindowUserid: "", //当前全屏看TA用户/主屏幕id
    isDisconnected: true, //判断是离开会议/断开连接/设备切换
    isScreenShare: [false,"",""], //是否有人开启共享 是否正在共享/姓名/useid
  },
  getters: {},
  mutations: {
    changeScreenShare(state, payload) {
      state.isScreenShare = payload;
    },
    changeAllUserList(state, payload) {
      state.allUserList = payload;
    },
    changeUnOnline(state, payload) {
      state.unOnline = payload;
    },
    changeLiveId(state, payload) {
      state.liveId = payload;
    },
    changeLiveMode(state, payload) {
      state.liveMode = payload;
    },
    setUserName(state, payload) {
      state.userName = payload;
    },
    setLiveInfo(state, payload) {
      state.liveInfo = payload;
      state.liveCreatorId = payload.liveCreatorId;
      state.liveName = payload.liveName;
      state.liveType = payload.liveType;
      state.Initiator = payload.liveCreatorId == state.userId ? 1 : 0;
    },
    loginSuccess(state, payload) {
      state.islogin = payload;
    },
    changeActive(state, payload) {
      state.listActive = payload;
    },
    changeChooseMessage(state, payload) {
      state.chooseMessage = payload;
    },
    changeId(state, payload) {
      state.listId = payload;
    },
    changeNewMessage(state, payload) {
      state.newMessage = payload;
    },
    changeGroupList(state, payload) {
      state.groupList = payload;
    },
    changeNoreadnum(state, payload) {
      state.noReadNum = payload;
    },
    changeUserIdJoin(state, payload) {
      state.userIdJoin = payload;
    },
    changeUserId(state, payload) {
      state.userId = payload;
    },
    changeDraftList(state, payload) {
      state.draftList = payload;
    },
    // changeMainWindow(state, payload){
    //   state.mainWindow = payload;
    // },
    changeMainWindowUserid(state, payload) {
      state.mainWindowUserid = payload;
    },
    changeIsDisconnected(state, payload) {
      state.isDisconnected = payload;
    },
  },
  actions: {},
  // 数据的持久化处理
  plugins: [
    createPersistedState({
      // 存储方式：localStorage、sessionStorage、cookies
      // storage: window.cookies,//存储到cookie
      storage: window.sessionStorage, //存储到sessionStorage
      // 如果不写默认存储到localStorage
      // 存储的 key 的key值
      // key: "store",
      render(state) {
        // 要存储的数据：本项目采用es6扩展运算符的方式存储了state中所有的数据
        return { ...state };
        //需要存储其中的某些数据的话需要单独取出来
        // return {
        //只储存state中的assessmentData
        //assessmentData: val.assessmentData
      },
    }),
  ],
});
