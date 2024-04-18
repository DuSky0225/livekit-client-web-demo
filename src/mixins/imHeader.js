import {
  asynRemove,
  asynLoad,
  showCss,
  hiddenCss,
} from "@/tools/loadExternalFile";
// 
export default {
  data() {
    return {};
  },
  mounted() {
    // 加载内网头部
    let jmeetingHeader = sessionStorage.getItem("jmeetingHeader");
    if (jmeetingHeader == "false") {
      Promise.all([
        asynLoad(`/ucenter_files/tempfile/oa/css/header.css`, true),
        showCss(),
      ])
        .then(() => {
          setTimeout(() => {
            console.log("加载完成");
          }, 200);
        })
        .catch((res) => {
          console.log("加载异常");
        });
    }
  },
  methods: {},
  beforeDestroy() {
    let jmeetingHeader = sessionStorage.getItem("jmeetingHeader");
    if (jmeetingHeader == "false") {
      Promise.all([
        asynRemove(`/ucenter_files/tempfile/oa/css/header.css`, true),
        hiddenCss(),
      ])
        .then(() => {
          setTimeout(() => {
            console.log("移除完成");
          }, 200);
        })
        .catch((res) => {
          console.log("移除异常");
        });
    }
  },
};
