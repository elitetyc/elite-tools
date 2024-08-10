import DatabaseManager from "../../ipc/database";
import { Context } from "../../ipc/context";
import { RunResult, Statement } from "sqlite3";

export enum HistoryClipboardType {
  text = "1",
  img = "2",
}

export class HistoryClipboard {
  constructor(public id: number,
              public type: string,
              public content: string,
              public create_time: Date) {
  }
}

export function initTable() {
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
	`);
}


export function insertOne(history_clipboard: HistoryClipboard, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`INSERT INTO history_clipboard (type, content, create_time) VALUES (?,?,?)`
    , [history_clipboard.type, history_clipboard.content, history_clipboard.create_time], callBack);
}

export function updateOne(history_clipboard: HistoryClipboard, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`UPDATE history_clipboard set create_time = ? WHERE id = ?`
    , [history_clipboard.create_time, history_clipboard.id], callBack);
}


export function deleteByTime(date: Date, callBack: (this: RunResult, err: Error | null) => void) {
  DatabaseManager.db.run(`DELETE from history_clipboard where create_time < ?`
    , [date], callBack);
}

export function queryAll(callBack: (this: Statement, err: Error | null, rows: HistoryClipboard[]) => void, key?: string) {
  if (key) key = key.trim();
  let searchKey = "";
  if (key) {
    searchKey = ` where content like '%${key}%'`;
  }
  DatabaseManager.db.all<HistoryClipboard>(`SELECT * FROM history_clipboard  ${searchKey} order by create_time desc`, [], callBack);
}

export function queryHistoryClipboardType(callBack: (this: Statement, err: Error | null, rows: HistoryClipboard[]) => void) {
  DatabaseManager.db.all<HistoryClipboard>(`SELECT t1.type, t1.content
FROM history_clipboard t1
         JOIN (
    SELECT type, MAX(create_time) AS max_created_at
    FROM history_clipboard
    GROUP BY type
) t2 ON t1.type = t2.type AND t1.create_time = t2.max_created_at;`, [], callBack);
}

export function sendData(key?: string) {
  queryAll((err, rows) => {
    if (err) throw err;
    if (Context.historyClipBoardWindow&&!Context.historyClipBoardWindow.isDestroyed()) {
      Context.historyClipBoardWindow.webContents.send(Context.HISTORY_CLIPBOARD_LIST, rows);
    }
  }, key);
}
