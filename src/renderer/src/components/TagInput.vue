<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { InputProps } from "tdesign-vue-next";
import { EditIcon } from "tdesign-icons-vue-next";

const input = ref();
const inputVisible = ref(false);

const emit = defineEmits<{
  (e: "inputChange", newValue: any): void,
  (e: "clickItem", newValue: any): void,
  (e: "deleteItem"): void,
}>();
const handleInputEnter: InputProps["onEnter"] = (val) => {
  inputVisible.value = false;
  emit("inputChange", val);
};
const handleClickChange = () => {
  inputVisible.value = true;
  nextTick(() => {
    input.value.focus();
  });
};

const props = defineProps<{
  content?: string,
  backgroundColor?:string
}>();
const contentInput = ref();

watch(() => props.content, (newVal) => {
  contentInput.value = newVal;
},{immediate:true});
const handleClickCopy = () => {
  emit("clickItem", props.content);
};
const showIcon = ref(false);
</script>

<template>
  <div @mouseenter="()=>showIcon=true" @mouseleave="()=>showIcon=false">
    <t-popup destroy-on-close trigger="context-menu">
      <template #content>
        <t-button block theme="danger" variant="base" size="small" @click="emit('deleteItem')">删除</t-button>
      </template>
      <div v-if="!inputVisible"  class="tag-show" :style="{background:backgroundColor?backgroundColor:'#848585'}">
      <span @click="handleClickCopy" class="nowrap-ellipsis" >
        {{ content?content:'请输入' }}
      </span>
        <edit-icon v-if="showIcon" @click="handleClickChange" style="cursor: pointer"></edit-icon>
      </div>
      <t-input v-else ref="input" size="small" v-model="contentInput" style="width: 100%" @blur="handleInputEnter"
               @enter="handleInputEnter" />
    </t-popup>
  </div>
</template>

<style scoped lang="scss">
.tag-show {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  border-radius: 5px;
  height: 30px;
  padding: 0 10px;
  cursor: copy;
}
.nowrap-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
