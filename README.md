# webrtc 例子

## 说明

1. server.js
   自己写的 node 服务后台，需要启动
2. webrtc-demo\src\utils\socket.jssock连接，里面有连接地址，可以改
3. views/remote.vue
   远程连接的demo
4. views/some.vue
   多人连接的例子

##启动

1. 启动node服务,node server.js
2. 启动项目, npm run serve
3. 进入

## 配置

如果不是启动在 https 下，需要配置浏览器调用摄像头

chrome://flags/#unsafely-treat-insecure-origin-as-secure


## webRTC大致流程

1. 获取本地媒体流放到video的src中
2. AB两点连接需要创建双方各自的 RTCPeerConnection
3. A点创建offer后设置本地视频setLocalDescription
4. A点发送带有本地sdp的offer给B点
5. B点收到offer并根据offer的sdp设置远端视频setRemoteDescription
6. B点创建answer后设置本地视频setLocalDescription
7. B点发送带有本地sdp的answer给A
8. A点收到answer并根据answer的sdp设置远端视频setRemoteDescription
9. 至此AB两点都设置了各自的本地和远端视频，点对点视频通话完成

##### 白话翻译：张三和李四视频通信过程

0. 首先张三和李四各自都有自己的本地视频标签video和远端视频标签video
1. 张三创建自己本地视频流并放到自己（张三）本地视频标签video中
2. 张三将自己（张三）的本地视频流发给李四
3. 李四收到张三的本地视频流并将其放到自己（李四）远端视频标签video中
4. 李四创建自己的本地视频流放到自己（李四）本地视频标签video中
5. 李四将自己（李四）的本地视频流发给张三
6. 张三收到李四的本地视频流并将其放到自己（张三）远端视频标签video中
7. 这样张三和李四就可以视频通信了
