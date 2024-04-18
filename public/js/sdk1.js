
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
    self.displayConstraints = {
        audio: true,
        video: {
            width: { ideal: 1200, max: 1200 },
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


    self.publish = async function (host, room, display, port, type, rtmpPort,maxBitrateBps) {
        console.log(`---------`,maxBitrateBps)
        var apiUrl = host + ":" + port + "/rtc/v1/publish/"
        var rtchost = host.substr(host.lastIndexOf("/") + 1)
        var tid = Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).substr(0, 7);
        var streamUrl = 'webrtc://' + rtchost + ":" + rtmpPort + '/' + room + '/' + display + "?vhost=__jmeeting__";
        var test = {
            direction: 'sendrecv',
            sendEncodings: [{ active: true, maxBitrate: maxBitrateBps }]
        }
        self.pc.addTransceiver("audio", { direction: "sendonly" });
        self.pc.addTransceiver("video", test);
        // addTransceiver(trackOrKind: MediaStreamTrack | string, init?: RTCRtpTransceiverInit): RTCRtpTransceiver;
        var stream;

        if (type === "video") {
            await self.getDecives();
            self.constraints.video.deviceId = { ideal: self.device }
            stream = await navigator.mediaDevices.getUserMedia(self.constraints);
        } else if (type === "audio") {
            stream = await navigator.mediaDevices.getUserMedia(self.audio);
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
        session.simulator = host + ":" + port + "/rtc/v1/nack/";
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

        var stream = await navigator.mediaDevices.getDisplayMedia(self.displayConstraints);
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
    self.disableShare = async function(){
        
        // self.constraints.video.deviceId ={ exact: self.device }  
        var stream = await navigator.mediaDevices.getUserMedia(self.constraints);
        tracks.forEach(function(track,index){
          if(track.kind == 'video'){
              self.stream.removeTrack(track);
              self.stream.addTrack(stream.getVideoTracks()[0])
              tracks.splice(index, 1);
              tracks.push(stream.getVideoTracks()[0])
          }
      }) 
     
       self.pc.getSenders().forEach(function(send){
          if(send.track.kind == 'video'){
              send.replaceTrack(stream.getVideoTracks()[0]);
          }
       })
        
 };
    
    self.ontrack = function (event) {

        self.stream.addTrack(event.track);
    };
    self.pc = new RTCPeerConnection(null);
    self.stream = new MediaStream();
    return self;
}


function SrsRtcPlayerAsync() {
    var self = {};


    self.play = async function (host, room, display, port, rtmpPort) {
        var apiUrl = host + ":" + port + "/rtc/v1/play/"
        var rtchost = host.substr(host.lastIndexOf("/") + 1)
        var tid = Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).substr(0, 7);
        var streamUrl = 'webrtc://' + rtchost + ":" + rtmpPort + '/' + room + '/' + display + "?vhost=__jmeeting__";
        self.pc.addTransceiver("audio", { direction: "recvonly" });
        self.pc.addTransceiver("video", { direction: "recvonly" });

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
        session.simulator = host + ":" + port + "/rtc/v1/nack/";
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



    self.pc = new RTCPeerConnection(null);


    self.stream = new MediaStream();

    self.pc.ontrack = function (event) {
        if (self.ontrack) {
            self.ontrack(event);
        }
    };

    return self;
}


function SrsRtcSignalingAsync() {
    var self = {};


    // o建立ws连接方法
    self.connect = async function (wshost, room, display, port) {

        var url = wshost + ':' + port + '/jmeeting-websocket/ws/notice/'; // 正式 测试 
        // var url = wshost + ':' + port + '/jpaas-jmeeting-web-server/ws/notice/'; // 本地
        // var url = wshost + ':' + port + '/common-live-server/ws/notice/';
        self.ws = new WebSocket(url + room + "_" + display);
        //接受消息方法
        self.ws.onmessage = function (event) {
            var r = JSON.parse(event.data);
            var promise = self._internals.msgs[r.tid];
            if (promise) {
                promise.resolve(r.data);
                delete self._internals.msgs[r.tid];
            } else {
                self.onmessage(r.data);
            }
        };
        self.ws.onclose = function () {
            self.onclose()
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
var players = {};
window.onbeforeunload = function () {
    publisher.close()
}
var times = 0;

export function webrtcEvent(conf) {
    var host = conf.httpHost;
    var room = conf.roomId;
    var display = conf.display;
    var port = conf.httpPort;
    
    var type = conf.type;

    var rtmpPort = conf.rtmpPort;

    var self = { conf: conf };
   
    // self.join = function (msg) {
    // };
    // self.leave = function(msg){
    // }
    // self.peerPublish = function(display,stream){
    // }
    self.startPublish = function (host, room, display, port, type, rtmpPort,audioOpen,videoOpen,state,maxBitrateBps) {
        return new Promise((resolve,reject)=>{
            if (publisher) {
                publisher.close();
            }
            //获取推流对象
            publisher = new SrsRtcPublisherAsync();
            //将流放入播放器
            publisher.publish(host, room, display, port, type, rtmpPort,maxBitrateBps).then(function (session) {
                sig.send({
                    "userId": display,
                    "type": 1,
                    "liveId": room,
                    "checkDataBean": [{
                      "userId": display,
                      "audioOpen": audioOpen,
                      "videoOpen": videoOpen,
                      "publishing": true,
                      "state":state
                    }]
                  });
                console.log("Signaling: publish ok-------,推流成功")
                console.log("web端推流成功！！！！！-------")
                resolve(publisher.stream)
            }).catch(function (reason) {
                reject('321')
                publisher.close();
                // $('#rtc_media_publisher').hide();
                console.error(reason);
                if (reason.code == 400) {
                    console.log("无权限重试-------" + times)
                    setTimeout(function () {
                        if (times <= 3) {
                            self.startPublish(host, room, display, port, type, rtmpPort,audioOpen,videoOpen,state,maxBitrateBps);
                            times += 1;
                        }
                    }, 1000)
                }
            });
        })
        
    };

    self.startPlay = function (host, room, display, port, rtmpPort) {
        return new Promise((resolve,reject)=>{
            if (players[display]) {
                players[display].player.close();
            }
            let player = new SrsRtcPlayerAsync();
            player.play(host, room, display, port, rtmpPort).then(function (session) {
                players[display] = { player: player };
            }).catch(function (reason) {
                player.close();
                video.hide();
                console.error(reason);
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
        publisher.disableWebcam();
    }
    self.enableWebcam = function () {
        publisher.enableWebcam();
    }
    self.changeWebcam = function () {
        publisher.changeWebcam();
    }
    self.enableShare = async function () {
        publisher.enableShare();
    }
    self.disableShare = async function () {
        publisher.disableShare();
    }
   
    self.publish =async function(){
        await startPublish(host, room, display,port,type,rtmpPort,maxBitrateBps);
        return publisher.stream;
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
        wsMsg:function(msg) {
            
        },
        onclose:function(){

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
            // console.log('Notify: ', msg);
            //有人推流则增加
            if(msg) {
                // if (msg.event === 'publish') {
                //     self.callbacks.receiveStream(msg)
                // }
                // // 判断是否有加人减人
                // if (msg.event === 'join') {
                //     self.callbacks.join(msg) 
                // }
                // if (msg.event === 'leave') {
                //     self.callbacks.leave(msg)
                // }
                // if (msg.event === 'control') {
                //     self.callbacks.control(msg)
                // }
                self.callbacks.wsMsg(msg)

            }
            
        };
        sig.onopen = await function ()  {
            console.log("视频会议websocket已打开");
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
        //发送行为是加入的消息
        // await sig.send({ action: 'join', room: room, display: display });
        // return roomInfo;
        self.callbacks.init(roomInfo);
    } 
    self.sendMessage = async function (message) {
        sig.send(message)
    }
    return self;
}