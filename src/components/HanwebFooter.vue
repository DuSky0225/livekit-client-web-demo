<template>
  <!-- <footer>
    <p class="footerMes" v-if="$basic.isNeedFooter">
      <span>全国客户服务热线:&nbsp;&nbsp;400-969-0828&nbsp;&nbsp;南京总公司:&nbsp;&nbsp;江苏省南京市玄武区玄武大道699-40号</span>
    </p>
    <p class="footerMes">
      <span>2000-2023&nbsp;大汉软件股份有限公司&nbsp;版权所有&nbsp; <a href="https://beian.miit.gov.cn/#/Integrated/index"
          target="_blank" style="color:#FFF;">苏ICP备 05075050号</a>&nbsp;&nbsp;
      </span>
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32010202010709" target="_blank"
        style="color:#FFF;">
        <img src="@/assets/image/plice.png" alt="" />
        <span>&nbsp;苏公网安备&nbsp;32010202010709号</span></a>
    </p>
  </footer> -->
  <div class="footer" v-if="$basic.isNeedFooter">
    <div class="footercon">
      <p class="one">全国客户服务热线：<span style="color:white;margin-right:10px;">400-969-0828</span> 南京总公司：江苏省南京市玄武区玄武大道699-40号
      </p>
      <p class="two">2000-2023 大汉软件股份有限公司 版权所有 <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"
          style="color:#FFF;">苏ICP备 05075050号</a> <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32010202010709" target="_blank"
          style="color:#FFF;"><img src="@/assets/image/plice.png"
            style="padding-left:15px; padding-right:5px; padding-bottom:3px;">苏公网安备 32010202010709号</a> </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "HanwebFooter"
}
</script>
<style lang="less" scoped>
footer {
  font-size: 16px;
  // line-height: 22px;
  line-height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #191f31;
  padding: 20px 0;
  width: 100%;
  height: 110px;
  // position: fixed;
  // bottom: 0;
}

.footerMes {
  color: white;
}

footer p:nth-child(1) {
  margin-bottom: 5px;
}

footer p:nth-child(2) {
  display: flex;
  align-items: center;

  img {
    width: 18px;
    height: 20px;
  }
}

.footer {
  // position: fixed;
  // bottom: 0;
  width: 100%;
  background: #191f31;
  // height: 110px;
}

.lfooter {
  width: 100%;
  background: #191f31;
  height: 110px;
}

.lfooter {
  display: none;
}

.footercon p {
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  color: #ffffff;
  margin: 0;
}

.footercon p.one {
  padding-top: 20px;
  padding-bottom: 5px;
}

.footercon p.two {
  // padding-bottom: 20px;
  padding-bottom: 25px;
}
</style>