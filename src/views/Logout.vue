<script setup>
import {NResult, NButton} from 'naive-ui'
import router from "@/router/index.js";

const reLogin = () => {
    router.push('/')
}
</script>

<template>
    <div class="logout">
        <n-result status="success" title="退出成功">
            <template #footer>
                <n-button @click="reLogin">重新登录</n-button>
            </template>
        </n-result>
    </div>
</template>

<style scoped>
.logout {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>