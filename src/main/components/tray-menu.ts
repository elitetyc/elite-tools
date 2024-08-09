import { app, BrowserWindow, nativeImage } from "electron";
// import iconIco from '../../../resources/tray-old-old-icon.png?asset'
import iconIco from '../../../resources/iconTemplate@2x.png?asset'
import { createWindow } from "../index";
import { Context } from "../ipc/context";
const { Tray, Menu } = require('electron')

export default class TrayMenu {
  // 初始化托盘菜单
  public static init(): void {
    var icon = nativeImage.createFromPath(iconIco);
    icon.setTemplateImage(true)
    let tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      { label: '打开主界面',click: openMainWindow},
      { label: '退出',click: quit},
    ])

    tray.setContextMenu(contextMenu)
    tray.setToolTip('elite-clipboard')
    // tray.setTitle('11')
  }
}

function openMainWindow(): void {
  if (BrowserWindow.getAllWindows().length === 0) createWindow(true)
  Context.mainWindow.show()
}

function quit():void{
  app.quit()
}
