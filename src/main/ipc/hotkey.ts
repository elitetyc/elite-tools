import { globalShortcut } from 'electron/main'
import { Context } from "./context";
import { BrowserWindow } from "electron";
import { createWindow } from "../index";

export function init(): void {

  globalShortcut.register('CommandOrControl+Option+C', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(true)
    Context.mainWindow.show()
  })

  globalShortcut.register('Esc', () => {
    if (BrowserWindow.getAllWindows().length !== 0){
      Context.mainWindow.hide()
    }
  })
}

