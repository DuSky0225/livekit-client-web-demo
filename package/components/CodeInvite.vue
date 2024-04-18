<template>
  <div class="codeInviteMain">
    <div class="main">
      <div class="codeBox">
        <div class="code" ref="codeRef"></div>
      </div>
      <span>扫一扫分享您的会议信息</span>
    </div>
    <footer>
      <button class="dismiss" @click="dismiss">取消</button>
      <button class="copy" @click="copy">复制闪会码</button>
    </footer>
    <!-- 复制二维码 生成画报 -->
    <div style="opacity: 0;position: absolute;z-index: -1;">
      <div class="meetCode" id="meetCode">
        <div class="codeBox">
          <span class="meetName">{{liveInfo.liveName}}</span>
          <div class="timeRange">
            <div class="time">
              <span>{{time1}}</span><span>{{date}}</span>
            </div>
            <div class="line"></div>
            <div class="onehour">1小时</div>
            <div class="line"></div>
            <div class="time">
              <span>{{time2}}</span><span>{{date}}</span>
            </div>
          </div>
          <span class="sponsor">邀请人：{{userName}}</span>
          <div class="middle">
            <div id="code2" class="code" ref="code2Ref"></div>
            <span class="tips">扫一扫，加入会议</span>
            <div class="footer">
              <div class="footerline"></div>
              <!-- <img src="../assets/image/companyLogo.png" alt=""> -->
              <span>闪会</span>
              <div class="footerline"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import html2canvas from "html2canvas";
import imMethods from '../tools/imMethods'
import { meetUrl_h5 } from '../config.js'
export default{
  name:'codeInvite',
  props:['liveMode','meetingObj','initLiveInfo'],
  methods:{
    creatQrCode() {
      let url= `${ meetUrl_h5 +'checkInfo?liveId='+this.liveInfo.iid+'&liveMode='+this.liveMode}`;
      let code = new QRCode(this.$refs.codeRef, {
          text: url, // 需要转换为二维码的内容
          width: 240,
          height: 240,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
      })
      // //创建图片，插入id为qrcode的div元素中
      // let code2Div = document.getElementById('code2');
      // code2Div.style.position = 'relative';
      // let img = document.createElement('img');
      // img.id = 'qrCodeIco';
      // img.src = require('../assets/image/companyLogo.png');
      // img.style.position = 'absolute';
      // img.style.width = '34px';
      // img.style.height = '34px';
      // img.style.top = 'calc(50% - 17px)';
      // img.style.left = 'calc(50% - 17px)';
      // code2Div.appendChild(img);
      let code2 = new QRCode(this.$refs.code2Ref, {
          text: url, // 需要转换为二维码的内容
          width: 175,
          height: 175,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
      })
      let table = document.getElementsByClassName("code")[0];
      table.removeAttribute("title");
    },
     //生成海报
    copy() {
      // 生成海报
      const vm = this;
      const domObj = document.getElementById("meetCode");
      html2canvas(domObj, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        letterRendering: true,
      }).then(function(canvas) {
        // 在微信里,可长按保存或转发
        vm.posterImg = canvas.toDataURL("image/png");
        const blob = vm.convertBase64UrlToBlob(vm.posterImg);
        navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]).then(res=>{
          vm.$toast('复制成功')
          console.log('复制成功');
        },err=>{
          vm.$toast('复制失败')
          console.log(err);
        })
      });
    },
    //base64转成blob格式
    convertBase64UrlToBlob(urlData){
      var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    },
    weekDay (time) {
      let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六',]
      return datelist[new Date(time).getDay()];
    },
    getDate(time){
      let date = new Date(time);
      let Y = date.getFullYear();
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
      let D = date.getDate()+1 < 10 ? '0'+(date.getDate()) : date.getDate() ;
      this.date = Y+'年'+M+'月'+D+'日';
      let hours =  date.getHours() < 10 ? '0' + date.getHours() : date.getHours() ;
      let minutes =  date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() ;
      this.time1 = hours + ':' + minutes;
      let hours2 =  date.getHours() < 9 ? '0'+ ( date.getHours()+1 ) : date.getHours()+1 ;
      // let minute2 =  date.getMinutes() < 9 ? '0'+ date.getMinutes() : date.getMinutes();
      this.time2 = hours2 <24 ? hours2 + ':' + minutes : "00"+ ':' + minutes;
      // this.timeRange = time1 + '-' + time2;
      // this.day = this.weekDay(this.date);
    },
    //取消
    dismiss(){
      this.$emit('dismiss');
    }
  },
  created(){
    this.liveInfo = this.initLiveInfo;
    this.userName = this.meetingObj.userName;
    this.getDate(this.liveInfo.createTime);
  },
  mounted(){
    this.creatQrCode();
  }
}
</script>
<style lang='less' scoped>
.codeInviteMain{
  height: 488px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .main{
    flex-direction: column;
    margin: 10px 30px;
    background: #F3F6F9;
    border-radius: 4px;
    width: calc(100% - 60px);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .codeBox{
      width: 260px;
      height: 260px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .code{
        width: 240px;
        height: 240px;
      }
    }
    span{
      font-size: 16px;
      color: #333333;
      margin-top: 16px;
      font-weight:500;
    }
  }
  footer{
    margin: 6px 0 16px;
    button{
      border-radius: 4px;
      height: 32px;
      font-size: 14px;
      cursor: pointer;
    }
    .copy{
      background: #1890FF;
      color: #FFFFFF;
      width: 110px;
      margin-left: 8px;
    }
    .dismiss{
      background: #FAFAFA;
      border: 1px solid rgba(221,221,221,1);
      color: #333333;
      width: 68px;
    }
  }
}
.meetCode{
  width: 375px;
  background: #F2F2F2;
  padding: 26px 16px;
  box-sizing: border-box;
  .codeBox{
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    .meetName{
      max-width: 280px;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      text-align: center;
      font-size: 20px;
      color: #000000;
      font-weight: 600;
      margin: 30px 0 6px;
    }
    .timeRange{
      display: flex;
      align-items: center;
      .time{
        display: flex;
        flex-direction: column;
        span:nth-of-type(1){
          font-size: 29px;
          color: #000000;
          text-align: center;
          font-weight: 500;
        }
        span:nth-of-type(2){
          font-size: 12px;
          color: #000000;
          text-align: center;
          font-weight: 500;
          margin-top: 5px;
        }
      }
      .line{
        border-bottom: 1px solid #ccc;
        width: 25px;
        margin: 0 8px 0 4px;
      }
      .onehour{
        line-height: 14px;
        width: 37px;
        height: 14px;
        background: #EBEEF3;
        border-radius: 2px;
        font-size: 11px;
        color: #5E6166;
        /* text-align: center; */
        font-weight: 400;
        text-align: center;
      }
    }
    .sponsor{
      font-size: 16px;
      color: #333333;
      text-align: center;
      margin: 20px 0 30px;
    }
    .middle{
      margin: 0 23px;
      width: calc(100% - 46px);
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top: 1px dashed #ccc;
      .code{
        width: 175px;
        height: 175px;
        margin: 30px 0 10px;
      }
      .tips{
        font-size: 12px;
        color: #666666;
      }
      .footer{
        display: flex;
        align-items: center;
        margin: 44px 0 25px;
        .footerline{
          border-bottom: 1px solid #ccc;
          width: 25px;
          margin: 0 18px;
        }
        img{
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
        span{
          font-size: 12px;
          color: #333333;
          font-weight: 500;
        }
      }
    }
  }
}
</style>