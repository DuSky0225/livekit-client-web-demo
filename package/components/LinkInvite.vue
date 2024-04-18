<template>
  <div class="linkInviteMain">
    <div class="main">
      <span>{{userName}} 邀请你加入视频会议</span>
      <span>主题：{{liveInfo.liveName}}</span>
      <span>时间 : {{getDate(liveInfo.createTime)}}</span>
      <div class="link">{{'入会链接: '+ meetUrl +'check?liveId='+this.liveInfo.iid+'&liveMode='+this.liveMode}}</div>
    </div>
    <footer>
      <button class="dismiss" @click="dismiss">取消</button>
      <button class="copy" @click="copy">复制会议链接</button>
    </footer>
  </div>
</template>
<script>
import { meetUrl } from '../config.js'
export default{
  name:'linkInvite',
  props:['liveMode','meetingObj','initLiveInfo'],
  data(){
    return{
      meetUrl:meetUrl,
    }
  },
  methods:{
    //时间戳转换 
    getDate(time){
      let date = new Date(time);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = date.getDate()+1 < 10 ? '0'+(date.getDate()) : date.getDate() ;
      let h = ( date.getHours() < 10 ? '0'+ date.getHours() : date.getHours() )+ ':';
      let m = ( date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes() )+ ':';
      let s = ( date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds() );
      return Y+M+D+' '+h+m+s
    },
    //复制链接
    copy(){
      let text = `${this.userName}邀请你参加视频会议\n主题 : ${this.liveInfo.liveName}\n时间 : ${this.getDate(this.liveInfo.createTime)}\n入会链接 : ${ meetUrl +'check?liveId='+this.liveInfo.iid+'&liveMode='+this.liveMode}`;
      let domInput = document.createElement('textarea');
      domInput.value = text;
      document.body.appendChild(domInput);  // 添加input节点
      domInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$toast('链接已复制');
      domInput.remove()
    },
    //取消
    dismiss(){
      this.$emit('dismiss');
    }
  },
  created(){
    this.liveInfo = this.initLiveInfo;
    console.log(this.liveInfo);
    this.userName = this.meetingObj.userName;
  }
}
</script>
<style lang='less' scoped>
.linkInviteMain{
  height: 488px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .main{
    display: flex;
    flex-direction: column;
    margin: 10px 30px;
    background: #F3F6F9;
    border-radius: 4px;
    padding: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    width: calc(100% - 60px);
    box-sizing: border-box;
    span{
      margin-bottom: 16px;
    }
    .link{
      font-size: 16px;
    }
  }
  footer{
    margin: 6px 0 16px;
    cursor: pointer;
    button{
      border-radius: 4px;
      width: 68px;
      height: 32px;
      font-size: 14px;
    }
    .copy{
      background: #1890FF;
      color: #FFFFFF;
      margin-left: 8px;
      width: 110px;
    }
    .dismiss{
      background: #FAFAFA;
      border: 1px solid rgba(221,221,221,1);
      color: #333333;
      // margin-left: 8px;
    }
  }
}
</style>