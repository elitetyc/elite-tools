import { clipboard } from "electron";
import { Context } from "../../ipc/context";
import * as passwordGroup from "./dao";
import * as passwordGroupItem from "./item-dao";



export function init() {
  // 监听输入数据变化
  Context.ipcMain.on(Context.onePasswordEvent.GET_ALL_PASSWORD_GROUP, () => {
    passwordGroup.sendData();
  });
  Context.ipcMain.on(Context.onePasswordEvent.GET_ALL_PASSWORD_ITEM, () => {
    passwordGroupItem.sendData();
  });


  // 监听点击某个item
  Context.ipcMain.on(Context.onePasswordEvent.ITEM_COPY, (_, input) => {
    // 将内容设置到剪切版
    clipboard.writeText(input);
    // 关闭弹出
    Context.isCopy = true
    Context.onePasswordWindow.hide();
  });

  Context.ipcMain.on(Context.onePasswordEvent.ADD_PASSWORD_GROUP, (_, input) => {
    // 新增分组
      const group = new passwordGroup.PasswordGroup(-1,input,new Date());
      passwordGroup.insertOne(group,()=>{
        passwordGroup.sendData();
      })
  });

  Context.ipcMain.on(Context.onePasswordEvent.UPDATE_PASSWORD_GROUP, (_, grpupJson) => {
    // 新增分组
    const group = JSON.parse(grpupJson);
    passwordGroup.updateOne(group,()=>{
      passwordGroup.sendData();
    })
  });

  Context.ipcMain.on(Context.onePasswordEvent.DELETE_PASSWORD_GROUP, (_, groupId) => {
    passwordGroup.deleteOne(groupId,()=>{
      passwordGroup.sendData();
      passwordGroupItem.deleteByGroupId(groupId,()=>{
        passwordGroupItem.sendData();
      })
    })
  });

  Context.ipcMain.on(Context.onePasswordEvent.ADD_PASSWORD_ITEM, (_, groupId) => {
    const groupItem = new passwordGroupItem.PasswordGroupItem(
      -1,'','','',groupId,new Date());
    passwordGroupItem.insertOne(groupItem,()=>{
      passwordGroupItem.sendData();
    })
  });

  Context.ipcMain.on(Context.onePasswordEvent.UPDATE_PASSWORD_ITEM, (_, input) => {
    const groupItem = JSON.parse(input);
    passwordGroupItem.updateOne(groupItem,()=>{
      passwordGroupItem.sendData();
    })
  });

  Context.ipcMain.on(Context.onePasswordEvent.DELETE_PASSWORD_ITEM, (_, itemId) => {
    passwordGroupItem.deleteOne(itemId,()=>{
      passwordGroupItem.sendData();
    })
  });
}
