import DatabaseManager from "../ipc/database";
import { RunResult, Statement } from "sqlite3";

export enum HotKeyConfigType {
  HistoryClipboard =1,
  OnePassword =2,
}

export class HotKeyConfig {
  constructor(public id: number,
              public type: number,
              public propName:string,
              public hotKey: string,
              public defaultHotKey: string,
              public remark :string) {
  }
}

export function initTable():Promise<boolean>[] {
  return [
    // 创建表
    new Promise<boolean>((resolve, reject)=>{
      DatabaseManager.db.run(`
	create table if not exists hot_key_config
	(
	   id          INTEGER
	       constraint hot_key_config_pk
	           primary key autoincrement,
	   type        int      not null,
	   propName     text     not null,
	   hotKey     text     not null,
	   defaultHotKey     text     not null,
	   remark     text     not null
	);
	`,(err)=>{
        if (err) reject(err);
        else resolve(true)
      });
    }),

    // 新增初始化的快捷键
    new Promise<boolean>((resolve, reject)=>{
      DatabaseManager.db.run(`insert OR IGNORE into hot_key_config values (1,${HotKeyConfigType.HistoryClipboard},'openHistoryHotkey','Meta+Alt+C','Meta+Alt+C','打开剪切板历史弹窗')`,
        (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      });
    }),
    new Promise<boolean>((resolve, reject)=>{
      DatabaseManager.db.run(`insert OR IGNORE into hot_key_config values (2,${HotKeyConfigType.OnePassword},'openOnePasswordHotKey','Meta+Alt+P','Meta+Alt+P','打开onePassword')`,
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        });
    })

  ];
}


export function queryAll(callBack: (this: Statement, err: Error | null, rows: HotKeyConfig[],type?:number,) => void, type?: string) {
  if (type){
    DatabaseManager.db.all<HotKeyConfig>(`SELECT * FROM hot_key_config where type = ?`, [type], callBack);
  }else {
    DatabaseManager.db.all<HotKeyConfig>(`SELECT * FROM hot_key_config`, [], callBack);
  }

}

export function updateByTypeAndProps(hotkeyConfig:HotKeyConfig, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(
    `UPDATE hot_key_config set hotKey = ? WHERE type= ? and propName= ?`,
    [hotkeyConfig.hotKey,hotkeyConfig.type,hotkeyConfig.propName], callBack);
}
