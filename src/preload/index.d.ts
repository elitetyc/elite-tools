import { ElectronAPI } from '@electron-toolkit/preload'
import { MainEvent,HistoryClipBoarEvent } from '@/type/contextType'
import remote from '@electron/remote'
import { HistoryClipboardType } from '@main/pages/history-clipboard/dao'
import { HotKeyConfigType } from '@main/hotkey/dao'

interface Api {
  mainEvent: MainEvent
  HistoryClipboardType
  HotKeyConfigType
  historyClipBoarEvent:HistoryClipBoarEvent
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
    remote: remote
  }
}
