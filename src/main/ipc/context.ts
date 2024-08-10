import * as os from "os";
import * as path from "node:path";
import { BrowserWindow,ipcMain } from "electron";
const fs = require('fs');

// 获取当前用户主目录
export class Context {
  // 主窗口弹窗
  public static mainWindow:BrowserWindow

  public static ipcMain = ipcMain
  public static homeDirectory = os.homedir();
  public static APP_HOME_DIR = ".elite_clipboard";
  public static APP_DB_NAME = "elite_clipboard.db";

// 剪切板历史弹窗
  public static historyClipBoardWindow:BrowserWindow
  public static HISTORY_CLIPBOARD_LIST = "historyClipboardList";
  public static CLIPBOARD_SEARCH_INPUT_CHANGE = "clipboardSearchInputChange";
  public static CLIPBOARD_ITEM_CLICK = "clipboardItemClick";
  public static CLIPBOARD_KEEP_HOUR  = 24;

  public static getDBPath(){
    return path.join(Context.homeDirectory,Context.APP_HOME_DIR,Context.APP_DB_NAME)
  }

}
export function init(){
  const dirPath = path.join(Context.homeDirectory,Context.APP_HOME_DIR)

// 检查文件夹是否存在
  if (!fs.existsSync(dirPath)) {
    // 创建文件夹
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`应用文件不存在，创建: ${dirPath}`);
  } else {
    console.log(`应用文件存在了: ${dirPath}`);
  }
}

