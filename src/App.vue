<template>
  <div id="app">
    <router-view v-if="routerAlive" />
  </div>
</template>
<script>
</script>
<script>

export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      routerAlive: true,
    }
  },
  methods: {
    //重新加载的方法
    reload() {
      this.routerAlive = false
      this.$nextTick(function () {
        this.routerAlive = true
      })
    },
  },
  computed: {
    noReadNum() {
      return this.$store.state.noReadNum
    },
  },
  watch: {
    noReadNum(val) {
      let count = (val > 99 ? 99 : val)
      if (count >= 0) {
        const countEle = document.getElementById('imCount')
        const noticeEle = document.getElementById('notice')
        if (countEle) {
          document.querySelector('#imCount').style.visibility=(count>0 ? "visible" : "hidden")
          document.querySelector('#imCount .count').innerHTML = count
        } else {
          if(count==0){
            return
          }
          if (noticeEle) {
            noticeEle.insertAdjacentHTML(
              'afterBegin',
              '<span id="imCount" style="position: absolute; width: 14px; height: 14px; background-color: red; top: 15px; right: 14px; line-height: 14px; text-align: center; border-radius: 7px; color: #fff; font-size: 12px"><span class="count" style="display: block; transform: scale(.75); word-break: keep-all !important;">' +
              count +
              '</span></span>'
            )
          }
        }
      }
    },
  },
  created() {    
  },
  mounted() {
    let topchatList=localStorage.getItem('topchatList')?JSON.parse(localStorage.getItem('topchatList')):[]
    if(topchatList.length>0){
      for(let i=0;i<topchatList.length;i++){
        if(topchatList[i]){
          topchatList[i].draft=''
        }
      }
    }
    window.localStorage.setItem('topchatList',JSON.stringify(topchatList))   
    window.onbeforeunload = function(){
        sessionStorage.removeItem("chatList")
        sessionStorage.removeItem("chatId")
        sessionStorage.removeItem("vuex")
        sessionStorage.removeItem("uploadSession")    
        
      }
    
  },
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  color: #333;
  height: 100%;
  p {
    // margin-bottom: 0 !important;
  }

}
</style>
