export default{
    //获取路径参数
    getUrlParams(name) {
      let paramsDic = {},
        str = window.location.href, //取得整个地址栏
        num = str.indexOf('?')
      str = str.substr(num + 1) //取得所有参数
      let arr = str.split('&') //各个参数放到数组里
      for (let i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=')
        if (num > 0) {
          let name = arr[i].substring(0, num),
            value = arr[i].substr(num + 1)
          paramsDic[name] = value
        }
      }
      return paramsDic[name] ? decodeURI(paramsDic[name]) : ''
    },
    //取整
    formatFlow(value, n) {
      var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        s += ".";
      }
      for (var i = s.length - s.indexOf("."); i <= n; i++) {
        s += "0";
      }
      return s;
    },
    // 生成11位随机数
    getNum() {
      var num = "";
      for (var i = 0; i < 11; i++) {
        num += Math.floor(Math.random() * 9 + 1);
      }
      return num;
    },
    getGroup(e){
        let grouplist = (window.localStorage.getItem("groupList")!=='undefined' ? JSON.parse(window.localStorage.getItem("groupList")):[]);
        return grouplist[e]
    },
    getRemark(e){
        let remarkList = JSON.parse(window.localStorage.getItem("remarkList"));
        return remarkList[e];
    },
    //获取后缀
    getLastname(name) {
        //获取最后一个.的位置
          let lastIndexOf = name.lastIndexOf(".");
          //获取文件的后缀名 .jpg
          let suffix = name.substring(lastIndexOf);
          //获取后缀不加参数 jpg
          if(suffix.toLowerCase().split(".")[1].indexOf("&")!==-1){
            return suffix.toLowerCase().split(".")[1].split("&")[0];
          }else{
            return suffix.toLowerCase().split(".")[1]
          } 
      },
      isPicture(name){
        let fileName = this.getLastname(name);
        let imgType = ["tif", "tiff", "svg", "bmp", "png", "gif", "jpeg", "jpg"];
        return  imgType.findIndex((item) => item == fileName) !== -1
      },
      //获取文件路径参数
      getUrlParam: function (content, name) {
        let paramsDic = {},
          str = content, //取得整个地址栏
          num = str.indexOf("?");
        str = str.substr(num + 1); //取得所有参数
        let arr = str.split("&"); //各个参数放到数组里
        for (let i = 0; i < arr.length; i++) {
          num = arr[i].indexOf("=");
          if (num > 0) {
            let name = arr[i].substring(0, num),
              value = arr[i].substr(num + 1);
            paramsDic[name] = value;
          }
        }
       
        return paramsDic[name] ? decodeURI(paramsDic[name]) : "";
      },
      //获取文件大小
      getDocumentSize(content,name){
       let size= this.getUrlParam(content, name) / 1024 > 1024
          ? this.formatFlow(
              this.getUrlParam(content, name) /
                1024 /
                1024,
              1
            ) + "MB"
          : this.formatFlow(
              this.getUrlParam(content, name) / 1024,
              1
            ) > 1
          ? +this.formatFlow(
              this.getUrlParam(content, name) / 1024,
              1
            ) + "KB"
          : this.getUrlParam(content, name) + "B"
        return size
      },
      goXz(item) {
        // 使用获取到的blob对象创建的url
        let filePath=item;
        // if (item.content.includes("jpg")) {
        //   let url = item.content.split(".jpg");
        //   filePath = url[0] + "preview.jpg" + url[1];
        // } else {
        //   filePath = item.content;
        // }
        fetch(filePath)
          .then((res) => res.blob())
          .then((blob) => {
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            // 使用获取到的blob对象创建的url
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            // 指定下载的文件名
            a.download = this.getUrlParam(filePath, "fileName");
            a.click();
            document.body.removeChild(a);
            // 移除blob对象的url
            window.URL.revokeObjectURL(url);
            // this.chid = null;
          });
      },
     // 处理时间
     formatting(e) {
        let time = new Date(e);
        let mm =
          time.getMonth() + 1 > 9
            ? time.getMonth() * 1 + 1
            : "0" + (time.getMonth() * 1 + 1);
        let dd = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
        
        const stamp1 = new Date(new Date().setHours(0, 0, 0, 0)).getTime(); //获取当天零点的时间
        const stamp2 = new Date(
          new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000 - 1
        ).getTime(); //获取昨天23:59:59的时间
        if (time.getTime() > stamp1) {
          return "今天";
        } else if (time.getTime() < stamp2) {
          return mm + "-" + dd;
        } else {
          return "昨天";
        }
      },
    getTimeState () {
        // 获取当前时间
        let timeNow = new Date();
        // 获取当前小时
        let hours = timeNow.getHours();
        // 设置默认文字
        let text = ``;
        // 判断当前时间段
        if (hours >= 0 && hours < 12) {
            text = `早上好，今天请继续加油！`;
        } else if (hours >= 12 && hours <= 18) {
            text = `下午好，喝杯茶吧，让精神抖擞起来。`;
        } else if (hours > 18 && hours <= 24) {
            text = `晚上好，请注意休息。`;
        }
        // 返回当前时间段对应的状态
        return text;
    },
    getAtinfo(e,type){
        e=e.split('@_').filter(Boolean);        
        e=e.join('_@')        
        e=e.split('_@')
        let status=false
        for(let i=0;i<e.length;i++){
            try {
                let item=JSON.parse(e[i])                
                if(type){
                  if(item.userName){
                    status=true
                    e[i]={}
                    e[i].name=item.userName
                    e[i].id=item.userId
                  }
                }else{
                  if(item.userName)e[i]=`<span class=atspan>@${item.userName}</span>`
                }
            } catch (error) {   
            }            
        }
        if(type && status){
          for(let i=0;i<e.length;i++){
            if(typeof(e[i])=='string'){
              if(e[i].includes('{"all":true}')){
                e[i]= e[i].replace('{"all":true}',`<span class=atspan>@所有人</span>&nbsp`)
              }
              if(e[i].includes('{"all":"true"}')){
                e[i]= e[i].replace('{"all":"true"}',`<span class=atspan>@所有人</span>&nbsp`)
              }
            }
            
          }
        }else{
          e=e.join('')
          if(e.includes('{"all":true}')){
              e= e.replace('{"all":true}',`<span class=atspan>@所有人</span>&nbsp`)
          }
          if(e.includes('{"all":"true"}')){
                e= e.replace('{"all":"true"}',`<span class=atspan>@所有人</span>&nbsp`)
            }
        }
        return e
    },
    // 等比缩小图片
    changeImg(item,index) {      
      var start_time = new Date().getTime()
      // 图片地址 后面加时间戳是为了避免缓存
      var img_url = item + start_time
      // 创建对象
      var img = new Image()
      // 改变图片的src
      img.src = img_url
      // 定时执行获取宽高
      
      // var set = setInterval(check,40)
      var set= setInterval(() => {
        if (img.width>0 || img.height>0) {
          let ys_w = img.width;
          let ys_h = img.height;
          let width=364
          let height=361
          if(ys_w > width || ys_h > height)
          {
            var scale;
            var scale1 = ys_w / width;
            var scale2 = ys_h / height;
            if(scale1 > scale2)
            {
              scale = scale1;
            }
            else
            {
              scale = scale2;
            }
            ys_w=ys_w / scale
            ys_h=ys_h / scale
          }
            clearInterval(set);
            
            let classname='.elimg'+index
            if(document.querySelector(classname)){
              document.querySelector(classname).style.width=ys_w+'px'
              document.querySelector(classname).style.height=ys_h+'px'
              document.querySelector(classname).classList.add('eloverimg')
            }
            
       }
      }, 40);
      return set
    },
    fireKeyEvent(el, evtType, keyCode) {
        var evtObj;
        if (document.createEvent) {
            if (window.KeyEvent) {//firefox 浏览器下模拟事件
                evtObj = document.createEvent('KeyEvents');
                evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
            } else {//chrome 浏览器下模拟事件
                evtObj = document.createEvent('UIEvents');
                evtObj.initUIEvent(evtType, true, true, window, 1);
      
                delete evtObj.keyCode;
                if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                    Object.defineProperty(evtObj, "keyCode", { value: keyCode });                       
                } else {
                    evtObj.key = String.fromCharCode(keyCode);
                }
      
                if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                    Object.defineProperty(evtObj, "ctrlKey", { value: true });
                } else {
                    evtObj.ctrlKey = true;
                }
            }
            el.dispatchEvent(evtObj);
      
        } else if (document.createEventObject) {//IE 浏览器下模拟事件
            evtObj = document.createEventObject();
            evtObj.keyCode = keyCode
            el.fireEvent('on' + evtType, evtObj);
        }
      }
}