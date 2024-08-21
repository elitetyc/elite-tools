import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { HistoryClipboardType } from '@main/pages/history-clipboard/dao'
import { HotKeyConfigType } from '@main/hotkey/dao'
import { Context } from '@main/ipc/context'
import keyMapMapping from '@main/hotkey/keymap'

const remote = require('@electron/remote')

// Custom APIs for renderer
const api = {
  HistoryClipboardType,
  HotKeyConfigType,
  mainEvent: Context.mainEvent,
  historyClipBoarEvent: Context.historyClipBoarEvent,
  keyMapMapping,
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('remote', remote)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.remote = remote
}
