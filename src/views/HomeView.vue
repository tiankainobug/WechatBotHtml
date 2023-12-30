<script setup>
import {onMounted, reactive} from "vue";
import {NButton, useNotification} from 'naive-ui'
import ws from "@/utils/websocket.js";
import QRCode from 'qrcode'
import router from "@/router/index.js";
import {useCommonStore} from "@/stores/common.js";

const notification = useNotification()
const common = useCommonStore()

onMounted(() => {
    const wsConn = 'ws://127.0.0.1:3000/robot'

    ws.initConnection(wsConn, (res) => {
        if (res.id === 'login') {
            console.log('qrcode', res.data)
            // 创建二维码
            const canvas = document.getElementById('canvas');
            QRCode.toCanvas(canvas, res.data, function (error) {
                if (error) console.error(error)
                console.log('success!');
            })
        }
        if (res.id === 'loginSuccess') {
            notification.success({
                content: `${res.data.payload.name},登录成功！`,
                duration: 2000
            })
            common.setWechatName(res.data.payload.name)
            router.push('/add')
        }
    })
})
</script>

<template>
    <div class="login">
        <canvas id="canvas"></canvas>
        <div style="margin-top: 20px">扫描二维码登录微信～</div>
    </div>
</template>

<style scoped>
.login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
