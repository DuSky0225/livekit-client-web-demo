<template>
  <div class='notFound'>
    <h3>404 页面不存在~</h3>
    <h4>您访问的页面不存在，请检查路径</h4>
  </div>
</template>
<script>
export default {
  methods: {

  }
}
</script>
<style lang="less">
.notFound {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h3{
  font-size: 32px;
}
</style>