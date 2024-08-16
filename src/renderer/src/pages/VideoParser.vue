<script setup>
import { VideoParserConfig } from "./video-parser-config";
import { onMounted, ref } from "vue";
import {
  ChevronLeftCircleIcon,
  ChevronRightCircleIcon,
  PlayCircleIcon,
  RefreshIcon,
  ArrowRightIcon
} from "tdesign-icons-vue-next";
import { MessagePlugin } from "tdesign-vue-next";

const videoPlatformList = VideoParserConfig.videoPlatformList;
const jxPlatformList = VideoParserConfig.jxUrls;
const videoPlatform = ref(videoPlatformList[0].url);
const webviewUrl = ref(videoPlatformList[0].url);
const jxPlatform = ref(jxPlatformList[0].url);
const webviewRef = ref(null);  // 用于绑定 webview 的引用

const webviewLoadUrl = (url) => {
  const webview = webviewRef.value;
  webview.loadURL(url);
};

const goBack = () => {
  const webview = webviewRef.value;
  if (webview.canGoBack()) {
    webview.goBack();
  }
};

const goForward = () => {
  const webview = webviewRef.value;
  if (webview.canGoForward()) {
    webview.goForward();
  }
};

const reload = () => {
  webviewRef.value.reload();
};

// 开始解析按钮
const startParse = () => {
  webviewLoadUrl(jxPlatform.value + webviewUrl.value);
};
// 自定义回调函数，用于处理 URL 变化
const handleUrlChange = (url) => {
  console.log("URL has changed to:", url);
  webviewUrl.value = url;
};

const isFullScreen = ref(false);
onMounted(() => {


  const webview = webviewRef.value;
  if (webview) {
    // webview.addEventListener('did-start-loading', loadstart)
    // webview.addEventListener('did-stop-loading', loadstop)

    window.electron.ipcRenderer.on("webview-new-window", (e, webContentsId, details) => {
      // 监听 new-window 事件，当用户点击链接尝试在新窗口打开时触发
      webview.loadURL(details.url);
    });


    // 监听整个页面的导航事件（包括完整页面加载和重定向）
    webview.addEventListener("did-navigate", (event) => {
      console.log("Page navigated to:", event.url);
      handleUrlChange(event.url);
    });

    // 监听页面内部导航事件（如单页应用中的路由变化或锚点跳转）
    webview.addEventListener("did-navigate-in-page", (event) => {
      console.log("In-page navigated to:", event.url);
      handleUrlChange(event.url);
    });

    webview.addEventListener("dom-ready", () => {

      // 监听进入 HTML 全屏事件
      webview.addEventListener("enter-html-full-screen", () => {
        console.log("Entering full screen mode");
        isFullScreen.value = true;

        // 将 webview 设置为覆盖整个窗口
        webview.style.position = "fixed";
        webview.style.top = "0";
        webview.style.left = "0";
        webview.style.width = "100%";
        webview.style.height = "100%";
        webview.style.zIndex = "1000";  // 使其在最前面显示
      });

      // 监听退出 HTML 全屏事件
      webview.addEventListener("leave-html-full-screen", () => {
        console.log("Exiting full screen mode");
        isFullScreen.value = false;

        // 恢复 webview 原来的大小
        webview.style.position = "relative";
        webview.style.width = "100%";
        webview.style.height = "85vh";  // 恢复为原来的高度
        webview.style.zIndex = "auto";
      });
    });

  }

});


const isLoading = ref(false);
const progress = ref(0);
const hasError = ref(false);


</script>

<template>
  <t-card style="background: transparent;-webkit-app-region: drag;" :bordered="false">
    <t-row justify="space-between" align="center">
      <t-col :span="1">
        <t-select
          class="no-drag"
          v-model="videoPlatform"
          placeholder="-请选择-"
          style="width: 100%; display: inline-block;"
          @change="webviewLoadUrl"
        >
          <t-option v-for="item in videoPlatformList" :key="item.url" :value="item.url" :label="item.name">
            <div>{{ item.name }}</div>
          </t-option>
        </t-select>
      </t-col>
      <t-col :span="0.5" style="text-align: center">
        <ChevronLeftCircleIcon class="no-drag point" size="28" @click="goBack" />
      </t-col>
      <t-col :span="0.5" style="text-align: center">
        <ChevronRightCircleIcon class="no-drag point" size="28" @click="goForward" />
      </t-col>
      <t-col :span="0.5" style="text-align: center">
        <RefreshIcon class="no-drag point" size="28" @click="reload" />
      </t-col>
      <t-col :span="6">
        <t-input placeholder="请输入网址" v-model="webviewUrl" class="no-drag">
          <template #suffixIcon>
            <ArrowRightIcon class="point" @click="webviewLoadUrl(webviewUrl)" />
          </template>
        </t-input>
      </t-col>
      <t-col :span="2" style="text-align: center">
        <t-select
          class="no-drag"
          v-model="jxPlatform"
          placeholder="-请选择-"
          style="width: 100%; display: inline-block;"
        >
          <t-option v-for="item in jxPlatformList" :key="item.url" :value="item.url" :label="item.title">
            <div>{{ item.title }}</div>
          </t-option>
        </t-select>
      </t-col>
      <t-col :span="1.5" style="text-align: center">
        <PlayCircleIcon class="no-drag point" size="28" @click="startParse" />
      </t-col>
    </t-row>
  </t-card>
  <!-- 进度条 -->
  <div v-if="isLoading" class="progress-bar" :style="{ width: `${progress}%` }"></div>
  <t-card style="background: transparent;width: 100%;position: relative" :bordered="false">
    <t-loading :loading="isLoading">
      <webview
        ref="webviewRef"
        :src="videoPlatform"
        style="display:inline-flex; width:100%; height:85vh;"
        allowpopups
        @did-start-loading="isLoading=true;hasError=false"
        @did-stop-loading="isLoading=false"
        @did-fail-load="hasError=true"
      >
      </webview>
    </t-loading>
    <div v-if="hasError" style="width:100%; height:85vh;top:0;
    position: absolute;display: flex;align-items: center;justify-content: center;
font-size: 22px">
      加载失败...
    </div>
  </t-card>

</template>

<style scoped>
.progress-bar {
  height: 4px;
  background-color: #4caf50;
  z-index: 9999;
}

</style>
