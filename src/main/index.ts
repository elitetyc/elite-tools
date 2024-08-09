import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as HotKey from "./ipc/hotkey";
import * as Clipboard from "./ipc/clipboard";
import DatabaseManager from "./ipc/database";

import * as Context from "./ipc/context"

import TrayMenu from "./components/tray-menu";

// 全局变量初始化
Context.init()
// 初始化数据库
new DatabaseManager(Context.Context.getDBPath()).init()
// 设置dock栏菜单
app.dock.setIcon(icon)


export function createWindow(visibleOnFullScreen:boolean): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    titleBarStyle: 'hidden',
    minimizable:false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 确保窗口在所有桌面和全屏应用上显示
  // mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: visibleOnFullScreen });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })


  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  Context.Context.mainWindow = mainWindow

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow(false)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(false)
  })

  // 初始化快捷键
  HotKey.init()
  // 初始化剪切盘监听
  Clipboard.init()
  // 初始化托盘
  TrayMenu.init()

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
