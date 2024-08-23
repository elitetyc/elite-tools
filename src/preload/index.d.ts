import { ElectronAPI } from '@electron-toolkit/preload'
import { MainEvent,HistoryClipBoarEvent } from '@/type/contextType'
import remote from '@electron/remote'
import { HistoryClipboardType } from '@main/pages/history-clipboard/dao'
import { HotKeyConfigType } from '@main/hotkey/dao'
import { Api } from '@/type/context-type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
    remote: remote
  }
}
