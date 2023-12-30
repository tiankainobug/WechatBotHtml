const ws = {
    clientConn: null, // websocket实例
    reconnectTimeout: null,  // 重连ws定时器
    pongInterval: null,  // 心跳定时器
    responseData: null,
    url: null,
    callback: null,
    initConnection: (url, callback) => {
        // 建立连接
        try {
            ws.url = url;
            ws.callback = callback;
            ws.clientConn = new WebSocket(url);
            ws.initEvent(callback);
        } catch (err) {
            console.log('WebSocket init err: ', err);
            // 重连
            ws.reconnect();
        }
    },
    initEvent: (callback) => {
        if (ws.clientConn) {
            ws.clientConn.onopen = () => {
                console.log('WebSocket:', 'connect to server');
                // 登录
                ws.sendMessage({type: 'login'})
            };
            ws.clientConn.onmessage = (e) => {
                if (e.data !== 'pong') {
                    // console.log('WebSocket: response msg = ', e.data);
                    // 接收到消息
                    ws.responseData = JSON.parse(e.data);
                    // console.log(ws.responseData.device);
                    callback(ws.responseData);
                } else {
                    console.log('WebSocket: response pong msg = ', e.data);
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
                console.log('msg', msg);
            } catch (err) {
                console.log('ws sendMessage err: ', err.message);
            }
        } else {
            console.log('ws cannot sent msg: ', ws.clientConn, ws.clientConn ? ws.clientConn.readyState : 'error');
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
}

export default ws;