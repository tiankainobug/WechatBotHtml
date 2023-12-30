<script setup>
import {RouterView} from 'vue-router'
import {darkTheme, NNotificationProvider,NConfigProvider,NCard} from "naive-ui";
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <n-notification-provider>
            <div class="botBody">
                <n-card>
                    <RouterView/>
                </n-card>
            </div>
        </n-notification-provider>
    </n-config-provider>
</template>

<style scoped>
.botBody {
    width:100vw;
    height:100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.n-card {
    width: 75vw;
    height: 70vh;
    background-color: #406B71;
    box-shadow:0 0 20px 0 #333333;
    border-radius: 10px;
}
</style>
