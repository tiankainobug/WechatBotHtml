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

