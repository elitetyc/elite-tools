<script setup lang="ts">
import HistoryClipboardPannel from '../components/HistoryClipboardPannel.vue'
</script>

<template>
  <div class="card-bg">
    <div class="header-drag"></div>
    <div class="panel-content">
      <HistoryClipboardPannel />
    </div>
  </div>
</template>
<style>
.card-bg {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/images/main-bg.png');
  background-repeat: no-repeat;
  background-size: cover; /* 可选，根据需要设置背景大小 */
  background-position: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-content {
  padding: 10px 24px;
  overflow: hidden;
  flex: 1;
}
</style>
