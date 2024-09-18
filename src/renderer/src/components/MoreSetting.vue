<script setup>
import { reactive, onMounted } from "vue";
import { FolderOpenIcon } from "tdesign-icons-vue-next";
const mainEvent = window.api.mainEvent


const mainRemote = window.api.mainRemote;

const formData = reactive({
  openAutoLaunch: false
});

const onOpenAutoLaunch = (value) => {
  mainRemote.toggleEnableAutoLaunch(value)
};
onMounted(() => {
  mainRemote.isEnableAutoLaunch().then((isEnable) => {
    console.log("是否已经开启", isEnable);
    formData.openAutoLaunch = isEnable;
  });
});

const openLogFile = ()=>{
  window.electron.ipcRenderer.send(mainEvent.OPEN_LOG_FILE)
}
</script>

<template>
  <div class="title">功能</div>
  <div class="content">
    <t-form class="form" :data="formData" label-align="left" label-width="160px">
      <t-form-item label="开机自启动" name="openAutoLaunch">
        <t-row style="width: 100%">
          <t-col :span="2" :offset="10">
            <t-switch v-model="formData.openAutoLaunch" size="large" @change="onOpenAutoLaunch" />
          </t-col>
        </t-row>
      </t-form-item>
      <t-form-item label="打开日志文件" >
        <t-row style="width: 100%">
          <t-col :span="2" :offset="10">
            <t-button shape="circle" theme="primary">
              <template #icon> <FolderOpenIcon @click="openLogFile" /></template>
            </t-button>
          </t-col>
        </t-row>
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
  @include gradient-border-color(rgba(255, 255, 255, 0.0), rgba(255, 255, 255, 0.2), 1px, 8px, 60deg);
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
      background: rgba(255, 255, 255, 0.1);

      &:hover {
        border-color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
</style>
