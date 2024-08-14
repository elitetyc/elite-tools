<script setup lang="ts">

import {  InfoCircleIcon, PasteIcon, ServerIcon,VideoIcon } from "tdesign-icons-vue-next";
import { onMounted } from "vue";
import router from "../router";

onMounted(()=>{
  // 默认打开
  router.push("/main/historyClipboardSetting")
})

const changePage= (path)=>{
  router.push(path)
}

</script>

<template>
  <t-layout class="main-bg">
    <t-aside width="200px" style="background: transparent">
      <t-menu
        @change="changePage"
        style="padding-top: 30px;opacity: 0.9"
        theme="dark"
        default-value="/main/historyClipboardSetting"
        width="100%"
      >
        <t-menu-item value="/main/historyClipboardSetting">
          <template #icon>
            <PasteIcon />
          </template>
          剪切板历史
        </t-menu-item>
        <t-menu-item value="/main/videoParser">
          <template #icon>
            <VideoIcon />
          </template>
          视频解析
        </t-menu-item>
        <t-menu-item value="/main/about">
          <template #icon>
            <InfoCircleIcon />
          </template>
          关于
        </t-menu-item>
      </t-menu>
    </t-aside>
    <t-layout style="background: transparent">
      <t-header height="30px" style="background: transparent" class="header-drag"></t-header>
      <t-layout style="background: transparent">
        <t-content style="background: transparent">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </t-content>
        <t-footer style="background: transparent"></t-footer>
      </t-layout>
    </t-layout>
  </t-layout>
</template>
<style scoped>

.main-bg{
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/images/main-bg.jpeg") !important;
  background-repeat: no-repeat !important;
  background-size: cover !important; /* 可选，根据需要设置背景大小 */
  background-position: center !important;
}




</style>
