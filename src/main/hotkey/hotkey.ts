import { globalShortcut } from "electron/main";
import * as hotKeyConfig from "./dao";
import { HotKeyConfig, HotKeyConfigType } from "./dao";
import { HistoryClipboardManager } from "../pages/history-clipboard/view";
import { Context } from "../ipc/context";
import { OnePasswordManager } from "@main/pages/one-password/view";


class HotKeyOption{
  type: hotKeyConfig.HotKeyConfigType;
  propName: string;
  callback: () => void;
  constructor(type:hotKeyConfig.HotKeyConfigType,propName:string,callback:()=>void ){
    this.type = type
    this.propName = propName
    this.callback = callback
  }
}
// 存放快捷键的所有方法
const HotkeyOptionList:HotKeyOption[] = [
  // 打开剪切板
  new HotKeyOption(HotKeyConfigType.HistoryClipboard,"openHistoryHotkey",()=>{
    HistoryClipboardManager.openHistoryClipBoardWindow()
  }),
  new HotKeyOption(HotKeyConfigType.OnePassword,"openOnePasswordHotKey",()=>{
    OnePasswordManager.openOnePasswordWindow()
  })
]

export function init(): void {
  registerAllHotKey()

  // 监听请求快捷键的消息
  Context.ipcMain.on(Context.mainEvent.GET_HOT_KEY_CONFIG, sendAllConfigData)


  // 监听修改按键的消息
  Context.ipcMain.on(Context.mainEvent.HOT_KEY_SETTING_CHANGE,(_, args)=>{
    const  hotKeyConfigInfo:HotKeyConfig= JSON.parse(args)
    hotKeyConfig.updateByTypeAndProps(hotKeyConfigInfo,(err)=>{
      if (err) Context.logger.error(err)
      // 重新发送数据
      sendAllConfigData(_,hotKeyConfigInfo.type)
      // 更新之后，重新注册快捷键
      registerAllHotKey()
    })
  })
}


function sendAllConfigData(_,args){
  hotKeyConfig.queryAll((err,rows)=>{
    if (err) Context.logger.error(err)
    // 查询所有的数据，往前端发送一下
    const hotKeyConfigs = rows.filter(it=>it.type===args);
    Context.mainWindow.webContents.send(Context.mainEvent.HOT_KEY_CONFIG,hotKeyConfigs)
  })
}

function registerAllHotKey(){
  // 先取消所有快捷键注册
  globalShortcut.unregisterAll()
  // 查询所有配置
  hotKeyConfig.queryAll((err,rows)=>{
    if (err) Context.logger.error(err)
    rows.forEach((row)=>{
      const filterRes =  HotkeyOptionList.filter(option=>option.type===row.type&&option.propName===row.propName)
      if (filterRes.length>0&&row.hotKey){
        Context.logger.info("准备注册快捷键",row.hotKey)
        globalShortcut.register(row.hotKey, filterRes[0].callback)
      }
    })
  })
}





