<script setup>
import { computed, onMounted, ref, watch,onUnmounted } from "vue";
import { FileAttachmentIcon, SearchIcon, TextboxIcon,ImageIcon } from "tdesign-icons-vue-next";
const HistoryClipboardType = window.api.HistoryClipboardType
const historyClipboardEvent = window.api.historyClipBoarEvent
const searchInput = ref();
const historyList = ref([]);

const searchInputChange = (value) => {
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
  searchInputChange("")
  window.electron.ipcRenderer.on(historyClipboardEvent.HISTORY_CLIPBOARD_LIST, (event, data) => {
    historyList.value = data
  })
})
watch(searchInput, searchInputChange);

onUnmounted(()=>{
  window.electron.ipcRenderer.removeAllListeners()
})
</script>

<template>
  <t-input v-model="searchInput" placeholder="搜索" clearable autofocus>
    <template #suffixIcon>
      <SearchIcon :style="{ cursor: 'pointer' }" />
    </template>
  </t-input>

  <t-list style="margin-top: 20px;" :split="true" :scroll="{ type: 'virtual' }">
    <t-popup v-for="(item,index) in computedHistoryList" placement="bottom">
      <t-list-item @click="historyItemClick(item)">
        <t-row style="width: 100%">
          <t-col :span="1">
            <TextboxIcon size="30" style="color: #329bbf" v-if="item.type===HistoryClipboardType.text"/>
            <ImageIcon size="30" style="color: #34ed70" v-if="item.type===HistoryClipboardType.img"/>
            <FileAttachmentIcon size="30" style="color: #ed7c53" v-if="item.type===HistoryClipboardType.file"/>
          </t-col>
          <t-col :span="11" style="overflow: hidden;text-align: start;font-weight: bold">
            <span v-if="item.type===HistoryClipboardType.text
            ||item.type===HistoryClipboardType.file" class="nowrap-with-ellipsis">{{ item.content }}</span>
            <t-image
              v-else-if="item.type===HistoryClipboardType.img"
              :src="item.content"
              :style="{ width: '60px', height: '60px' }"
            />
          </t-col>
        </t-row>
      </t-list-item>
      <template #content>
        <div style="font-weight: bold" v-if="item.type===HistoryClipboardType.text
        ||item.type===HistoryClipboardType.file">{{ item.content }}</div>
        <div v-if="item.type===HistoryClipboardType.file">
          <t-image
            fit="contain"
            :src="item.content"
            :style="{ width: '300px', height: '300px' }"
          />
        </div>
      </template>
    </t-popup>

  </t-list>
</template>

<style lang="scss" scoped>

.t-list-item:hover {
  cursor: pointer;
  background-color: var(--td-border-level-1-color);
}

.nowrap-with-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
