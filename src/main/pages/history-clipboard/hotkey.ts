import { globalShortcut } from 'electron/main'
import { HistoryClipboardManager } from "./view";

export function init(): void {

  globalShortcut.register('CommandOrControl+Option+C', () => {
    HistoryClipboardManager.openHistoryClipBoardWindow()
  })
}

