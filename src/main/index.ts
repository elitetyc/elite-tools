import { app, shell, BrowserWindow } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import * as HotKey from "./hotkey/hotkey";
import * as Clipboard from "./pages/history-clipboard/clipboard";
import DatabaseManager from "./ipc/database";

import * as Context from "./ipc/context";

import TrayMenu from "./components/tray-menu";

// in the main process:
require("@electron/remote/main").initialize();

// 全局变量初始化
Context.init();
// 初始化数据库
new DatabaseManager(Context.Context.getDBPath()).init();
// 设置dock栏菜单
Context.Context.isMac && app.dock.setIcon(icon);

export function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 550,
    titleBarStyle: "hidden",
    icon: icon,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      // 启用页面中的webview标签
      webviewTag: true
    }
  });

  // 监听webview的弹窗页面
  mainWindow.webContents.on("did-attach-webview", (_, wc) => {
    wc.setWindowOpenHandler((details) => {
      mainWindow.webContents.send("webview-new-window", wc.id, details);
      return { action: "deny" };
    });
  });

  require("@electron/remote/main").enable(mainWindow.webContents);

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    // 只要主窗口展示，就设置dock栏目图标
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"] + "#/main");
    // 开发的时候，每次启动默认打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // mainWindow.loadFile(join(__dirname, '../renderer/index.html#/main'))
    mainWindow.loadURL(`file://${join(__dirname, "../renderer/index.html#/main")}`);
  }

  Context.Context.mainWindow = mainWindow;
  Context.Context.isMac && app.dock.show();
  Context.Context.isMac && app.dock.setIcon(icon);
  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // 初始化快捷键
  HotKey.init();
  // 初始化剪切盘监听
  Clipboard.init();
  // 初始化托盘
  TrayMenu.init();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
  // 如果是mac，关闭所有窗口时，隐藏dock图标
  Context.Context.isMac && app.dock.hide();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
