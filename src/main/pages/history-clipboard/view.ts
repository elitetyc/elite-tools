import { join } from "path";
import { is } from "@electron-toolkit/utils";
import { BrowserWindow } from "electron";
import { Context } from "../../ipc/context";

export class HistoryClipboardManager {

  public static createWindow(): BrowserWindow {
    // Create the browser window.
    const window = new BrowserWindow({
      width: 600,
      height: 600,
      show: false,
      titleBarStyle: "hidden",
      minimizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, "../preload/index.js"),
        sandbox: false
      }
    });

    // 确保窗口在所有桌面和全屏应用上显示
    // window.setAlwaysOnTop(true, 'screen-saver');
    window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    window.on("ready-to-show", () => {
      window.show();
    });

    window.on("blur", () => {
      window.close();
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      window.loadURL(process.env["ELECTRON_RENDERER_URL"] + "#/historyClipboard");
    } else {
      window.loadURL(`file://${join(__dirname, "../renderer/index.html#/historyClipboard")}`)

    }

    Context.historyClipBoardWindow = window;
    return window;
  }

  public static openHistoryClipBoardWindow(): void {
    if (!Context.historyClipBoardWindow||
      (Context.historyClipBoardWindow&&Context.historyClipBoardWindow.isDestroyed())) {
      HistoryClipboardManager.createWindow()
    }
  }
}
