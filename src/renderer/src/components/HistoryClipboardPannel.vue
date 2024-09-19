<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from "vue";
import { FileAttachmentIcon, SearchIcon, TextboxIcon, ImageIcon } from "tdesign-icons-vue-next";

const HistoryClipboardType = window.api.HistoryClipboardType;
const historyClipboardEvent = window.api.historyClipBoarEvent;
const searchInput = ref();
const historyList = ref([]);

const scrollList = ref(null);
const loading = ref(true);

const searchInputChange = (value) => {
  loading.value = true;
  window.electron.ipcRenderer.send(historyClipboardEvent.CLIPBOARD_SEARCH_INPUT_CHANGE, value);
};

const computedHistoryList = computed(() => {
  return historyList.value;
});
const historyItemClick = (item) => {
  window.electron.ipcRenderer.send(historyClipboardEvent.CLIPBOARD_ITEM_CLICK, JSON.stringify(item));
  // 清空数据
  searchInput.value = "";
};
onMounted(() => {
  // 刚挂载的时候，就请求一次数据
  searchInputChange("");
  window.electron.ipcRenderer.on(historyClipboardEvent.HISTORY_CLIPBOARD_LIST, (event, data) => {
    loading.value = false;
    historyList.value = data;
    // 每次有最新的剪切板内容都滚动到最上面
    if (scrollList.value) {
      scrollList.value.$el.scrollTop = 0;
    }
  });
});
watch(searchInput, searchInputChange);

onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners();
});

</script>

<template>
  <t-input v-model="searchInput" placeholder="搜索" clearable autofocus>
    <template #suffixIcon>
      <SearchIcon :style="{ cursor: 'pointer' }" />
    </template>
  </t-input>
  <t-list ref="scrollList" class="p-list" :split="true" :scroll="{ type: 'virtual' }">
    <div
      v-if="computedHistoryList.length === 0"
      style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <t-empty />
    </div>
    <t-popup v-for="(item, index) in computedHistoryList" v-else :key="index" placement="bottom">
      <t-list-item @click="historyItemClick(item)">
        <t-row style="width: 100%">
          <t-col :span="1">
            <TextboxIcon
              v-if="item.type === HistoryClipboardType.text"
              size="30"
              style="color: #329bbf"
            />
            <ImageIcon
              v-if="item.type === HistoryClipboardType.img"
              size="30"
              style="color: #34ed70"
            />
            <FileAttachmentIcon
              v-if="item.type === HistoryClipboardType.file"
              size="30"
              style="color: #ed7c53"
            />
          </t-col>
          <t-col :span="11" style="overflow: hidden; text-align: start; font-weight: bold">
            <span
              v-if="
                item.type === HistoryClipboardType.text || item.type === HistoryClipboardType.file
              "
              class="nowrap-with-ellipsis"
            >{{ item.content }}</span
            >
            <t-image
              v-else-if="item.type === HistoryClipboardType.img"
              :src="item.content"
              :style="{ width: '60px', height: '60px' }"
            />
          </t-col>
        </t-row>
      </t-list-item>
      <template #content>
        <div
          style="font-weight: bold"
          v-if="item.type === HistoryClipboardType.text || item.type === HistoryClipboardType.file"
        >
          {{ item.content }}
        </div>
        <div v-if="item.type === HistoryClipboardType.img">
          <t-image fit="contain" :src="item.content" :style="{ width: '300px', height: '300px' }" />
        </div>
      </template>
    </t-popup>
  </t-list>
  <t-loading :loading="loading" attach=".p-list"></t-loading>
</template>

<style lang="scss" scoped>
@import '../assets/main.scss';

.t-list-item:hover {
  cursor: pointer;
  background-color: var(--td-border-level-1-color);
}

.nowrap-with-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@mixin focus {
  z-index: 1;
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

:deep(.t-input) {
  background: rgba(255, 255, 255, 0.1);

  &:focus {
    @include focus;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
  }
}

:deep(.t-input--focused) {
  @include focus;
}

:deep(.t-list__inner) {
  height: 100%;
}

.p-list {
  height: calc(100% - 64px);
  overflow: auto;
  margin-top: 20px;
  border-radius: var(--td-radius-default);
  background: rgba(244, 255, 255, .08);
  backdrop-filter: blur(5px);

  .t-list-item:hover {
    background-color: #152a5b85;
  }
}

.t-list--split .t-list-item::after {
  background: rgba(244, 255, 255, .1);
  margin: 0 16px;
  width: calc(100% - 32px);
}
</style>
