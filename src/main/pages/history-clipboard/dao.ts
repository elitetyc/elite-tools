import DatabaseManager from "../../ipc/database";
import { Context } from "../../ipc/context";
import { RunResult, Statement } from "sqlite3";

export enum HistoryClipboardType {
  text =1,
  img = 2,
  file = 3,
}

export class HistoryClipboard {
  constructor(public id: number,
              public type: number,
              public content: string,
              public md5: string,
              public create_time: Date) {
  }
}

export function initTable():Promise<boolean>[] {
  return [
    // 创建表
    new Promise<boolean>((resolve, reject)=>{
    DatabaseManager.db.run(`
	create table if not exists history_clipboard
	(
	   id          INTEGER
	       constraint history_clipboard_pk
	           primary key autoincrement,
	   type        int      not null,
	   content     text     not null,
	   create_time datetime not null
	);
	`,(err)=>{
        if (err) reject(err);
        else resolve(true)
    });
  }),

  // 版本迭代，新增md5字段
  new Promise<boolean>((resolve, reject)=>{
    DatabaseManager.db.serialize(() => {
      DatabaseManager.db.all<any>("PRAGMA table_info(history_clipboard)", (err, rows) => {
        if (err) {
          reject(err);
        }
        // 检查是否存在md5列
        const hasMD5Column = rows.some(row => row.name === 'md5');

        if (!hasMD5Column) {
          // 如果md5列不存在，则添加列
          DatabaseManager.db.run("ALTER TABLE history_clipboard ADD COLUMN md5 TEXT", (err) => {
            if (err) {
             reject(err)
            } else {
              resolve(true)
            }
          });
        } else {
         resolve(true)
        }
      });
    });
  })];
}


export function insertOne(history_clipboard: HistoryClipboard, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`INSERT INTO history_clipboard (type, content,md5, create_time) VALUES (?,?,?,?)`
    , [history_clipboard.type, history_clipboard.content,history_clipboard.md5, history_clipboard.create_time], callBack);
}

export function updateOne(history_clipboard: HistoryClipboard, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`UPDATE history_clipboard set create_time = ? WHERE id = ?`
    , [history_clipboard.create_time, history_clipboard.id], callBack);
}


export function deleteByTime(date: Date, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`DELETE from history_clipboard where create_time < ?`
    , [date], callBack);
}

export function queryByMd5(md5:string,callback?: (this: Statement, err: Error | null, row: HistoryClipboard) => void){
  DatabaseManager.db.get<HistoryClipboard>(
    "select *from history_clipboard where md5 = ?",[md5],callback)
}
export function queryAll(callBack: (this: Statement, err: Error | null, rows: HistoryClipboard[]) => void, key?: string) {
  if (key) key = key.trim();
  let searchKey = "";
  if (key) {
    searchKey = ` where content like '%${key}%'`;
  }
  DatabaseManager.db.all<HistoryClipboard>(`SELECT * FROM history_clipboard  ${searchKey} order by create_time desc`, [], callBack);
}

export function sendData(key?: string) {
  queryAll((err, rows) => {
    if (err) throw err;
    if (Context.historyClipBoardWindow&&!Context.historyClipBoardWindow.isDestroyed()) {
      Context.historyClipBoardWindow.webContents.send(Context.HISTORY_CLIPBOARD_LIST, rows);
    }
  }, key);
}
