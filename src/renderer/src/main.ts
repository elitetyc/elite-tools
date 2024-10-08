import './assets/main.scss'
import './assets/mixin.scss'
import { createApp } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from './App.vue'
import router from './router'
import TDesign from 'tdesign-vue-next'
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'

createApp(App).use(TDesign).use(router).mount('#app')

// 设置暗色模式
document.documentElement.setAttribute('theme-mode', 'dark')
// 重置为浅色模式
// document.documentElement.removeAttribute('theme-mode');
