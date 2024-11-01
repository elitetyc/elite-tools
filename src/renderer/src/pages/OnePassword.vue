<script setup lang="tsx">
import { AddIcon } from "tdesign-icons-vue-next";
import { computed, onMounted, reactive, ref } from "vue";
import TagInput from "@/renderer/src/components/TagInput.vue";
const onePasswordEvent = window.api.onePasswordEvent;

const groupRef = ref("");
const nowSelectGroupId = ref();
const groupRefStatus = reactive({
  tips: "",
  status: ""
});
const addGroup = () => {
  if (!groupRef.value) {
    groupRefStatus.status = 'error'
    groupRefStatus.tips = '分组名不能为空'
    return;
  }
  groupRefStatus.status = "";
  // 将输入框的值，添加到数据库
  window.electron.ipcRenderer.send(onePasswordEvent.ADD_PASSWORD_GROUP,groupRef.value);

};

const onGroupNameChange = ()=>{
  groupRefStatus.status = ''
  groupRefStatus.tips = ''
}
const addGroupBtn = () => <AddIcon style={{ color: "var(--td-brand-color)", cursor: "pointer" }}
                                   onClick={addGroup} />;

const nowActiveGroup = ref()
const groupList = ref([])
const groupItemList = ref([])
const getAllGroup = () => {
  window.electron.ipcRenderer.send(onePasswordEvent.GET_ALL_PASSWORD_GROUP);
  window.electron.ipcRenderer.send(onePasswordEvent.GET_ALL_PASSWORD_ITEM);
};

const groupItemListComputed = computed(() => {
  return groupItemList.value.filter((item) => {
    return item.group_id === nowActiveGroup.value.id
  });
});
const itemCopyClick = (item) => {
  if (!item){
    return
  }
  window.electron.ipcRenderer.send(onePasswordEvent.ITEM_COPY, item);
};
onMounted(() => {
  // 刚挂载的时候，就请求一次数据
  getAllGroup();
  window.electron.ipcRenderer.on(onePasswordEvent.ALL_PASSWORD_GROUP, (_, data) => {
    groupList.value = data
    if (!nowActiveGroup.value){
      nowActiveGroup.value = groupList.value[0]
      nowSelectGroupId.value = nowActiveGroup.value.id
    }
  });
  window.electron.ipcRenderer.on(onePasswordEvent.ALL_PASSWORD_ITEM, (_, data) => {
    groupItemList.value = data
  });

});

const updateItem = (item,propName,value) => {
  item[propName] = value;
  window.electron.ipcRenderer.send(onePasswordEvent.UPDATE_PASSWORD_ITEM, JSON.stringify(item));
}

const updateGroup = (group,propName,value) => {
  group[propName] = value;
  window.electron.ipcRenderer.send(onePasswordEvent.UPDATE_PASSWORD_GROUP, JSON.stringify(group));
}

const menuRef = ref()
const grouItemAdd = ()=>{
  // 在当前分组下面新增一个
  window.electron.ipcRenderer.send(onePasswordEvent.ADD_PASSWORD_ITEM, nowActiveGroup.value.id);
}
const groupChange = ()=>{

  nowActiveGroup.value = groupList.value.filter((item) => {
    return item.id == nowSelectGroupId.value
  })[0]
}

const deleteGroup = (group)=>{
  if (nowActiveGroup.value&&nowActiveGroup.value.id==group.id){
      nowActiveGroup.value = groupList.value.filter((item)=>{
        return item.id != group.id
      })[0]
  }
  window.electron.ipcRenderer.send(onePasswordEvent.DELETE_PASSWORD_GROUP, group.id);
}
const deleteItem = (item)=>{
  window.electron.ipcRenderer.send(onePasswordEvent.DELETE_PASSWORD_ITEM, item.id);
}
</script>


<template>
  <div class="card-bg">
    <div class="header-drag">
      <div style="text-align: center;color: white;font-weight: bold;margin-top: 10px;margin-left: 100px">
        One Password
      </div>
    </div>
    <div class="panel-content">
      <t-layout class="bg-transparent">
        <t-aside width="180px" class="bg-transparent">
          <t-menu ref="menuRef" @change="groupChange" v-model="nowSelectGroupId" theme="dark"  class="bg-transparent" style="width: 100%;height: 100%">
            <template #logo>
              <t-input v-model="groupRef" @change="onGroupNameChange" :tips="groupRefStatus.tips" :status="groupRefStatus.status" :suffixIcon="addGroupBtn" />
            </template>
            <t-menu-item v-for="(group) in groupList" :value="group.id" >
              <tag-input :content="group.name" background-color="transparent"
                         @input-change="(val)=>updateGroup(group,'name',val)"
                         @delete-item="deleteGroup(group)"
              ></tag-input>
            </t-menu-item>
          </t-menu>
        </t-aside>
        <t-layout style="background: transparent" v-if="nowActiveGroup">
          <t-row style="width: 100%;padding: 0 30px" justify="end">
            <t-button theme="primary" size="small" @click="grouItemAdd">
              <template #icon><AddIcon /></template>
              新增
            </t-button>
          </t-row>
          <t-list class="bg-transparent" style="margin-top: 10px">
            <t-row style="width: 100%;"  :gutter="10" align="center">
              <t-col :span="4"  align="middle">
                描述
              </t-col>
              <t-col :span="4" align="middle">
                账号
              </t-col>
              <t-col :span="4" align="middle">
                密码
              </t-col>
            </t-row>
            <t-list-item class="bg-transparent" v-for="(item) in groupItemListComputed">
              <t-row style="width: 100%;"  :gutter="10" align="center">
                <t-col :span="4" >
                  <tag-input :content="item.name" @input-change="(val)=>updateItem(item,'name',val)"
                             @delete-item="deleteItem(item)"
                             ></tag-input>
                </t-col>
                <t-col :span="4" >
                  <tag-input :content="item.account" @input-change="(val)=>updateItem(item,'account',val)"
                             @delete-item="deleteItem(item)"
                             @click-item="itemCopyClick(item.account)"></tag-input>
                </t-col>
                <t-col :span="4" >
                  <tag-input :content="item.password" @input-change="(val)=>updateItem(item,'password',val)"
                             @delete-item="deleteItem(item)"
                             @click-item="itemCopyClick(item.password)"></tag-input>
                </t-col>

              </t-row>
            </t-list-item>
          </t-list>
        </t-layout>
      </t-layout>

    </div>
  </div>
</template>
<style scoped>
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
  overflow: hidden;
  flex: 1;
}

.bg-transparent {
  background: transparent !important;
}

/deep/ .t-input__wrap {
  margin-left: 8px;
  margin-right: 8px;
}

/deep/ .t-menu__content{
  width: 100%;
}
/deep/ .t-menu__item{
  padding: 0;
}
</style>
