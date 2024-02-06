import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', () => {
  const wechatName = ref('')
  const scheduleList = ref({
    dataList: [],
    topic: ''
  })

  function setWechatName(name) {
    wechatName.value = name
  }
  function setScheduleList(value) {
    scheduleList.value = value
  }

  return { wechatName, setWechatName, scheduleList, setScheduleList }
})
