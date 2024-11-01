import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { Context } from '../../ipc/context'
import robot from 'robotjs'
const remote = require("@electron/remote/main");

export class OnePasswordManager {
  public static createWindow(): BrowserWindow {
    // Create the browser window.
    const window = new BrowserWindow({
      width: 800,
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

    // window.on('ready-to-show', () => {
    //   window.show()
    // })

    window.on('hide', () => {
      if (Context.isCopy){
        const { x: mouseX, y: mouseY } = Context.mouseClickPosition;
        robot.moveMouse(mouseX, mouseY);
        robot.mouseClick();
        // 模拟粘贴
        robot.keyTap("v", [Context.isMac ? "command" : "control"]);
        Context.isCopy = false
      }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/onePassword')
    } else {
      window.loadURL(`file://${join(__dirname, '../renderer/index.html#/onePassword')}`)
    }

    Context.onePasswordWindow = window
    remote.enable(window.webContents);
    return window
  }

  public static openOnePasswordWindow(): void {
    // 记录鼠标位置
    const { x, y } = robot.getMousePos()
    Context.mouseClickPosition = {
      x: Number(x),
      y: Number(y)
    }
    if (
      !Context.onePasswordWindow ||
      (Context.onePasswordWindow && Context.onePasswordWindow.isDestroyed())
    ) {
      const window = OnePasswordManager.createWindow();
      window.show()
    } else {
      Context.onePasswordWindow.show()
    }
  }
}
