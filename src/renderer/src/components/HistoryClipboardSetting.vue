<script setup>
import { computed, onMounted, ref, watch, reactive, onUnmounted } from 'vue'
import HotKeyInput from './HotKeyInput.vue'
const HotKeyConfigType = window.api.HotKeyConfigType
const mainEvent = window.api.mainEvent
const formData = reactive({
  openHistoryHotkey: ''
})

const hotKeyConfig = ref([])

const requestHotKeyConfig = () => {
  // 获取数据
  window.electron.ipcRenderer.send(mainEvent.GET_CLIPBOARD_CONFIG_LIST)
}
onMounted(() => {
  requestHotKeyConfig()
  window.electron.ipcRenderer.on(mainEvent.CLIPBOARD_CONFIG_LIST, (event, data) => {
    hotKeyConfig.value = data.filter((it) => it.type === HotKeyConfigType.HistoryClipboard)
    for (const hotKeyConfigElement of hotKeyConfig.value) {
      formData[hotKeyConfigElement.propName] = hotKeyConfigElement.hotKey
    }

    console.log('formData.openHistoryHotkey', formData.openHistoryHotkey)
  })
})

onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners()
})

const hotKeySettingChange = (value, propName) => {
  // 把最新的快捷键发到后台，重新注册快捷键
  window.electron.ipcRenderer.send(
    mainEvent.HOT_KEY_SETTING_CHANGE,
    JSON.stringify({
      type: HotKeyConfigType.HistoryClipboard,
      propName,
      hotKey: value
    })
  )
}
</script>

<template>
  <div class="title">功能</div>
  <div class="content">
    <t-form class="form" :data="formData" label-align="left" label-width="160px">
      <t-form-item label="剪切板历史" name="openHistoryHotkey">
        <hot-key-input
          v-model="formData.openHistoryHotkey"
          @change="hotKeySettingChange($event, 'openHistoryHotkey')"
        ></hot-key-input>
      </t-form-item>
    </t-form>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/main.scss';
.title {
  font-weight: 400;
  font-size: var(--td-comp-size-xxs);
  color: #ffffff;
  padding: 0 var(--td-size-8);
  margin-bottom: var(--td-size-6);
}

.content {
  margin: 0 var(--td-size-8);
  padding: var(--td-size-4) var(--td-size-6);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 9px 9px 0 rgba(26, 26, 26, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(5px);
  @include gradient-border-color(rgba(255,255,255,0.0), rgba(255,255,255,0.2), 1px, 8px, 60deg);
}

.form {
  position: relative;
  z-index: 3;

  :deep(.t-form__item) {
    padding: var(--td-size-4) 0;
  }

  .t-input__wrap {
    margin-left: auto;

    :deep(.t-input) {
      background: rgba(255,255,255,0.1);

      &:hover {
        border-color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
</style>
