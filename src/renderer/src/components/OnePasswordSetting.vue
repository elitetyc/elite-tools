<script setup>
import { computed, onMounted, ref, watch, reactive, onUnmounted } from 'vue'
import HotKeyInput from './HotKeyInput.vue'
const HotKeyConfigType = window.api.HotKeyConfigType
const mainEvent = window.api.mainEvent
const remote = window.remote
console.log(remote.app)
const formData = reactive({
  openOnePasswordHotKey:''
})

const hotKeyConfig = ref([])

const requestOnePasswordConfig = () => {
  // 获取数据
  window.electron.ipcRenderer.send(mainEvent.GET_HOT_KEY_CONFIG,HotKeyConfigType.OnePassword)
}
onMounted(() => {
  requestOnePasswordConfig()
  window.electron.ipcRenderer.on(mainEvent.HOT_KEY_CONFIG, (event, data) => {
    hotKeyConfig.value = data.filter((it) => it.type === HotKeyConfigType.OnePassword)
    for (const hotKeyConfigElement of hotKeyConfig.value) {
      formData[hotKeyConfigElement.propName] = hotKeyConfigElement.hotKey
    }
    console.log('formData.openOnePasswordHotKey', formData.openHistoryHotkey)
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
      type: HotKeyConfigType.OnePassword,
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
      <t-form-item label="打开快捷键" name="openOnePasswordHotKey">
        <hot-key-input
          v-model="formData.openOnePasswordHotKey"
          @change="hotKeySettingChange($event, 'openOnePasswordHotKey')"
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
