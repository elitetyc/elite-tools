<script setup>
const mainEvent = window.api.mainEvent
import { onMounted } from 'vue'
import router from '../router'

onMounted(() => {
  // 默认打开
  router.push('/main/historyClipboardSetting')
})

const changePage = (path) => {
  router.push(path)
  window.electron.ipcRenderer.send(
    mainEvent.MAXSIZE_OR_MINSIZE_WINDOW,
    path === '/main/videoParser'
  )
}
</script>

<template>
  <t-layout class="main-bg">
    <t-aside width="215px" class="layout-nav layout-nav-default-theme">
      <t-menu
        @change="changePage"
        theme="dark"
        default-value="/main/historyClipboardSetting"
        width="100%"
      >
        <t-menu-item value="/main/historyClipboardSetting">
          <template #icon>
            <img src="@renderer/assets/images/setting-icon.png" alt="" class="nav-icon" />
          </template>
          快捷键设置
        </t-menu-item>
        <t-menu-item value="/main/videoParser">
          <template #icon>
            <img src="@renderer/assets/images/video-icon.png" alt="" class="nav-icon" />
          </template>
          视频解析
        </t-menu-item>
        <t-menu-item value="/main/about">
          <template #icon>
            <img src="@renderer/assets/images/about-icon.png" alt="" class="nav-icon" />
          </template>
          关于
        </t-menu-item>
      </t-menu>
    </t-aside>
    <t-layout style="background: transparent">
      <t-header height="40px" style="background: transparent" class="header-drag"></t-header>
      <t-layout style="background: transparent">
        <t-content style="background: transparent">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </t-content>
        <!--        <t-footer style="background: transparent"></t-footer>-->
      </t-layout>
    </t-layout>
  </t-layout>
</template>
<style scoped lang="scss">
@import '@renderer/assets/main.scss';

.main-bg {
  height: 100vh;
  width: 100vw;
  background-image: url('@renderer/assets/images/main-bg.png') !important;
  background-repeat: no-repeat !important;
  background-size: cover !important; /* 可选，根据需要设置背景大小 */
  background-position: center !important;
}

.layout-nav {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(217, 231, 255, 0.056) 99%);
  backdrop-filter: blur(7px);
  position: relative;

  .t-default-menu{
    background: transparent;
  }

  &:after {
    position: absolute;
    width: 1px;
    height: 100%;
    content: '';
    display: block;
    top: 0;
    right: 0;
    background: url('@renderer/assets/images/line.png') no-repeat;
    opacity: .59;
  }
}
</style>
