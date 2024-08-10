import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '../pages/Main.vue'
import HistoryClipboard from "../pages/HistoryClipboard.vue";
const routes = [
  {
    path: '/main',
    name: 'Main',
    component: Main
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
