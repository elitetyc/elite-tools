import * as os from 'os'
import * as path from 'node:path'
import { BrowserWindow, ipcMain } from 'electron'
import { Database } from 'sqlite3'
import { mainEventInter } from "@/type/contextType";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')

// 获取当前用户主目录
export class Context {
  public static isMac = process.platform === 'darwin'
  public static isWin = process.platform === 'win32'
  public static isLinux = process.platform === 'linux'
  public static dbInitSuccess = false
  // 主窗口弹窗
  public static mainWindow: BrowserWindow
  public static mainEvent: mainEventInter = {
    CLIPBOARD_CONFIG_LIST: 'clipboard_config_list',
    GET_CLIPBOARD_CONFIG_LIST: 'get_clipboard_config_list',
    HOT_KEY_SETTING_CHANGE: 'hot_key_setting_change',
    MAXSIZE_OR_MINSIZE_WINDOW: 'max_window',
    MIN_WINDOW: 'min_window',
    HIDE_WINDOW: 'hide_window'
  }

  public static ipcMain = ipcMain
  public static homeDirectory = os.homedir()
  public static APP_HOME_DIR = '.elite_clipboard'
  public static APP_DB_NAME = 'elite_clipboard.db'

  // 剪切板历史弹窗
  public static historyClipBoardWindow: BrowserWindow
  public static historyClipBoarEvent = {
    HISTORY_CLIPBOARD_LIST: 'historyClipboardList',
    CLIPBOARD_SEARCH_INPUT_CHANGE: 'clipboardSearchInputChange',
    CLIPBOARD_ITEM_CLICK: 'clipboardItemClick'
  }
  public static CLIPBOARD_KEEP_HOUR = 24

  public static getDBPath() {
    return path.join(Context.homeDirectory, Context.APP_HOME_DIR, Context.APP_DB_NAME)
  }
}
export function init() {
  const dirPath = path.join(Context.homeDirectory, Context.APP_HOME_DIR)

  // 检查文件夹是否存在
  if (!fs.existsSync(dirPath)) {
    // 创建文件夹
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`应用文件不存在，创建: ${dirPath}`)
  } else {
    console.log(`应用文件存在了: ${dirPath}`)
  }

  // 监听是否需要最大化页面
  ipcMain.on(Context.mainEvent.MAXSIZE_OR_MINSIZE_WINDOW, (_, args) => {
    if (args == true) {
      Context.mainWindow.maximize()
    } else {
      Context.mainWindow.unmaximize()
    }
  })

  ipcMain.on(Context.mainEvent.HIDE_WINDOW, () => {
    Context.mainWindow.hide()
  })

  ipcMain.on(Context.mainEvent.MIN_WINDOW, () => {
    Context.mainWindow.minimize()
  })
}

// 数据库初始化结果
export interface DBInitCallBack {
  success(db: Database)
  fail(err)
}
