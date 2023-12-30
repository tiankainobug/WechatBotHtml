import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', () => {
  const wechatName = ref('')
  function setWechatName(name) {
    wechatName.value = name
  }

  return { wechatName, setWechatName }
})
