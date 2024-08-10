<script setup lang="ts">

import {  InfoCircleIcon, PasteIcon, ServerIcon } from "tdesign-icons-vue-next";
</script>

<template>
  <t-layout class="main-bg">
    <t-aside width="200px" style="background: transparent">
      <t-menu
        style="padding-top: 30px;opacity: 0.9"
        theme="dark"
        default-value="history-clipboard"
        width="100%"
      >
        <t-menu-item value="history-clipboard">
          <template #icon>
            <PasteIcon />
          </template>
          剪切板历史
        </t-menu-item>
        <t-menu-item value="resource">
          <template #icon>
            <ServerIcon />
          </template>
          资源列表
        </t-menu-item>
        <t-menu-item value="about">
          <template #icon>
            <InfoCircleIcon />
          </template>
          关于
        </t-menu-item>
      </t-menu>
    </t-aside>
    <t-layout style="background: transparent">
      <t-header height="30px" style="background: transparent">header</t-header>
      <t-layout style="background: transparent">
        <t-content style="background: transparent">Content</t-content>
        <t-footer style="background: transparent">Footer</t-footer>
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
