<script setup lang="ts">
import HistoryClipboardPannel from "../components/HistoryClipboardPannel.vue";
</script>

<template>
  <div class="card-bg" >
    <div class="header-drag" >
    </div>
    <div style="padding: 10px;overflow: scroll;flex: 1">
      <HistoryClipboardPannel></HistoryClipboardPannel>
    </div>
    <div></div>
  </div>
</template>
<style>
.card-bg {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/images/main-bg.jpeg");
  background-repeat: no-repeat;
  background-size: cover; /* 可选，根据需要设置背景大小 */
  background-position: center;
  display: flex;
  flex-direction: column;

}


</style>
