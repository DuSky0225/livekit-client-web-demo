import CryptoJS from "crypto-js/crypto-js";
import html2canvas from "html2canvas";
import JSEncrypt from "jsencrypt";
import { sm2 } from "sm-crypto";
const SM4 = require("gm-crypt").sm4;
let sm4Config = {
  key: "hanweb//jmeeting",
  mode: "ecb", // 加密的方式有两种，ecb和cbc两种，看后端如何定义的，cbc需要iv参数，ecb不用
  // iv: '', // 初始向量，cbc模式的第二个参数，也需要跟后端配置的一致
  cipherType: "base64",
};
let sm4 = new SM4(sm4Config);

// 默认的 KEY 与 iv 如果没有给
let codeStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// let sm2Public='0411a0f04874590be9452f1428e27ca712456137bd9099beed12c137548712cfe3e51ef7d5db2c289a347c2c67a0740e6260e3a7fbe5313c0979554cd0136f2ad5'
const tools = {
  debounce: (() => {
    let timer = null;
    return (callback, wait) => {
      clearTimeout(timer);
      timer = setTimeout(callback, wait);
    };
  })(),
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
  // sm2 加密
  encrypt: function (str, sm2Public) {
    return "04" + sm2.doEncrypt(str, sm2Public, 1);
  },
  // sm2 解密
  decrypt: function (str, privateKey) {
    return sm2.doDecrypt(str.slice(2), privateKey, 1);
  },
  //sm4加密
  sm4Encrypt: function (str) {
    return sm4.encrypt(str);
  },
  //sm4解密
  sm4Decrypt: function (str) {
    return sm42.decrypt(str);
  },
  // rsa解密
  RSAdecryption: function (str) {
    // 注册方法
    let pubKey = `-----BEGIN PRIVATE KEY-----
        MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMkemc5UcY1288YC
        w1mAcC08juF+8OZ3ijTwerN1Wsvbyr3MO5I8ALU4vrNHapXTA3r6AesH8fvDVa19
        kQxkBav3lfaoBJeRrbSat/uwOiVua4HbTdRbpeAWD9t1lz8YYfXUZ10LFkoeB5Kv
        8GK9D0xj6IEmRy21EBW1ZmW3CA+dAgMBAAECgYAPWA5T941SRakDimJtCaeFTAF6
        oryuWKBquY4i8ukidHpbUKGa3okPSm0CMIipNZgmYbyTud90XcrDmbjfQSJNgcEt
        uc3n9nwZKAzF3Z5NOkRSGoyBeHK6FUPLvE/DyCg8hAvioopO9L98FJWKn/BAlLeG
        sNMzclT55HptrzfDAQJBAO+/vtXmjGQDS07gvr6vUktSrApiNtfnolL7xmuTSAwI
        O6ShuQCq12aucqT534g6WO8zYgZssao3MhzobG7SUFkCQQDWwIktroq/r1hKTvKu
        +UVi6lOfBTbcaVMPyEFFOm/iXZWDT1V6ZaMY6avq7lxsY9/zRLd6Rzgs0odceCDt
        0bDlAkEAuG/JLqKy5AnIuICbHPShGYMbCM3vpP70WGSKi519Moxu3cLwILxNAxg2
        6AW2WgWQ/0uHIKwjrW/S5HxFVqgC2QJAMpB8/EOXqdCYgk6ad7Z7rvGrpMqugzFN
        fG7TZ4B97ZfJZ3SblMkvoOMMNrHPEzpk9budU+5G/M7JTm1+m2B/PQJAKPWyrnrA
        UzJe7DJVUJd385MGUrI05bLQfj3LtjrZBQ/z+ACaBnXmFBsg9HIoNn1qgn2jVVVh
        MeFRpxPx6rEMGw==
        -----END PRIVATE KEY-----
        `; // ES6 模板字符串 引用 rsa 私钥
    let encryptStr = new JSEncrypt();
    encryptStr.setPrivateKey(pubKey); // 设置 私钥
    let data = encryptStr.decrypt(str.toString()); // 进行解密
    return data;
  },
  // rsa加密
  RSAencryption: function (str) {
    // 注册方法
    let pubKey = `-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCEMP9eCvw+HPjYYpIb7saaYNZG7El2a4EJppSPV9TCQwoRusb4CG8r2JXysxIQDqXpwJOFL0os+HHlnW06iz4EvgkIFSLQ/U9VyW/fpyDe3Y3nqcFrJqZQGb2q+9YgF2oifNKqeaZ5FTO4Ix7d1qLR3Cazyv04i93NJe9ggyrKUwIDAQAB
        -----END PUBLIC KEY-----`; // ES6 模板字符串 引用 rsa 公钥
    let encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(pubKey); // 设置 加密公钥
    let data = encryptStr.encrypt(str.toString()); // 进行加密
    return data;
  },
  // 信息校验 start
  // 手机号校验
  isPhone: function (phoneStr) {
    let myreg =
      /^((13[0-9])|(14[1|4|5|6|7|8|9])|(15([0|1|2|3|5|6|7|8|9]))|(16[2|5|6|7])|(17[0|1|2|3|5|6|7|8])|(18[0-9])|(19[1|8|9]))\d{8}$/;
    if (!myreg.test(phoneStr)) {
      return false;
    } else {
      return true;
    }
  },
  // 身份证号校验
  isCard: function (cardStr) {
    let myreg =
      /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X]|[x])$/;
    if (!myreg.test(cardStr)) {
      return false;
    } else {
      return true;
    }
  },
  // 统一社会信用代码
  validateUnifiedSocialCreditCode: function (code) {
    if (code.length !== 18) {
      return false;
    }

    // 各位加权因子
    const weights = [
      1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28,
    ];

    // 校验字符集
    const chars = "0123456789ABCDEFGHJKLMNPQRTUWXY";

    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const char = code[i];
      const charIndex = chars.indexOf(char);
      if (charIndex === -1) {
        return false;
      }
      sum += charIndex * weights[i];
    }

    const checksumIndex = (31 - (sum % 31)) % 31;
    const checksumChar = chars[checksumIndex];

    return code[17] === checksumChar;
  },
  // 邮箱校验
  isEmail: function (emailStr) {
    let myreg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (!myreg.test(emailStr)) {
      return false;
    } else {
      return true;
    }
  },
  // 信息校验 end

  // 信息脱敏 start
  /**
   *
   * @param {身份号} cardStr
   * @param {手机号} phoneStr
   * @param {姓名} name
   * @param {邮箱} emailStr
   * @param {用户名} Accountname
   */
  idcardDesensitization: function (
    cardStr = "",
    phoneStr = "",
    name = "",
    emailStr = "",
    Accountname = ""
  ) {
    let star = "*";
    const len = cardStr.toString().length - 4;
    for (let i = 1; i < len; i++) {
      star = star + "*";
    }
    return {
      userName: name.replace(/.(?=.)/g, "*"),
      mobile: phoneStr.substring(0, 3) + "****" + phoneStr.substring(7, 11),
      idCard: star + cardStr.substring(14, 18),
      Accountname: Accountname.replace(/.(?=.)/g, "*"),
      email:
        emailStr.substr(0, 2) + "****" + emailStr.substr(emailStr.indexOf("@")),
    };
  },
  // 信息脱敏 end

  //信息加密工具类 start
  // aes 加密

  /**
   * AES加密 ：字符串 key iv  返回base64
   */
  // Encrypt: function (word, keyStr = s, ivStr) {
  //     let key = KEY
  //     // let iv = IV
  //     if (keyStr) {
  //         key = CryptoJS.enc.Utf8.parse(keyStr);
  //         // iv = CryptoJS.enc.Utf8.parse(ivStr);
  //     }
  //     console.log(keyStr,'=====================')
  //     let srcs = CryptoJS.enc.Utf8.parse(word);
  //     let encrypted = CryptoJS.AES.encrypt(srcs, key, {
  //         // iv: iv,
  //         mode: CryptoJS.mode.ECB,
  //         padding: CryptoJS.pad.Pkcs7
  //     });
  //     return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  // },
  Encrypt(data, key, iv) {
    if (typeof data === "object") {
      // 如果传入的data是json对象，先转义为json字符串
      try {
        data = JSON.stringify(data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    // 统一将传入的字符串转成UTF8编码
    const dataHex = CryptoJS.enc.Utf8.parse(data); // 需要加密的数据
    const keyHex = CryptoJS.enc.Utf8.parse(key); // 秘钥
    const ivHex = CryptoJS.enc.Utf8.parse(iv); // 偏移量
    const encrypted = CryptoJS.AES.encrypt(dataHex, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.ECB, // 加密模式
      padding: CryptoJS.pad.Pkcs7,
    });
    let encryptedVal = encrypted.ciphertext.toString();
    return encryptedVal; //  返回加密后的值
  },
  /**
   * AES 解密 ：字符串 key iv  返回base64
   *
   */
  Decrypt: function (encryptedVal, key, iv) {
    /*
      传入的key和iv需要和加密时候传入的key一致  
    */
    // 统一将传入的字符串转成UTF8编码
    let key2 = key
      ? "04b9d0dd5e08443492f6729db2bd1fd8"
      : "21f48862ab794c3caebf30398487bd01";
    let encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedVal);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const keyHex = CryptoJS.enc.Utf8.parse(key2); // 秘钥
    const ivHex = CryptoJS.enc.Utf8.parse(iv); // 偏移量
    let decrypt = CryptoJS.AES.decrypt(srcs, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },
  //信息加密工具类 end
  //通用工具类 start
  // 格式化时间戳(
  /**
   *
   * @param {时间戳 可不传} date
   */
  formatTime: function (date = new Date()) {
    let o = {
      y: date.getFullYear(), //年份
      M:
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1, //月份
      d: date.getDate() < 10 ? "0" + date.getDate() : date.getDate(), //日
      // "h": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
      H: date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //小时
      m: date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(), //分
      s: date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(), //秒
    };
    return {
      o,
      type: o.y + "-" + o.M + "-" + o.d + " " + o.H + ":" + o.m + ":" + o.s,
      typeOne: o.y + "-" + o.M + "-" + o.d,
      typeTwo: o.y + "/" + o.M + "/" + o.d + " " + o.H + ":" + o.m + ":" + o.s,
      typeThree: o.y + "/" + o.M + "/" + o.d,
      typeFour: o.y + "年" + o.M + "月" + o.d + "日",
      typeFive:
        o.y +
        "年" +
        o.M +
        "月" +
        o.d +
        "日" +
        " " +
        o.H +
        ":" +
        o.m +
        ":" +
        o.s,
      typeSix: o.H + ":" + o.m,
      typeSeven: o.M + "月" + o.d + "日 " + o.H + ":" + o.m,
      typeEight: o.M + "月" + o.d + "日 ",
    };
  },
  timeChange(timeValue) {
    timeValue = new Date(timeValue).getTime();
    var returnTime = "";
    if (this.isToday(timeValue) === true) {
      // 今日
      returnTime = this.formatTime(new Date(timeValue)).typeSix;
    } else if (this.isYestday(timeValue) === true) {
      // 昨天
      returnTime = "昨天 " + this.formatTime(new Date(timeValue)).typeSix;
    } else if (this.isYear(timeValue) === true) {
      // 今年
      returnTime = this.formatTime(new Date(timeValue)).typeSeven;
    } else if (this.isYear(timeValue) === false) {
      // 不属于今年
      returnTime = this.formatTime(new Date(timeValue)).typeFour;
    }
    return returnTime;
  },
  isToday(timeValue) {
    // 是否为今天
    if (new Date(timeValue).toDateString() === new Date().toDateString()) {
      return true;
    } else {
      return false;
    }
  },
  isYestday(timeValue) {
    // 是否为昨天
    const date = new Date(timeValue);
    const today = new Date();
    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth()
    ) {
      if (today.getDate() - date.getDate() === 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  isYear(timeValue) {
    // 是否为今年
    const dateyear = new Date(timeValue).getFullYear();
    const toyear = new Date().getFullYear();
    if (dateyear === toyear) {
      return true;
    } else {
      return false;
    }
  },
  // 判断手机是否为iPhoneX
  isIphoneX: function () {
    return (
      /iphone/gi.test(navigator.userAgent) &&
      screen.height == 812 &&
      screen.width == 375
    );
  },
  getNum: function () {
    var chars = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    var randomNum = "";
    for (var i = 0; i < 32; i++) {
      var id = parseInt(Math.random() * 61);
      randomNum += chars[id];
    }
    return randomNum;
  },
  // 获取当前时段
  getMoment: function () {
    const h = new Date().getHours();
    let greetingMsg = "";
    if (0 <= h && h < 6) {
      greetingMsg = "凌晨好";
    } else if (6 <= h && h <= 11) {
      greetingMsg = "早上好";
    } else if (11 < h && h <= 14) {
      greetingMsg = "中午好";
    } else if (14 < h && h <= 17) {
      greetingMsg = "下午好";
    } else if (17 < h && h <= 24) {
      greetingMsg = "晚上好";
    }
    return greetingMsg;
  },
  // 获取随机验证码
  // 用来生成随机整数
  getRandom: function (n, m) {
    // param: (Number, Number)
    n = Number(n);
    m = Number(m);
    // 确保 m 始终大于 n
    if (n > m) {
      let temp = n;
      n = m;
      m = temp;
    }
    return Math.floor(Math.random() * (m - n) + n);
  },
  /**
   *
   * @param {页面提示元素的id} element
   */
  getCode: function (element) {
    let str = "";
    // 验证码有几位就循环几次
    for (let i = 0; i < 4; i++) {
      let ran = this.getRandom(0, 62);
      str += codeStr.charAt(ran);
    }
    if (element) {
      document.getElementById(element).innerText = str;
    }
    return str;
  },
  // 验证密码强度
  /**
   *
   * @param {设置的密码} oValue
   */
  passwordStrength: function (oValue) {
    oValue = oValue.replace(/[\u4E00-\u9FA5]/g, "");
    if (/\d/.test(oValue) && /[a-z]/.test(oValue) && /[A-Z]/.test(oValue)) {
      return {
        type: "2",
        text: "强",
      };
    } else if (
      /^\d+$/.test(oValue) ||
      /^[A-Z]+$/.test(oValue) ||
      /^[a-z]+$/.test(oValue)
    ) {
      return {
        type: "0",
        text: "弱",
      };
    } else {
      return {
        type: "1",
        text: "中",
      };
    }
  },
  // base64 压缩
  /**
   *
   * @param {input type=file 的 id} ele
   * @param {缩放比例} bili
   */
  base64Compression: function (ele, bili = 3, vue) {
    let file = document.getElementById(ele).files[0]; //取传入的第一个文件
    if (undefined == file) {
      //如果未找到文件，结束函数，跳出
      return;
    }
    return new Promise((resolve) => {
      let r = new FileReader();
      r.readAsDataURL(file);
      r.onload = function (e) {
        let base64 = e.target.result;
        vue.cont2 = base64.length;
        let _img = new Image();
        _img.src = base64;
        _img.onload = function () {
          let _canvas = document.createElement("canvas");
          let w = this.width / bili;
          let h = this.height / bili;
          _canvas.setAttribute("width", w);
          _canvas.setAttribute("height", h);
          _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
          let base64 = _canvas.toDataURL("image/jpeg");
          _canvas.toBlob(function () {
            resolve(base64);
          }, "image/jpeg");
        };
      };
    });
  },
  saveImg: function (id) {
    html2canvas(document.body).then(function (canvas) {
      document.body.appendChild(canvas);
    });
    setTimeout(function () {
      let url = document.getElementById(id).src;
      let a = document.createElement("a"); // 创建一个a节点插入的document
      let event = new MouseEvent("click"); // 模拟鼠标click点击事件
      a.download = "未命名"; // 设置a节点的download属性值
      a.href = url; // 将图片的src赋值给a节点的href
      a.dispatchEvent(event);
    }, 1000);
  },
  //通用工具类 end

  // 添加cookie参数
  /**
   *
   * @param {名称} name
   * @param {值} value
   * @param {时间} time
   */
  addCookie: function (name, value) {
    // if (this.getCookie(name)) return;
    document.cookie = name + "=" + value + "; path=/";
  },
  // 查询cookie参数
  /**
   *
   * @param {名称} name
   */
  getCookie: function (name) {
    if (document.cookie.indexOf(name) > -1) {
      let arr = document.cookie.split(";");
      let str = "";
      arr.forEach((item) => {
        if (item.indexOf(name) > -1) {
          str = item.split(`${name}=`)[1];
        }
      });
      return str;
    } else {
      return "";
    }
  },
  // 删除cookie参数
  /**
   *
   * @param {名称} name
   */
  removeCookie: function (name) {
    document.cookie = name + "=" + "" + "; path=/";
  },
};
export { tools };
