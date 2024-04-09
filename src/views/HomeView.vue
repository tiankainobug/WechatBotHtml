<script setup>
import {onMounted, reactive} from "vue";
import {NButton, useNotification, NSelect} from 'naive-ui'
import ws from "@/utils/websocket.js";
import QRCode from 'qrcode'
import router from "@/router/index.js";
import {useCommonStore} from "@/stores/common.js";
import {ws_url} from "../../public/config.js";

const options = [
    {
        label: "田凯",
        value: '田凯',
    },
    {
        label: "杜冉",
        value: '杜冉',
    },
]
const notification = useNotification()
const common = useCommonStore()
const data = reactive({
    name: '',
    showQRCode: false
})
const login = () => {
    data.showQRCode = true
    ws.initConnection(ws_url, data.name, (res) => {
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
                content: `${res.user.payload.name},登录成功！`,
                duration: 2000
            })
            common.setWechatName(res.user.payload.name)
            common.setScheduleList({dataList: res.data, topic: res.topic})
            router.push('/add')
        }
        if (res.id === 'logout') {
            notification.success({
                content: res.data,
                duration: 2000
            })
            router.push('/logout')
        }
        if (res.id === 'startSuccess') {
            notification.success({
                content: '定时任务开启成功！',
                duration: 2000
            })
            common.setScheduleList(res.data)
        }
        if (res.id === 'stopSuccess') {
            notification.success({
                content: res.data,
                duration: 2000
            })
            // 定时状态设为关闭
            common.setScheduleList({})
        }
    })
}
</script>

<template>
    <div class="login">
        <div v-show="data.showQRCode">
            <canvas id="canvas"></canvas>
            <div style="margin-top: 20px">扫描二维码登录微信～</div>
        </div>
        <div v-show="!data.showQRCode" class="loginName">
            <n-select v-model:value="data.name" placeholder="请选择要登录的微信名称" :options="options" style="width: 200px" tag filterable></n-select>
            <n-button @click="login" style="margin-left: 10px">登录</n-button>
        </div>
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
.loginName {
    display: flex;
    flex-direction: row;
}
</style>
