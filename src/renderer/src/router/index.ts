import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '../pages/Main.vue'
import HistoryClipboard from "../pages/HistoryClipboard.vue";
import HistoryClipboardSetting from "../components/HistoryClipboardSetting.vue";
import VideoParser from "../components/VideoParser.vue";
import About from "../components/About.vue";
import MoreSetting from "../components/MoreSetting.vue";
const routes = [
  {
    path: '/main',
    name: 'Main',
    component: Main,
    children:[
      {
        path: 'historyClipboardSetting',
        name: 'HistoryClipboardSetting',
        component: HistoryClipboardSetting,
      },{
        path: 'videoParser',
        name: 'VideoParser',
        component: VideoParser,
      },{
        path: 'moreSetting',
        name: 'MoreSetting',
        component: MoreSetting,
      },{
        path: 'about',
        name: 'About',
        component: About,
      }
    ]
  },
  {
    path: '/historyClipboard',
    name: 'HistoryClipboard',
    component: HistoryClipboard
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
