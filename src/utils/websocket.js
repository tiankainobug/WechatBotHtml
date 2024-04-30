const ws = {
    clientConn: null, // websocket实例
    reconnectTimeout: null,  // 重连ws定时器
    pongInterval: null,  // 心跳定时器
    responseData: null,
    url: null,
    callback: null,
    initConnection: (url, name, callback) => {
        // 建立连接
        try {
            ws.url = url;
            ws.callback = callback;
            ws.clientConn = new WebSocket(url);
            ws.initEvent(callback, name);
        } catch (err) {
            console.log('WebSocket init err: ', err);
            // 重连
            ws.reconnect();
        }
    },
    initEvent: (callback, name) => {
        if (ws.clientConn) {
            ws.clientConn.onopen = () => {
                console.log('WebSocket:', 'connect to server');
                // 登录
                ws.sendMessage({type: 'login', name: name})
                // 开启心跳
                ws.sendPong();
            };
            ws.clientConn.onmessage = (e) => {
                if (e.data !== 'pong') {
                    // 接收到消息
                    ws.responseData = JSON.parse(e.data);
                    // console.log(ws.responseData.device);
                    callback(ws.responseData);
                } else {
                    console.log('WebSocket: 收到心跳信息 -> ', e.data);
                }
            };
            ws.clientConn.onerror = (err) => {
                console.log('WebSocket: connect error', `${new Date()} -- ${err}`);
                // 重连
                ws.reconnect();
            };

            // 网络连接中断时
            ws.clientConn.onclose = (err) => {
                console.log('WebSocket: connect close', `${new Date()} -- ${err}`);
                // 重连
                ws.reconnect();
            };
        }
    },
    destroyResources: () => {
        // 关闭并销毁连接
        if (ws.clientConn) {
            ws.clientConn.close();
            ws.clientConn = null;
        }
        // 销毁心跳定时器
        if (ws.pongInterval) {
            clearInterval(ws.pongInterval);
        }
        // 销毁重连定时器
        if (ws.reconnectTimeout) {
            clearTimeout(ws.reconnectTimeout);
        }
    },
    sendMessage: (msg) => {
        // 发送消息
        if (ws.clientConn && ws.clientConn.readyState === ws.clientConn.OPEN) {
            try {
                ws.clientConn.send(JSON.stringify(msg))
            } catch (err) {
                console.log('ws sendMessage err: ', err.message);
            }
        } else {
            console.log('ws 发送消息失败: ', ws.clientConn, ws.clientConn ? ws.clientConn.readyState : 'error');
        }
    },
    reconnect: () => {
        // 关闭并销毁连接
        if (ws.clientConn) {
            ws.clientConn.close();
            ws.clientConn = null;
        }
        if (ws.reconnectTimeout) {
            clearTimeout(ws.reconnectTimeout);
        }
        // 15s后重连
        ws.reconnectTimeout = setTimeout(()=>{
            ws.initConnection(ws.url, ws.callback);
        }, 15000);
    },
    sendPong: () => {
        // 发送心跳消息
        if (ws.pongInterval) {
            clearInterval(ws.pongInterval);
        }
        // 每隔20s向服务器发送一次心跳
        ws.pongInterval = setInterval(()=>{
            ws.sendMessage('pong');
        }, 20000);
    }
}

export default ws;
