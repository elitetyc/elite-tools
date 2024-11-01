import DatabaseManager from "../../ipc/database";
import { RunResult, Statement } from "sqlite3";
import { Context } from "@main/ipc/context";


export class PasswordGroup {
  constructor(public id: number,
              public name: string,
              public create_time: Date) {
  }
}

export function initTable():Promise<boolean>[] {
  return [
    // 创建表
    new Promise<boolean>((resolve, reject)=>{
    DatabaseManager.db.run(`
	create table if not exists password_group
	(
	   id          INTEGER
	       constraint history_clipboard_pk
	           primary key autoincrement,
	   name     text     not null,
	   create_time datetime not null
	);
	`,(err)=>{
        if (err) reject(err);
        else resolve(true)
    });
  }),

  ];
}


export function insertOne(password_group: PasswordGroup, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`INSERT INTO password_group (name, create_time) VALUES (?,?)`
    , [password_group.name, password_group.create_time], callBack);
}

export function updateOne(password_group: PasswordGroup, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`UPDATE password_group set name = ? WHERE id = ?`
    , [password_group.name, password_group.id], callBack);
}


export function deleteOne(id: number, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`DELETE from password_group where id = ?`
    , [id], callBack);
}


export function queryAll(callBack: (this: Statement, err: Error | null, rows: PasswordGroup[]) => void) {
  DatabaseManager.db.all<PasswordGroup>(`SELECT * FROM password_group`, [], callBack);
}

export function sendData() {
  queryAll((err, rows) => {
    if (err) throw err;
    if (Context.onePasswordWindow&&!Context.onePasswordWindow.isDestroyed()) {
      Context.onePasswordWindow.webContents.send(Context.onePasswordEvent.ALL_PASSWORD_GROUP, rows);
    }
  });
}


