<template>
  <div class="main2">
    <div class="content">
      <div class="setting_title">
        关于隐私设置
      </div>
      <p>macOS 10.15 加入了全新的隐私机制，您使用的功能可能会受到限制。因此，部分系统需要获取到隐私权限。如果您对这些权限存在顾虑，可以选择拒绝授权并。但需要注意的是，没有完成权限授权前，相关功能将无法正常工作。</p>
      <h1>摄像头和麦克风</h1>
      <p>电话/视频会议、远程投屏和直播均需要使用摄像头和麦克风权限。</p>
      <h1>屏幕录制</h1>
      <p>
        视频会议的屏幕共享、投屏和截图均需要使用屏幕录制权限。
        此权限是 macOS 10.15 全新引入的，用于限制第三方应用捕获除自身应用以外的屏幕内容。
      </p>
      <h1>如何手动设置所需权限？</h1>
      <p>如果您后续需要使用这些功能，请打开“系统偏好设置”并进入“安全性与隐私”设置面板：</p>
      <img class="content_img" src="../assets/11.png" alt>
        <p>然后点击小锁图标并输入密码（或验证触控 ID）：</p>
      <img class="content_img" src="../assets/22.png" alt>
      <p>勾选上述权限中的“微联”，并重新启动应用程序即可正常使用相关功能。</p>
      <img class="content_img" src="../assets/33.png" alt>
      <h1>应用列表中没有找到“微联”？</h1>
      <p>由于目前 macOS 中存在的一些问题，您可能会遇到在设置的应用列表中无法找到“微联”的情况。此时您可以尝试重置系统权限数据库来恢复，但请注意，使用该方法可能会导致您之前授权过的应用需要再次授权。建议您仅当上述方式均无法正常工作时再尝试该方式。
        首先需要完全退出“微联”，然后打开系统内置的“终端”应用，并执行如下命令：
        tccutil reset All
        重新启动“微联”后再次尝试上述的正常方法即可。若仍然无法成功设置，请尝试重新启动您的电脑。</p>
        <div class="setting_queding">
          <span>确定</span>
        </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "Settings",
};
</script>
 
<style scoped lang="less">
.main2 {
  // width: 100%;
  display: flex;
  // justify-content: center;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  overflow: scroll;
  padding-top: 52px;
  height: 92%;
}
.content {
  width: 85%;
  line-height: 1.5;
  // padding-bottom: 32px;
  background: #fff;
  padding: 0 32px 0px 32px;
}
.content_img {
    width: 65%;
    margin-top: 16px;
}
h1 {
  font-weight: bold;
  margin-top: 16px;
}
.setting_title {
  height: 55px;
  font-family: PingFangSC-Medium,Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 20px;
  color: rgba(0,0,0,0.85);
  text-align: center;
  // line-height: 28px;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  line-height: 55px;
  margin-bottom: 20px;

}
.setting_queding {
  height: 55px;
  line-height: 55px;
  border-top: 1px solid #eee;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    display: inline-block;
    width: 160px;
    height: 32px;
    background: #1890FF;
    border-radius: 4px;
    font-family: PingFangSC-Regular,Helvetica, Arial, Verdana, Tahoma, sans-serif;
    font-size: 14px;
    color: #FFFFFF;
    // text-align: left;
    // line-height: 22px;
    font-weight: 400;
    text-align: center;
    line-height: 32px;
  }
}
p{
  font-family: PingFangSC-Regular,Helvetica, Arial, Verdana, Tahoma, sans-serif;
  font-size: 14px;
  color: #666666;
  line-height: 22px;
  font-weight: 400;
}
</style>