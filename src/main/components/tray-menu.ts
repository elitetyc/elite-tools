import { app, nativeImage, Tray, Menu } from 'electron'
import iconIco from '../../../resources/iconTemplate@2x.png?asset'
import iconIcoWin from '../../../resources/icon.png?asset'
import { Context } from '../ipc/context'
import { HistoryClipboardManager } from '../pages/history-clipboard/view'
import { createWindow } from '../index'

export default class TrayMenu {
  // 初始化托盘菜单
  public static init(): void {
    let tray;
    if (Context.isMac) {
      const icon = nativeImage.createFromPath(iconIco)
      icon.setTemplateImage(true);
      tray = new Tray(icon);
    } else if (Context.isWin) tray = new Tray(iconIcoWin);

    const contextMenu = Menu.buildFromTemplate([
      { label: "打开主界面", click: openMainWindow },
      { label: "打开剪切板历史", click: HistoryClipboardManager.openHistoryClipBoardWindow },
      { label: "退出", click: quit }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip("elite-clipboard");
    // tray.setTitle('11')
  }
}

export function openMainWindow(): void {
  if (!Context.mainWindow || (Context.mainWindow && Context.mainWindow.isDestroyed())) createWindow();
  else Context.mainWindow.show()
}

function quit(): void {
  app.quit()
}
