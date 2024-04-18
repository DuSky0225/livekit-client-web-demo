# 视频会议

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```


## 语音通话示例
### 创建者
```
http://localhost:8082/jmeeting-web/#/voiceCall?liveCreatorId=82009ebb781346ed90f413f9fd6d83cd&liveCreatorName=%E6%9C%B1&callerId=b8b43467f6494f9a96f5a3188e663762
```
### 接听者
```
http://localhost:8082/jmeeting-web/#/voiceCall?liveId=YaFhDAvAHMkIiljNwGlvJ&userId=b8b43467f6494f9a96f5a3188e663762
```

# 视频会议更新


## 单点登录
https://meeting.hanweb.com/api-gateway/jpaas-ucenterextend-server/interface/authLogin?redirectUrl=https://meeting.hanweb.com/jmeeting-web/#/boxIndex?sign=work

```
npx patch-package livekit-client


var screenObj

createLocalScreenTracks

createScreenTracks

let stream;
    let userAgent = navigator.userAgent.toLowerCase();  
    if (userAgent.indexOf('electron') > -1) {
      stream = yield window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: screenObj.id
            }
        }
    })
    sessionStorage.setItem("isSharing", 1);
    } else{
      stream = yield navigator.mediaDevices.getDisplayMedia(constraints)
    }

setScreenShareEnabled

setScreenShareEnabled(obj,enabled, options, publishOptions) {
    screenObj = obj;
    return this.setTrackEnabled(Track.Source.ScreenShare, enabled, options, publishOptions);
  }
```
