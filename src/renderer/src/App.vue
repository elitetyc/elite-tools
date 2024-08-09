<script setup lang="ts">
import Main from "./components/Main.vue";
import { Setting1Icon } from "tdesign-icons-vue-next";
</script>

<template>
  <div class="card-bg" >
    <div style="display: flex;justify-content: space-between;padding: 10px">
      <span></span>
      <Setting1Icon size="18px" style="cursor: pointer;" />
    </div>
    <div style="padding: 10px;overflow: scroll;flex: 1">
      <Main></Main>
    </div>
    <div></div>
  </div>
</template>
<style>
.card-bg {
  width: 100vw;
  height: 100vh;
  background-image: url("./assets/images/img.png");
  background-repeat: no-repeat;
  background-size: cover; /* 可选，根据需要设置背景大小 */
  background-position: center;
  display: flex;
  flex-direction: column;

}


</style>
