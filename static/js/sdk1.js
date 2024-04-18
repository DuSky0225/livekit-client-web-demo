
'use strict';
export function SrsRtcPublisherAsync() {
    var self = {};

    self.constraints = {
        audio: true,
        video: {
            width: { ideal: 480, max: 480 },
            height: { ideal: 360, max: 360 },
            frameRate: { max: 20 }
        }
    };
    self.videoConstraints = {
        audio: false,
        video: {
            width: { ideal: 480, max: 480 },
            height: { ideal: 360, max: 360 },
            frameRate: { max: 20 }
        }
    };
    self.displayConstraints = {
        audio: false,
        video: {
            width: { ideal: 480, max: 480 },
            height: { ideal: 360, max: 360 },
            frameRate: { max: 30 }
        }
    };
    self.audio = {
        audio: true,
        video: false
    };
    self.device = '';
    self.devices = [];

    var tracks = [];


    self.publish = async function (room, display, httpUrl, streamUrl, type, maxBitrateBps,callback,kbpsType) {
        console.log(`---------`, room, display, httpUrl, streamUrl, type, maxBitrateBps)
        let userAgent = navigator.userAgent.toLowerCase();

        var apiUrl = httpUrl + "/v1/publish/"
        var tid = Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).substr(0, 7);
        var streamUrl = streamUrl + '/' + room + '/' + display + "?vhost=__jmeeting__";
        var test = {
            direction: 'sendrecv',
            sendEncodings: [{ active: true, maxBitrate: maxBitrateBps }]
        }
        if (type === "video") {
            self.pc.addTransceiver("audio", { direction: "sendonly" });
            self.pc.addTransceiver("video", test);
        } else if (type === "audio") {
            self.pc.addTransceiver("audio", { direction: "sendonly" });
        } else if (type === "onlyVideo") {
            self.pc.addTransceiver("video", test);
        } else if (type === "onlySub") {
            self.pc.addTransceiver("video", test);
        } else {
            self.pc.addTransceiver("audio", { direction: "sendonly" });
            self.pc.addTransceiver("video", test);
        }
        // addTransceiver(trackOrKind: MediaStreamTrack | string, init?: RTCRtpTransceiverInit): RTCRtpTransceiver;
        var stream;

        if (type === "video") {
            await self.getDecives();
            self.constraints.video.deviceId = { ideal: self.device }
            stream = await navigator.mediaDevices.getUserMedia(self.constraints);
        } else if (type === "audio") {
            stream = await navigator.mediaDevices.getUserMedia(self.audio);
        } else if (type === "onlyVideo") {
            if(kbpsType == 'big') {
                let definitionWidth;
                let definitionHeight;
                if(maxBitrateBps <= 256000) { // 360P
                    definitionWidth = 480
                    definitionHeight = 360
                }else if(maxBitrateBps >= 256000 && maxBitrateBps <= 512000) { // 480P
                    definitionWidth = 640
                    definitionHeight = 480
                }else if(maxBitrateBps >= 512000 && maxBitrateBps <= 1024000) { // 720p
                    definitionWidth = 1280
                    definitionHeight = 720
                }else { // 1920p
                    definitionWidth = 1920
                    definitionHeight = 1080
                }
                self.videoConstraints.video.width = {
                    ideal: definitionWidth, 
                    max: definitionWidth
                }
                self.videoConstraints.video.height = {
                    ideal: definitionHeight, 
                    max: definitionHeight
                }
            }
            await self.getDecives();
            self.videoConstraints.video.deviceId = { ideal: self.device }
            stream = await navigator.mediaDevices.getUserMedia(self.videoConstraints);
        } else if (type === "onlySub") {
            // 流畅：码率---256kbps，分辨率---480*360，俗称360P
            // 高清：码率---512kbps，分辨率---640*480，俗称480P
            // 超清：码率---1024kbps，分辨率---1280*720，俗称720P
            // 分辨率---·1920*1080
            let definitionWidth;
            let definitionHeight;
            if(maxBitrateBps <= 256000) { // 360P
                definitionWidth = 480
                definitionHeight = 360
            }else if(maxBitrateBps >= 256000 && maxBitrateBps <= 512000) { // 480P
                definitionWidth = 640
                definitionHeight = 480
            }else if(maxBitrateBps >= 512000 && maxBitrateBps <= 1024000) { // 720p
                definitionWidth = 1280
                definitionHeight = 720
            }else { // 1920p
                definitionWidth = 1920
                definitionHeight = 1080
            }
            self.displayConstraints.video.width = {
                ideal: definitionWidth, 
                max: definitionWidth
            }
            self.displayConstraints.video.height = {
                ideal: definitionHeight, 
                max: definitionHeight
            }
            if (userAgent.indexOf('electron') > -1) {
                stream = await window.electron.testDesktopCapturer()
                stream = await window.navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: stream[0].id,
                            maxWidth: definitionWidth,
                            maxHeight: definitionHeight
                        }
                    }
                })
                sessionStorage.setItem("isSharing", 1);
            } else {
                sessionStorage.setItem("isSharing", 1);
                stream = await navigator.mediaDevices.getDisplayMedia(self.displayConstraints)
            }
            stream.oninactive = () => {
                callback('disOnlysub')
                console.log(`停止共享onlysub`)
                // self.send(`disOnlysub`);
                self.close()
                self.disableWebcam();
            }
        } else {
            stream = await navigator.mediaDevices.getDisplayMedia(self.displayConstraints);
            var audioStream = await navigator.mediaDevices.getUserMedia(self.audio);
            var audioTrack = audioStream.getTracks()[0];
            self.pc.addTrack(audioTrack);
            self.ontrack && self.ontrack({ track: audioTrack });
            tracks.push(audioTrack);
        }

        //var stream = await navigator.mediaDevices.getDisplayMedia(self.constraints);

        stream.getTracks().forEach(function (track) {
            self.pc.addTrack(track);
            //向本地stream添加音视频轨道
            self.ontrack && self.ontrack({ track: track });
            tracks.push(track);

        });

        var offer = await self.pc.createOffer();
        await self.pc.setLocalDescription(offer);
        var session = await new Promise(function (resolve, reject) {


            var data = {
                api: apiUrl, tid: tid, streamurl: streamUrl,
                clientip: null, sdp: offer.sdp
            };
            // var data = {
            //     api: conf.apiUrl, tid: conf.tid, streamurl: conf.streamUrl,
            //     clientip: null, sdp: window.sdp
            // };
            // console.log("Generated offer: ", data);
            $.ajax({
                type: "POST", url: apiUrl, data: JSON.stringify(data),
                contentType: 'application/json', dataType: 'json'
            }).done(function (data) {
                if (data.code) {
                    reject(data);
                    return;
                }

                resolve(data);
            }).fail(function (reason) {
                reject(reason);
            });
        });
        await self.pc.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
        );
        session.simulator = httpUrl + "/v1/nack/";
        console.log("session", session)
        return session;
    };
    self.getDecives = async function () {
        var devices = await navigator.mediaDevices.enumerateDevices();
        devices.forEach(function (device) {
            if (device.kind == 'videoinput') {
                self.devices.push(device.deviceId);
            }
        })
        if (self.devices.length > 0) {
            self.device = self.devices[0];
        }

    }
    // 关闭连接
    self.close = function () {
        self.pc && self.pc.close();
        self.pc = null;
        if (tracks[0]) {
            tracks[0].stop();
        }
        if (tracks[1]) {
            tracks[1].stop();
        }
        tracks = [];

    };
    self.mute = function () {
        tracks.forEach(function (track) {
            if (track.kind == 'audio') {
                track.enabled = false;
            }

        })
    }
    self.unmute = function () {
        tracks.forEach(function (track) {
            if (track.kind == 'audio') {
                track.enabled = true;
            }
        })
    }
    self.disableWebcam = function () {
        tracks.forEach(function (track) {
            if (track.kind == 'video') {
                track.enabled = false;
            }

        })
    }
    self.enableWebcam = function () {
        tracks.forEach(function (track) {
            if (track.kind == 'video') {
                track.enabled = true;
            }
        })
    }
    self.changeWebcam = async function () {
        let len = self.devices.length;
        let idx = self.devices.indexOf(self.device);

        if (idx < len - 1) {
            idx++;
        } else {
            idx = 0;
        }
        self.constraints.video.deviceId = { exact: self.devices[idx] }
        self.device = self.devices[idx];
        var stream = await navigator.mediaDevices.getUserMedia(self.constraints);
        tracks.forEach(function (track, index) {
            if (track.kind == 'video') {
                self.stream.removeTrack(track);
                self.stream.addTrack(stream.getVideoTracks()[0])
                tracks.splice(index, 1);
                tracks.push(stream.getVideoTracks()[0])
            }
        })

        self.pc.getSenders().forEach(function (send) {
            if (send.track.kind == 'video') {
                send.replaceTrack(stream.getVideoTracks()[0]);
            }
        })

    };
    self.enableShare = async function () {
        let stream;
        let userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('electron') > -1) {
            stream = await window.electron.testDesktopCapturer()
            stream = await window.navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: stream[0].id
                    }
                }
            })
            sessionStorage.setItem("isSharing", 1);
        } else {
            sessionStorage.setItem("isSharing", 1);
            stream = await navigator.mediaDevices.getDisplayMedia(self.displayConstraints)
        }

        tracks.forEach(function (track, index) {
            if (track.kind == 'video') {
                self.stream.removeTrack(track);
                self.stream.addTrack(stream.getVideoTracks()[0])
                tracks.splice(index, 1);
                tracks.push(stream.getVideoTracks()[0])
            }
        })

        self.pc.getSenders().forEach(function (send) {
            if (send.track.kind == 'video') {
                send.replaceTrack(stream.getVideoTracks()[0]);
            }
        })
        document.getElementById('bigvideo').style.transform = 'rotateY(0deg)';
        document.getElementById('bigvideo').style.webkitTransform = 'rotateY(0deg)';
        document.getElementById('bigvideo').style.mozTransform = 'rotateY(0deg)';
        document.getElementById('bigvideo').style.objectFit = 'contain';
        let userId = self.getUrlParam('userId');
        document.getElementById('player-' + userId).childNodes.forEach((item) => {
            if (item.id == 'rtc_media_player') {
                item.style.transform = 'rotateY(0deg)';
                item.style.webkitTransform = 'rotateY(0deg)';
                item.style.mozTransform = 'rotateY(0deg)';
            }
        })
        stream.oninactive = () => {
            console.log(`停止共享onlysub`)
            self.disableShare();
        }
    };
    self.disableShare = async function () {
        console.log(`停止共享`)
        sessionStorage.setItem('isSharing', 0)
        
        // self.constraints.video.deviceId ={ exact: self.device }  
        var stream = await navigator.mediaDevices.getUserMedia(self.constraints);
        tracks.forEach(function (track, index) {
            if (track.kind == 'video') {
                self.stream.removeTrack(track);
                self.stream.addTrack(stream.getVideoTracks()[0])
                tracks.splice(index, 1);
                tracks.push(stream.getVideoTracks()[0])
            }
        })

        self.pc.getSenders().forEach(function (send) {
            if (send.track.kind == 'video') {
                send.replaceTrack(stream.getVideoTracks()[0]);
            }
        })
        // document.getElementById('bigvideo').style.transform = 'rotateY(180deg)';
        // document.getElementById('bigvideo').style.webkitTransform = 'rotateY(180deg)';
        // document.getElementById('bigvideo').style.mozTransform = 'rotateY(180deg)';
        // document.getElementById('bigvideo').style.objectFit = 'cover';
        let userId = self.getUrlParam('userId');
        document.getElementById('player-' + userId).childNodes.forEach((item) => {
            if (item.id == 'rtc_media_player') {
                item.style.transform = 'rotateY(180deg)';
                item.style.webkitTransform = 'rotateY(180deg)';
                item.style.mozTransform = 'rotateY(180deg)';
            }
        })


    };
    self.getUrlParam = function (name) {
        let paramsDic = {},
            str = window.location.href, //取得整个地址栏
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
        return paramsDic[name] ? decodeURI(paramsDic[name]) : '';
    };
    self.existVideoStream = function () {
        var num = 0;
        tracks.forEach(function (track, index) {
            if (track.kind == 'video') {
                num = 1;
            }
        })
        return num;
    }
    self.ontrack = function (event) {
        self.stream.addTrack(event.track);
    };
    self.onconnectionstate = function (event) {
    };
    self.pc = new RTCPeerConnection(null);
    self.stream = new MediaStream();
    self.pc.onconnectionstatechange = function (event) {
        self.onconnectionstate(event);
    };
    return self;
}
function SrsRtcPlayerAsync() {
    var self = {};
    self.play = async function (room, display, httpUrl, streamUrl, type) {
        var apiUrl = httpUrl + "/v1/play/"
        var tid = Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).substr(0, 7);
        var streamUrl = streamUrl + '/' + room + '/' + display + "?vhost=__jmeeting__";
        if (type === 'video') {
            self.pc.addTransceiver("video", { direction: "recvonly" });
        } else if (type === 'audio') {
            self.pc.addTransceiver("audio", { direction: "recvonly" });
        } else {
            self.pc.addTransceiver("video", { direction: "recvonly" });
            self.pc.addTransceiver("audio", { direction: "recvonly" });
        }

        var offer = await self.pc.createOffer();
        await self.pc.setLocalDescription(offer);
        var session = await new Promise(function (resolve, reject) {

            var data = {
                api: apiUrl, tid: tid, streamurl: streamUrl,
                clientip: null, sdp: offer.sdp
            };

            $.ajax({
                type: "POST", url: apiUrl, data: JSON.stringify(data),
                contentType: 'application/json', dataType: 'json'
            }).done(function (data) {
                if (data.code) {
                    reject(data); return;
                }

                resolve(data);
            }).fail(function (reason) {
                reject(reason);
            });
        });
        await self.pc.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
        );
        session.simulator = httpUrl + "/v1/nack/";
        return session;
    };

    // Close the player.
    self.close = function () {
        self.pc && self.pc.close();
        self.pc = null;
    };
    self.ontrack = function (event) {
        self.stream.addTrack(event.track);
    };
    self.onconnectionstate = function (event) {
    };
    self.pc = new RTCPeerConnection(null);
    self.stream = new MediaStream();
    self.pc.ontrack = function (event) {
        if (self.ontrack) {
            self.ontrack(event);
        }
    };
    self.getconnectionstate = function (display) {
        return self.pc.connectionState;
    };
    self.pc.onconnectionstatechange = function (event) {
        self.onconnectionstate(event);
    };
    return self;
}

function SrsRtcSignalingAsync() {
    var self = {};


    // o建立ws连接方法
    self.connect = async function (wshost, room, display, port) {

        var url = wshost + ':' + port + '/jmeeting-websocket/ws?U='; // 正式 测试 
        // var url = wshost + ':' + port + '/jpaas-jmeeting-server/ws?U='; // 本地
        // var url = wshost + ':' + port + '/common-live-server/ws/notice/';
        self.ws = new WebSocket(url + room + "_" + display + "_" + 3);
        //接受消息方法
        self.ws.onmessage = function (event) {
            var r = JSON.parse(event.data);
            var promise = self._internals.msgs[r.tid];
            if (promise) {
                promise.resolve(r.data);
                delete self._internals.msgs[r.tid];
            } else {
                self.onmessage(r);
            }
        };
        self.ws.onclose = function () {
            self.onclose()
        };
        self.ws.onopen = function () {
            self.onopen()
        };
        return new Promise(function (resolve, reject) {
            self.ws.onopen = function (event) {
                self.onopen()
                resolve(event);
            };
            self.ws.onerror = function (event) {
                self.onerror()
                reject(event);
            };
        });
    };

    // 发送消息方法
    self.send = async function (message) {
        return new Promise(function (resolve, reject) {
            // var r = { tid: Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).substr(0, 7), msg: message };
            // self._internals.msgs[r.tid] = { resolve: resolve, reject: reject };
            self.ws.send(JSON.stringify(message));
        });
    };
    //关闭链接
    self.close = function () {
        self.ws && self.ws.close();
        self.ws = null;
        for (const tid in self._internals.msgs) {
            var promise = self._internals.msgs[tid];
            promise.reject('close');
        }
    };

    // 接受消息方法
    self.onmessage = function (msg) {
    };
    self.onopen = function () {
    };
    self.onclose = function () {
    };
    self.onerror = function () {
    };

    self._internals = {

        msgs: {}
    };

    return self;
}
var sig = null;
var publisher = null;
var publisherVideo = null;
var players = {};
var times = 1;
var timeVideo = 1;
var playTimesAudio = 1;
var playTimes = 1;
export function webrtcEvent(conf, callbacks) {
    var defaultCallbacks = {
        publishVideoState: function (msg) {

        },
        publishAudioState: function (msg) {
        }

    }
    callbacks = Object.assign(defaultCallbacks, callbacks)
    var self = { conf: conf };
    self.callbacks = callbacks;
    self.startPublish = function (room, display, httpUrl, streamUrl, type, audioOpen, videoOpen, state, maxBitrateBps,my) {
        return new Promise((resolve, reject) => {
            if (publisher) {
                publisher.close();
            }
            //获取推流对象
            publisher = new SrsRtcPublisherAsync();
            publisher.onconnectionstate = function (msg) {
                self.callbacks.publishAudioState(msg)
            }
            //将流放入播放器
            publisher.publish(room, display, httpUrl, streamUrl, type, maxBitrateBps,my).then(session => {
                const index = display.lastIndexOf("_")
                let audioOfferId = 0
                if (index != -1) {
                    audioOfferId = display.substring(index + 1, display.length)
                    console.log(`audioOfferId`, audioOfferId)
                }
                console.log(`display`, display,'my',my)

                sig.send({
                    "userId": display.split('_')[0],
                    "type": 2,
                    "liveId": room,
                    "checkDataBean": [{
                        "userId": display.split('_')[0],
                        "audioOpen": audioOpen,
                        "videoOpen": videoOpen,
                        "audioFlow": true,
                        "state": state,
                        "audioOfferId": audioOfferId
                    }]
                });
                sig.send({
                    "userId": display.split('_')[0],
                    "type": 5,
                    "liveId": room,
                    "checkDataBean": [{
                        "userId": display.split('_')[0],
                        "audioOpen": true,
                        "videoOpen": videoOpen,
                        "audioFlow": true,
                        "videoFlow":my.videoFlow,
                        "state": state,
                        "audioOfferId": audioOfferId,
                        "videoOfferId":my.videoOfferId
                    }]
                });
                console.log("web端推流成功！！！！！，音频===推流成功")
                resolve(publisher.stream)
            }).catch(reason => {
                // publisher.close();
                reject(reason)
                console.error(reason);
            });
        })

    };
    self.startPublishVideo = function (room, display, httpUrl, streamUrl, type, audioOpen, videoOpen, state, maxBitrateBps,callback,kbpsType,my) {
        return new Promise((resolve, reject) => {
            if (publisherVideo) {
                publisherVideo.close();
            }
            //获取推流对象
            publisherVideo = new SrsRtcPublisherAsync();
            publisherVideo.onconnectionstate = function (msg) {
                self.callbacks.publishVideoState(msg)
            }
            //将流放入播放器
            publisherVideo.publish(room, display, httpUrl, streamUrl, type, maxBitrateBps,callback,kbpsType,my).then(session => {
                const index = display.lastIndexOf("_")
                let videoOfferId = 0
                if (index != -1) {
                    videoOfferId = display.substring(index + 1, display.length)
                    console.log(`videoOfferId`, videoOfferId)
                }
                console.log(`display`, display)
                if(kbpsType) {
                    sig.send({
                        "userId": display.split('_')[0],
                        "type": 4,
                        "liveId": room,
                        "checkDataBean": [{
                            "userId": display.split('_')[0],
                            "audioOpen": audioOpen,
                            "videoOpen": videoOpen,
                            "publishing": true,
                            "maxVideoFlow": true,
                            "state": state,
                            "maxVideoOfferId": videoOfferId
                        }]
                    });
                    console.log("大流===推流成功")
                }else{
                    sig.send({
                        "userId": display.split('_')[0],
                        "type": 1,
                        "liveId": room,
                        "checkDataBean": [{
                            "userId": display.split('_')[0],
                            "audioOpen": audioOpen,
                            "videoOpen": videoOpen,
                            "videoFlow": true,
                            "state": state,
                            "videoOfferId": videoOfferId
                        }]
                    });
                    console.log('my',my)
                    sig.send({
                        "userId": display.split('_')[0],
                        "type": 4,
                        "liveId": room,
                        "checkDataBean": [{
                            "userId": display.split('_')[0],
                            "audioOpen": audioOpen,
                            "videoOpen": true,
                            "audioFlow":my.audioFlow,
                            "videoFlow": true,
                            "state": state,
                            "audioOfferId":my.audioOfferId,
                            "videoOfferId": videoOfferId
                        }]
                    });
                    console.log("web端推流成功！！！！！，视频===推流成功")
            }
                
                resolve(publisherVideo.stream)
    
            }).catch(reason => {
                // publisherVideo.close();
                reject(reason)
                callback('cancel')
                // $('#rtc_media_publisher').hide();
                console.error(reason);
             
            });
        })

    };
    self.startPlay = function (room, display, httpUrl, streamUrl, type, callback) {
        // console.log(`拉流callback`,callback)
        return new Promise((resolve, reject) => {
            if (players[display]) {
                players[display].player.close();
            }
            let player = new SrsRtcPlayerAsync();
            player.onconnectionstate = function (msg) {
                msg.display = display
                callback(msg)
            }
            player.play(room, display, httpUrl, streamUrl, type).then(function (session) {
                players[display] = { player: player };
            }).catch(function (reason) {
                player.close();
                video.hide();
                console.error(reason);
                if (reason.code == 400) {
                    if (type == 'video') {
                        setTimeout(function () {
                            if (playTimes <= 10) {
                                let arr = display.split('_');
                                if (arr.length == 1) {
                                    display = display + "_" + playTimes
                                } else {
                                    arr[arr.length - 1] = playTimes
                                    display = arr.join('_')
                                }
                                self.startPlay(room, display, httpUrl, streamUrl, type);
                                times += 1;
                            }
                        }, 1000)
                    } else {
                        setTimeout(function () {
                            if (playTimesAudio <= 10) {
                                let arr = display.split('_');
                                if (arr.length == 2) {
                                    display = display + "_" + playTimesAudio
                                } else {
                                    arr[arr.length - 1] = playTimesAudio
                                    display = arr.join('_')
                                }
                                self.startPlay(room, display, httpUrl, streamUrl, type);
                                times += 1;
                            }
                        }, 1000)
                    }
                }
            });
            resolve(player.stream);
        })
    };
    self.mute = function () {
        console.log("mute--------------------->静音");
        publisher.mute();
    }
    self.unmute = function () {
        console.log("unmute--------------------->取消静音");
        publisher.unmute();
    }
    self.disableWebcam = function () {
        publisherVideo.disableWebcam();
    }
    self.enableWebcam = function () {
        publisherVideo.enableWebcam();
    }
    self.changeWebcam = function () {
        publisherVideo.changeWebcam();
    }
    self.enableShare = async function () {
        publisherVideo.enableShare();
    }
    self.disableShare = async function () {
        publisherVideo.disableShare();
    }
    self.close = async function () { // 关闭视频推流
        publisherVideo.close();
    }
    self.muteclose = async function () { // 关闭音频推流
        publisher.close();
    }
    self.playClose = function (display) { // 关闭 单人拉流链接
        console.log(`关闭隐藏人员视频流`)
        if (players[display]) {
            players[display].player.close();
        }
    }
    self.getPlayerState = function (display) {
        console.log(players, '///////////////')
        if (players[display]) {
            let a = players[display].player.getconnectionstate()
            console.log(`getconnectionstate----------------` + display, a)
            return players[display].player.getconnectionstate();
        }
    }

    self.existVideoStream = function () {
       return publisherVideo.existVideoStream();
    }
    return self;
}

export function webrtcWs(conf, callbacks) {
    var room = conf.roomId;
    var display = conf.display;
    var wsHost = conf.wsHost;
    var wsPort = conf.wsPort;
    var defaultCallbacks = {
        join: function (msg) {
        },
        leave: function (msg) {
        },
        receiveStream: function (msg) {
        },
        init: function (roomInfo) {
        },
        control: function (msg) {
        },
        wsMsg: function (msg) {

        },
        onclose: function () {

        }
    }
    callbacks = Object.assign(defaultCallbacks, callbacks)
    var self = { conf: conf };
    self.callbacks = callbacks;
    self.start = async function () {

        var roomInfo = {
            participants: [],
            selfInfo: {}
        }
        // 判断是否已经和信令服务建立了websock链接
        if (sig) {
            sig.close();
        }
        sig = new SrsRtcSignalingAsync();
        //接受消息内容
        sig.onmessage = await function (msg) {
            //有人推流则增加
            if (msg) {
                self.callbacks.wsMsg(msg)
            }

        };
        sig.onopen = await function () {
            console.log("视频会议websocket已打开");
            self.callbacks.onopen()
        };
        sig.onclose = await function () {
            self.callbacks.onclose()
            console.log("视频会议websocket已关闭");
        };
        sig.onerror = await function () {
            console.log("视频会议websocket发生了错误");
        };
        //建立websock连接
        await sig.connect(wsHost, room, display, wsPort);
        self.callbacks.init(roomInfo);
    }
    self.sendMessage = async function (message) {
        sig.send(message)
    }
    return self;
}