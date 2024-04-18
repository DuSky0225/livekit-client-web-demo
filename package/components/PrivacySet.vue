<template>
  <div v-if="seetingShow" class="settings">
    <div class="settings_box">
      <div class="content">
        <div class="setting_title">
          关于隐私设置
          <img
            @click="noseeting"
            class="img_deleted"
            src="../assets/images/img_deleted.png"
            alt=""
          />
        </div>
        <div class="contnet_text" style="overflow: scroll">
          <p>
            MacOS 10.15
            加入了全新的隐私机制，您使用的功能可能会受到限制。因此，部分系统需要获取到隐私权限。如果您对这些权限存在顾虑，可以选择拒绝授权。但需要注意的是，没有完成权限授权前，相关功能将无法正常工作。
          </p>
          <h1 style="margin-top: 30px">摄像头和麦克风</h1>
          <p>视频/语音会议需要使用摄像头和麦克风权限。</p>
          <h1>屏幕录制</h1>
          <p>
            视频会议的屏幕共享需要使用屏幕录制权限。 此权限是 MacOS 10.15
            全新引入的，用于限制第三方应用捕获除自身应用以外的屏幕内容。
          </p>
          <h1>如何手动设置所需权限？</h1>
          <p>
            如果您后续需要使用这些功能，请打开“系统偏好设置”并进入“安全性与隐私”设置面板：
          </p>
          <img class="content_img" src="../assets/images/11.png" alt />
          <p>然后点击小锁图标并输入密码（或验证触控 ID）：</p>
          <img class="content_img" src="../assets/images/22.jpeg" alt />
          <p>
            勾选上述权限中的“微联叮”，并重新启动应用程序即可正常使用相关功能。
          </p>
          <img class="content_img" src="../assets/images/33.jpeg" alt />
          <h1>应用列表中没有找到“微联叮”？</h1>
          <p style="margin-bottom: 20px">
            由于目前 MacOS
            中存在的一些问题，您可能会遇到在设置的应用列表中无法找到“微联叮”的情况。此时您可以尝试重置系统权限数据库来恢复，但请注意，使用该方法可能会导致您之前授权过的应用需要再次授权。建议您仅当上述方式均无法正常工作时再尝试该方式。
            首先需要完全退出“微联叮”，然后打开系统内置的“终端”应用，并执行如下命令：
            tccutil reset All
            重新启动“微联叮”后再次尝试上述的正常方法即可。若仍然无法成功设置，请尝试重新启动您的电脑。
          </p>
        </div>

        <div class="setting_queding" @click="noseeting">
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'PrivacySet',
  data(){
    return{
      seetingShow:false,
    }
  },
  methods:{
    open(){
      this.seetingShow = true;
    },
    noseeting() {
      this.seetingShow = false
    },
  }
}
</script>
<style lang="less" scoped></style>
