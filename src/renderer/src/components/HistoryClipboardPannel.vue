<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { SearchIcon } from "tdesign-icons-vue-next";

const searchInput = ref();
const historyList = ref([]);

const searchInputChange = (value) => {
  window.electron.ipcRenderer.send("clipboardSearchInputChange", value);
};

const computedHistoryList = computed(() => {
  return historyList.value;
});
const historyItemClick = (item) => {
  window.electron.ipcRenderer.send("clipboardItemClick", JSON.stringify(item));
  // 清空数据
  searchInput.value = "";
};
onMounted(() => {
  // 刚挂载的时候，就请求一次数据
  searchInputChange("")
  window.electron.ipcRenderer.on("historyClipboardList", (event, data) => {
    historyList.value = data
  })
})
watch(searchInput, searchInputChange);
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
          <t-col :span="10" style="overflow: hidden;text-align: start;font-weight: bold">
            <span v-if="item.type===1" class="nowrap-with-ellipsis">{{ item.content }}</span>
            <t-image
              v-else-if="item.type===2"
              :src="item.content"
              :style="{ width: '60px', height: '60px' }"
            />
          </t-col>
          <t-col :span="2">

          </t-col>
        </t-row>
      </t-list-item>
      <template #content>
        <div style="font-weight: bold" v-if="item.type===1">{{ item.content }}</div>
        <div v-if="item.type===2">
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
