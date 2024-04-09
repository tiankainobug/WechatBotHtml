# 微信定时发送消息

### 简介：

该项目为`微信定时发送消息`机器人，可以扫码登录微信，输入微信好友名称或群聊名称，添加定时任务内容（时间、内容、图片），便可在指定时间发送该设置好的内容。

该项目包括前端和后端两部分。

后端链接：[https://github.com/tiankainobug/WechatBotService](https://github.com/tiankainobug/WechatBotService)

### 前端框架：

🏵️ vue3

🏵️ pinia

🏵️ naive-ui

🏵️ vue-router

🏵️ vite

### 部署方式：

1. 修改配置文件

public 下的 `config.js` 文件

> 将ws_url修改为自己的服务地址
>
> 本地服务地址为：ws://localhost:3000/websocket/robot

2. 启动前端

```
pnpm install
pnpm run dev
```

### 说明：

![image-20240409232417864](https://tiankai-1308241476.cos.ap-nanjing.myqcloud.com/typora/image-20240409232417864.png)

扫码登录后如上，

**群聊名称**：要发送的目标微信名称或者群聊名称



**第一列**：维护发送的时间，格式：`秒 分 时 日 月 年`。

例如：每天早上 6 点 30 分发送（00 30 6 * * *）。

*代表任意



**第二列：** 维护要发送的文本



**第三列：** 维护要发送的图片



**回执：** 本程序会给名称为`微信助手`的群聊或好友，发送回执消息。格式如下：

![image-20240409232949211](https://tiankai-1308241476.cos.ap-nanjing.myqcloud.com/typora/image-20240409232949211.png)

