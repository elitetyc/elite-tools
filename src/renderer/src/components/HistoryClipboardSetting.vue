<script setup>
import { computed, onMounted, ref, watch,reactive,onUnmounted } from "vue";
import HotKeyInput from "./HotKeyInput.vue";
const HotKeyConfigType = window.api.HotKeyConfigType
const mainEvent = window.api.mainEvent
const formData = reactive({
  openHistoryHotkey: '',
});

const hotKeyConfig = ref([])

const requestHotKeyConfig = ()=>{
  // 获取数据
  window.electron.ipcRenderer.send(mainEvent.GET_CLIPBOARD_CONFIG_LIST)
}
onMounted(()=>{

  requestHotKeyConfig()
  window.electron.ipcRenderer.on(mainEvent.CLIPBOARD_CONFIG_LIST, (event, data) => {
    hotKeyConfig.value = data.filter(it=>it.type===HotKeyConfigType.HistoryClipboard)
    for (const hotKeyConfigElement of hotKeyConfig.value) {
      formData[hotKeyConfigElement.propName] = hotKeyConfigElement.hotKey
    }

    console.log("formData.openHistoryHotkey",formData.openHistoryHotkey)

  })

})

onUnmounted(()=>{
  window.electron.ipcRenderer.removeAllListeners()
})

const hotKeySettingChange = (value,propName)=>{
  // 把最新的快捷键发到后台，重新注册快捷键
  window.electron.ipcRenderer.send(mainEvent.HOT_KEY_SETTING_CHANGE, JSON.stringify({
    type: HotKeyConfigType.HistoryClipboard,
    propName,
    hotKey:value
  }));
}
</script>

<template>
  <t-form style="color: white" :data="formData" label-align="right" :label-width="120">
    <t-form-item label="剪切板历史" name="openHistoryHotkey">
      <hot-key-input v-model="formData.openHistoryHotkey" @change="hotKeySettingChange($event,'openHistoryHotkey')"></hot-key-input>
    </t-form-item>
  </t-form>

</template>

<style lang="scss" scoped>




</style>
