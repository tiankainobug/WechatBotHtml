<script setup>
import {h, nextTick, onBeforeMount, reactive} from "vue";
import {useCommonStore} from "@/stores/common.js";
import {
    NButton,
    NDataTable,
    NInput,
    NUpload,
    NIcon,
    NTooltip,
    NGradientText,
    NDropdown,
    useNotification
} from "naive-ui";
import ws from "@/utils/websocket.js";
import router from "@/router/index.js";

const notification = useNotification()
const common = useCommonStore()

onBeforeMount(() => {
    // 未登录，跳转登录
    if (!common.wechatName) {
        router.push('/')
    }
})

const renderTooltip = (trigger, content) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content
    })
}
const data = reactive({
    topic: 'IBOC业务支撑运保',
    columns: [
        {
            title (column) {
                return renderTooltip(
                    h(
                        NGradientText,
                        {
                            type: 'danger'
                        },
                        { default: () => '发送内容' }
                    ),
                    '时间格式：秒 分 时 日 月 年，* 代表任意。比如：00 30 6 * * *，表示每天 6 点 30分 00秒'
                )
            },
            key: 'time',
            render(row, index) {
                return h(NInput, {
                    value: row.time,
                    placeholder: '请输入要发送的时间',
                    onUpdateValue(v) {
                        data.data[index].time = v;
                    }
                });
            }
        },
        {
            title: '文本',
            key: 'text',
            render(row, index) {
                return h(NInput, {
                    value: row.text,
                    placeholder: '请输入要发送的文本',
                    onUpdateValue(v) {
                        data.data[index].text = v;
                    }
                });
            }
        },
        {
            title: '图片(上传要发送的图片)',
            key: 'imgUrl',
            render(row, index) {
                return h(NUpload,
                    {
                        action: '/ossService/file/upload',
                        listType: 'image-card',
                        max: 1,
                        defaultFileList: [{
                            id: index,
                            name: '讲师头像',
                            status: 'finished',
                            url: row.imgUrl
                        }],
                        accept: 'image/*',
                        onFinish: ({ file, event }) => uploadFinish(index,file,event),
                        onRemove: () => uploadRemove(index)
                    },
                    {default: () => '图片上传'}
                );
            }
        },
    ],
    data: [
        {
            time: '00 20 6 * * *',
            text: '翼呼平台巡检完毕，系统正常。',
            imgUrl: 'https://guli-1227.oss-cn-beijing.aliyuncs.com/2023/12/30/382dde4f11514092b06c7ea040ed1ee7img1.png'
        },
        {
            time: '00 21 9 * * *',
            text: '翼呼平台巡检完毕，系统正常。',
            imgUrl: 'https://guli-1227.oss-cn-beijing.aliyuncs.com/2023/12/30/80d55955144d4a4ba651c537ace34806img2.png'
        },
        {
            time: '00 24 15 * * *',
            text: '翼呼平台巡检完毕，系统正常。',
            imgUrl: 'https://guli-1227.oss-cn-beijing.aliyuncs.com/2023/12/30/4a1836fa3d21483ea61db5edcf2c2403img3.png'
        },
    ],
    showDropDown: false,
    x: 0,
    y: 0,
    rowData: {},
    rowIndex: 0,
    options: [
        {
            label: () => h("span", {
                style: { color: "red" },
                onClick: () => {
                    data.data.splice(data.rowIndex, 1)
                    notification.success({
                        content: '删除成功！',
                        duration: 2000
                    })
                }
            }, "删除"),
            key: "delete"
        }
    ]
})
const uploadFinish = (index,file,event) => {
    const res = JSON.parse(event.target.response)
    data.data[index].imgUrl = res.data.fileUrl
}
const addData = () => {
    data.data.push({
        time: '00 30 6 * * *',
        text: '翼呼平台巡检完毕，系统正常。',
        imgUrl: ''
    })
}
const handleStart = () => {
    // 开始定时发送
    ws.sendMessage({type: 'start',data: {dataList: data.data, topic: data.topic}})
}
const rowProps = (row,rowIndex) => {
    return {
        onContextmenu: (e) => {
            e.preventDefault();
            data.showDropDown = false;
            nextTick().then(() => {
                data.rowData = row;
                data.rowIndex = rowIndex;
                data.showDropDown = true;
                data.x = e.clientX;
                data.y = e.clientY;
            });
        }
    };
}
const onClickOutside = () => {
    data.showDropDown = false;
}
const handleSelect = () => {
    data.showDropDown = false;
}
</script>

<template>
    <div style="height:100%;display: flex;flex-direction: column;align-items: center;">
        <div style="width:100%;align-self:flex-start;display: flex;justify-content: space-between;align-items: center;white-space: nowrap;">
            <div>
                <span>群聊名称：</span>
                <n-input v-model:value="data.topic" placeholder="请输入群聊名称"></n-input>
            </div>
            <n-button style="align-self: flex-end" type="primary" @click="handleStart">开始所有任务</n-button>
        </div>

        <div style="margin-top: 20px;display: flex;justify-content: flex-end;flex-direction: column">
            <n-data-table
                :columns="data.columns"
                :data="data.data"
                :bordered="false"
                max-height="45vh"
                :row-props="rowProps"
            />
            <n-dropdown
                placement="bottom-start"
                trigger="manual"
                :x="data.x"
                :y="data.y"
                :options="data.options"
                :show="data.showDropDown"
                :on-clickoutside="onClickOutside"
                @select="handleSelect"
            />
            <n-button style="background-color: #18181C" quaternary @click="addData">
                <template #icon>
                    <n-icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                d="M368.5 240H272v-96.5c0-8.8-7.2-16-16-16s-16 7.2-16 16V240h-96.5c-8.8 0-16 7.2-16 16 0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7H240v96.5c0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7 8.8 0 16-7.2 16-16V272h96.5c8.8 0 16-7.2 16-16s-7.2-16-16-16z"
                            />
                        </svg>
                    </n-icon>
                </template>
                添加任务
            </n-button>
        </div>

        <div style="margin-top: 10px;align-self: flex-end">
            <span>登录微信：{{common.wechatName}}</span>
        </div>
    </div>
</template>

<style scoped>

</style>