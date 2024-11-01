import DatabaseManager from "../../ipc/database";
import { RunResult, Statement } from "sqlite3";
import { Context } from "@main/ipc/context";


export class PasswordGroupItem {
  constructor(public id: number,
              public name: string,
              public account: string,
              public password: string,
              public group_id: number,
              public create_time: Date) {
  }
}

export function initTable():Promise<boolean>[] {
  return [
    // 创建表
    new Promise<boolean>((resolve, reject)=>{
    DatabaseManager.db.run(`
	create table if not exists password_group_item
	(
	   id          INTEGER
	       constraint history_clipboard_pk
	           primary key autoincrement,
	   name     text     not null,
	   account     text     not null,
	   password     text     not null,
	   group_id          INTEGER not null,
	   create_time datetime not null
	);
	`,(err)=>{
        if (err) reject(err);
        else resolve(true)
    });
  }),

  ];
}


export function insertOne(password_group_item: PasswordGroupItem, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`INSERT INTO password_group_item (name,account,password,group_id,create_time) VALUES (?,?,?,?,?)`
    , [password_group_item.name,password_group_item.account,password_group_item.password,password_group_item.group_id, password_group_item.create_time], callBack);
}

export function updateOne(password_group_item: PasswordGroupItem, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`UPDATE password_group_item set name = ?,account=?,password=?,group_id=? WHERE id = ?`
    , [password_group_item.name,password_group_item.account,password_group_item.password,password_group_item.group_id,password_group_item.id], callBack);
}


export function deleteOne(id: number, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`DELETE from password_group_item where id = ?`
    , [id], callBack);
}

export function deleteByGroupId(groupId: number, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`DELETE from password_group_item where group_id = ?`
    , [groupId], callBack);
}


export function queryAll(callBack: (this: Statement, err: Error | null, rows: PasswordGroupItem[]) => void) {
  DatabaseManager.db.all<PasswordGroupItem>(`SELECT * FROM password_group_item`, [], callBack);
}

export function sendData() {
  queryAll((err, rows) => {
    if (err) throw err;
    if (Context.onePasswordWindow&&!Context.onePasswordWindow.isDestroyed()) {
      Context.onePasswordWindow.webContents.send(Context.onePasswordEvent.ALL_PASSWORD_ITEM, rows);
    }
  });
}


