<template>
  <div id="shareScreenBox" class="shareScreenBox" v-if="visible">
    <div class="shareBoxTitle">
      <span class="title">屏幕共享</span>
      <i class="el-icon-close deletIcon" @click="closeScreen"></i>
    </div>
    <div class="tabList">
      <span :class="tab === 1 ? 'tabActive' : 'tab'" @click="selectTabs(1)">指定窗口</span>
      <span :class="tab === 2 ? 'tabActive' : 'tab'" @click="selectTabs(2)">整个屏幕</span>
      <span class="tabTip">全屏窗口请共享整个屏幕</span>
    </div>
    <div class="shareScreenSelectBox">
      <template v-if="tab === 1">
        <div class="selectList">
          <span v-for="item in sources" :key="item.id" :class="selectTab === item.id ? 'selectTabActive' : 'selectTab'"
            @click="selectScreen(item)">{{ item.name }}</span>
        </div>
        <div class="screenBox">
          <video ref="videoScreenRef" class="screenImg" style="object-fit: cover" muted autoplay playsinline="true"
            webkit-playsinline="true"></video>
          <el-tooltip class="item" effect="dark" :content="selectedName" placement="bottom">
            <span class="screenText">{{ selectedName }}</span>
          </el-tooltip>
        </div>
      </template>
      <template v-else>
        <div class="selectList">
          <span v-for="item in screenDataList" :key="item.id"
            :class="selectTab === item.id ? 'selectTabActive' : 'selectTab'" @click="selectScreen(item)">{{ item.name
            }}</span>
        </div>
        <div class="screenBox">
          <video ref="videoScreenRef2" class="screenImg" style="object-fit: cover" muted autoplay playsinline="true"
            webkit-playsinline="true"></video>
          <span class="screenText">{{ selectedName }}</span>
        </div>
      </template>
    </div>
    <div class="btnGroup">
      <button class="confirmBtn" @click="shareScreen">共享</button>
      <button class="cancelBtn" @click="closeScreen">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShareScreen",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    visible: {
      handler(newV, oldV) {
        if (newV) {
          this.init()
        }
      }
    }
  },
  data() {
    return {
      tab: 1,
      selectTab: '',
      sources: [],
      videoObj: {},
      screenDataList: [],
      selectedName: ''
    }
  },
  methods: {
    // 关闭窗口
    closeScreen() {
      this.$emit('update:visible', false)
    },
    // 共享屏幕
    shareScreen() {
      let dataList = this.tab === 1 ? this.sources : this.screenDataList
      let reqdata = {}
      dataList.forEach(item => {
        if (item.id === this.selectTab) {
          reqdata = item
        }
      })
      this.$emit('shareScreen', reqdata)
    },
    // 选择屏幕
    async selectScreen(item) {
      this.selectTab = item.id
      let stream = await window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: item.id
          }
        }
      })
      this.selectedName = item.name
      if (this.tab === 1) {
        this.$refs.videoScreenRef.srcObject = stream
      } else {
        this.$refs.videoScreenRef2.srcObject = stream
      }
    },
    // 初始化窗口数据
    async init() {
      this.tab = 1
      let sources = await window.electron.testDesktopCapturer()
      this.screenDataList = []
      let idList = []
      sources.forEach((item, index) => {
        if (item.id.indexOf('screen') > -1) {
          this.screenDataList.push(JSON.parse(JSON.stringify(sources[index])))
          idList.push(item.id)
        }
      })
      if (idList || idList.length > 0) {
        idList.forEach((item, index) => {
          sources.forEach((item2, index2) => {
            if (item2.id === item) {
              sources.splice(index2, 1)
            }
          })
        })
      }
      this.selectTab = sources[0].id
      let stream = await window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[0].id
          }
        }
      })
      console.log('stream=>', stream)
      this.sources = sources
      this.selectedName = sources[0].name
      this.$refs.videoScreenRef.srcObject = stream
    },
    // 切换tab页
    async selectTabs(tab) {
      if (tab === this.tab) return;
      this.tab = tab
      this.$nextTick(async () => {
        if (tab === 1) {
          this.selectTab = this.sources[0].id
          let stream = await window.navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: this.sources[0].id
              }
            }
          })
          this.selectedName = this.sources[0].name
          this.$refs.videoScreenRef.srcObject = stream
        }
        if (tab === 2) {
          this.selectTab = this.screenDataList[0].id
          let stream = await window.navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: this.screenDataList[0].id
              }
            }
          })
          this.selectedName = this.screenDataList[0].name
          this.$refs.videoScreenRef2.srcObject = stream
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>