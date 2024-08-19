<script setup lang="ts">
import { CloseIcon, Fullscreen1Icon, RemoveIcon } from 'tdesign-icons-vue-next'
import { computed, ref } from 'vue'
import { mainEventInter } from "@/type/contextType"


const mainEvent: mainEventInter = window.api.mainEvent
const flag = ref(false)
const handle = (type) => {
  type === mainEvent.MAXSIZE_OR_MINSIZE_WINDOW && (flag.value = !flag.value)
  window.electron.ipcRenderer.send(type, flag.value)
}

const isWin = computed(() => window.electron.process.platform === 'win32')
</script>

<template>
  <div v-if="isWin" class="window-bar">
    <RemoveIcon class="icon icon-narrow" @click="handle(mainEvent.MIN_WINDOW)" />
    <Fullscreen1Icon class="icon icon-enlarged" @click="handle(mainEvent.MAXSIZE_OR_MINSIZE_WINDOW)" />
    <CloseIcon class="icon" @click="handle(mainEvent.HIDE_WINDOW)" />
  </div>
  <router-view></router-view>
</template>
<style lang="scss">
@import 'assets/mixin';
body {
  margin: 0;
}

.window-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  width: 100vw;
  color: #fff;
  font-size: 26px;
  z-index: 2000;

  .icon {
    @include absolute-center;
    left: auto;
    right: 0;
    cursor: pointer;
    padding: 2px;
    transition: all 0.2s ease-in;
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &-narrow {
      right: 68px;
    }

    &-enlarged {
      right: 34px;
    }
  }
}
</style>
