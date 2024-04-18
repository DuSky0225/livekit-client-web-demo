/**
 * 动态加载第三方js.css
 * @param {*} src 路径
 * @param {*} isCss 是否为css文件
 */
function asynLoad(src, isCss = false) {
  return new Promise((res) => {
    let el;
    //设置js-map, css-map防止重复追加标签
    let cssMap = new Map();
    let jsMap = new Map();
    if (isCss) {
      let list = document.body.getElementsByTagName("link");
      for (let i = list.length - 1; i >= 0; i--) {
        let item = list[i];
        if (cssMap.get(item.stylesheet) == null) {
          //利用map设置link css
          cssMap.set(item.getAttribute("stylesheet"), i);
        }
      }

      //不存在追加，存在直接返回true
      if (cssMap.get(src) == null) {
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = src;
        appendDiv();
      } else {
        res(true);
      }
    } else {
      let list = document.body.getElementsByTagName("script");
      for (let i = list.length - 1; i >= 0; i--) {
        let item = list[i];
        if (jsMap.get(item.src) == null) {
          //利用map设置src js
          jsMap.set(item.getAttribute("src"), i);
        }
      }
      //不存在追加，存在直接返回true
      if (jsMap.get(src) == null) {
        el = document.createElement("script");
        el.src = src;
        appendDiv();
      } else {
        res(true);
      }
    }

    function appendDiv() {
      document.body.appendChild(el);
      //判断加载状态
      el.onload = el.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState == "loaded" ||
          this.readyState == "complete"
        ) {
          res(true);
        }
        this.onload = this.onreadystatechange = null;
      };
    }
  });
}

/**
 * 动态移除第三方js.css
 * @param {*} src 路径
 * @param {*} isCss 是否为css文件
 */
function asynRemove(src, isCss = false) {
  let el;
  if (isCss) {
    let list = document.body.getElementsByTagName("link");
    for (let i = list.length - 1; i >= 0; i--) {
      // let styleValue = list[i].getAttribute("stylesheet");
      let styleValue = list[i].href;
      if (styleValue && styleValue.indexOf(src) !== -1) {
        el = list[i];
      }
    }
  } else {
    let list = document.body.getElementsByTagName("script");
    for (let i = list.length - 1; i >= 0; i--) {
      let srcValue = list[i].getAttribute("src");
      if (srcValue && srcValue.indexOf(src) !== -1) {
        el = list[i];
      }
    }
  }
  // console.log(el);
  el && el.parentNode.removeChild(el);
}

function showCss() {
  const styleEle = document.createElement("style");
  styleEle.type = "text/css";
  styleEle.innerHTML = `.global-header-box-front{ display:block }`;
  styleEle.id = "jmeetingWebIMHeaderCss";
  document.body.appendChild(styleEle);
}
function hiddenCss() {
  // 获取将要被删除的元素
  var element = document.getElementById("jmeetingWebIMHeaderCss");
  console.log(element);
  // 从DOM中删除该元素
  element.parentNode.removeChild(element);
  // document.body.removeChild(element)
}

//导出
export { asynLoad, asynRemove, showCss, hiddenCss };
