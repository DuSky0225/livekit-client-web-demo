<template>
  <div></div>
</template>
<script>
export default {
  name: "h-water-mark",
  props: {
    // 显示的水印文本
    inputText: {
      type: String,
      default: "waterMark",
    },
    // 水印字体颜色
    color: {
      type: String,
      default: "rgba(255, 255, 255, 0.2)",
    },
    // 单个水印的宽
    width: {
      type: Number,
      default: 320,
    },
    // 单个水印的高
    height: {
      type: Number,
      default: 150,
    },
    // 水印个数
    type: {
      type: String,
      default: 'single',
    }
  },
  data() {
    return {
      observer: null,
    };
  },
  mounted() {
    if (this.type === 'single') {
      this.addWatermark(this.inputText)
    } else {
      this.init();
    }
    this.Monitor()
  },
  methods: {
    // 生成水印DOM节点
    init() {
      let canvas = document.createElement("canvas");
      canvas.id = "canvas";
      canvas.width = this.width; // 单个水印的宽高
      canvas.height = this.height;
      this.maskDiv = document.createElement("div");
      let ctx = canvas.getContext("2d");
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      ctx.translate(x, y); // 移动到中心
      ctx.rotate(-Math.PI / 6); // 旋转45度
      ctx.translate(-x, -10); // 移动回原点
      // context.font = "fontStyle fontWeight fontSize fontFamily";
      ctx.font = "normal 18px Microsoft Yahei"; // 设置样式
      ctx.fillStyle = this.color; // 水印字体颜色
      // ctx.rotate(30 * Math.PI / 180); // 水印偏转角度
      ctx.fillText(this.inputText, 30, 20);
      let src = canvas.toDataURL("image/png");
      this.maskDiv.style.position = "absolute";
      this.maskDiv.style.zIndex = "9999";
      this.maskDiv.id = "_waterMark";
      this.maskDiv.style.top = "0";
      this.maskDiv.style.left = "0";
      this.maskDiv.style.height = "100%";
      this.maskDiv.style.width = "100%";
      // this.maskDiv.style.top = '52px';
      // this.maskDiv.style.right = '232px';
      this.maskDiv.style.pointerEvents = "none";
      this.maskDiv.style.backgroundImage = "URL(" + src + ")";
      // 水印节点插到body下
      let el = document.getElementById('videoBox')
      console.log('el-->',el)
      el.appendChild(this.maskDiv);
    },
    // 监听更改，更改后执行callback回调函数，会得到一个相关信息的参数对象
    Monitor() {
      /* eslint-disable */
      this.observer = new MutationObserver((mutationsList) => {
        this.observer.disconnect(); // 停止监听
        // 删除水印
        const waterMark = document.getElementById("_waterMark");
        if (waterMark) {
          document.body.removeChild(waterMark);
        }
        if (this.type === 'single') {
          this.addWatermark(this.inputText)
        } else {
          this.init();
        }
        this.observer.observe(document.body, {
          childList: true,
          attributes: true,
          subtree: true,
          attributesOldValue: true,
          characterData: true,
          characterDataOldValue: true,
        }); // 重新开始监听
      });
      /* eslint-disable */
      this.observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true,
        attributesOldValue: true,
        characterData: true,
        characterDataOldValue: true,
      });
    },
    addWatermark(text) {
      // 创建水印div
      const watermark = document.createElement('div');
      watermark.style.position = 'fixed';
      watermark.style.bottom = '50%';
      watermark.style.right = '50%';
      watermark.style.transform = "rotate(-30deg) translate(30%,100%)"
      watermark.style.color = 'rgba(255, 255, 255, 0.2)';
      watermark.style.zIndex = '9999';
      watermark.style.pointerEvents = 'none'; // 确保水印不会阻挡页面上其他元素的交互
      watermark.style.userSelect = 'none'; // 防止文字被选中
      watermark.style.fontSize = '36px';
      watermark.textContent = text;
      watermark.id = "_waterMark";
      // 将水印添加到body中
      let el = document.getElementById('videoBox')
      if(el) {
        console.log('el-->',el)
      }
      el.appendChild(watermark);
    }
  },
  beforeDestroy() {
    // 删除水印
    const waterMark = document.getElementById("_waterMark");
    if (waterMark) {
      document.body.removeChild(waterMark);
    }
    this.observer.disconnect();
  },
};
</script>