<script setup>

import { onMounted, ref,watch } from "vue";

const keyMapMapping = {}
for (const keyMapMappingElement of window.api.keyMapMapping) {
  keyMapMapping[keyMapMappingElement.keycode] = keyMapMappingElement
}

const props = defineProps({
  modelValue: String
});

const inputValue = ref("")
const  emit = defineEmits(["update", "update:modelValue","change"]);
const  defaultHotkeyPlaceholder="点击设置快捷键"
const  focusHotkeyPlaceholder="键盘按下要设置的快捷键组合"
const hotkeyPlaceholder = ref(defaultHotkeyPlaceholder)
let keyDown = false

// 用来存放按下的快捷键
const openHistoryHotkeyArray = ref([])

const openHistoryHotkeyDown = (_,{e})=>{
  e.preventDefault();
  if (!keyMapMapping[e.keyCode]){
    // 不能处理的keycode就返回
    return;
  }
  if (openHistoryHotkeyArray.value.includes(keyMapMapping[e.keyCode])){
    return
  }
  keyDown = true
  openHistoryHotkeyArray.value.push(keyMapMapping[e.keyCode])
  inputValue.value = openHistoryHotkeyArray.value.map(it=>
    it.globalShortcutName).join("+")
}
const openHistoryHotkeyUp = ()=>{
  openHistoryHotkeyArray.value = []
}

watch(()=>props.modelValue,(newValue)=>{
  inputValue.value = newValue
})

onMounted(()=>{
  inputValue.value = props.modelValue
})

const setHotkeyPlaceholder = (focus)=>{
  if (focus){
    hotkeyPlaceholder.value = focusHotkeyPlaceholder
    // 只要聚焦就将内容设置为空
    inputValue.value = ''
  }else {
    hotkeyPlaceholder.value = defaultHotkeyPlaceholder
    if (!keyDown){
      // 如果没有按下过键位，恢复到原来的键位
      inputValue.value = props.modelValue
      return
    }else {
      keyDown = false
    }
    emit("update:modelValue",inputValue.value)
    emit("change",inputValue.value)
  }
}

</script>

<template>
  <t-input style="width: 300px"
           @blur="setHotkeyPlaceholder(false)"
           @focus="setHotkeyPlaceholder(true)"
           :placeholder="hotkeyPlaceholder"
           @keydown="openHistoryHotkeyDown"
           @keyup="openHistoryHotkeyUp"
           v-model="inputValue" clearable></t-input>
</template>

<style scoped>

</style>
