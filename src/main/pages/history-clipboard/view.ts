import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { Context } from '../../ipc/context'
import robot from 'robotjs'

export class HistoryClipboardManager {
  public static createWindow(): BrowserWindow {
    // Create the browser window.
    const window = new BrowserWindow({
      width: 600,
      height: 600,
      show: false,
      titleBarStyle: 'hidden',
      minimizable: !Context.isMac,
      maximizable: !Context.isMac,
      // closable: !Context.isMac,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    // 确保窗口在所有桌面和全屏应用上显示
    // window.setAlwaysOnTop(true, 'screen-saver');
    window.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
      skipTransformProcessType: true
    });

    window.on('ready-to-show', () => {
      window.show()
    })

    window.on('blur', () => {
      if (!is.dev){
        window.close()
      }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/historyClipboard')
    } else {
      window.loadURL(`file://${join(__dirname, '../renderer/index.html#/historyClipboard')}`)
    }

    Context.historyClipBoardWindow = window
    return window
  }

  public static openHistoryClipBoardWindow(): void {
    if (
      !Context.historyClipBoardWindow ||
      (Context.historyClipBoardWindow && Context.historyClipBoardWindow.isDestroyed())
    ) {
      HistoryClipboardManager.createWindow()
    } else {
      // 记录鼠标位置
      const { x, y } = robot.getMousePos()
      Context.mouseClickPosition = {
        x: Number(x),
        y: Number(y)
      }
      Context.historyClipBoardWindow.show()
    }
  }
}
