import DatabaseManager from "../database";
import { Context } from "../context";
import { Statement } from "sqlite3";
import { ISqlite } from "sqlite";
export enum HistoryClipboardType{
  text = "1",
  img = "2",
}

export class HistoryClipboard {
  constructor(public id: number,
              public type: string,
              public content: string,
              public create_time: Date)  {}
}
export function initTable(){
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
	`).then(() => {
    // sendData()
  })
}


export function insertOne(history_clipboard: HistoryClipboard) : Promise<ISqlite.RunResult<Statement>> {
  return DatabaseManager.db.run(`INSERT INTO history_clipboard (type, content, create_time) VALUES (?,?,?)`
    ,[history_clipboard.type, history_clipboard.content, history_clipboard.create_time]);
}

export function updateOne(history_clipboard: HistoryClipboard) : Promise<ISqlite.RunResult<Statement>> {
  return DatabaseManager.db.run(`UPDATE history_clipboard set create_time = ? WHERE id = ?`
    ,[history_clipboard.create_time,history_clipboard.id])
}


export function deleteByTime(date:Date) : Promise<ISqlite.RunResult<Statement>> {
  return DatabaseManager.db.run(`DELETE from history_clipboard where create_time < ?`
    ,[date])
}

export async function queryAll(key?: string): Promise<HistoryClipboard[]> {
  if (key) key = key.trim()
  let searchKey = ''
  if (key) {
    searchKey = ` where content like '%${key}%'`
  }
  return DatabaseManager.db.all<HistoryClipboard[]>(`SELECT * FROM history_clipboard  ${searchKey} order by create_time desc`)
}

export async function queryHistoryClipboardType(): Promise<HistoryClipboard[]> {
  return DatabaseManager.db.all<HistoryClipboard[]>(`SELECT t1.type, t1.content
FROM history_clipboard t1
         JOIN (
    SELECT type, MAX(create_time) AS max_created_at
    FROM history_clipboard
    GROUP BY type
) t2 ON t1.type = t2.type AND t1.create_time = t2.max_created_at;`)
}


export async function sendData(key?: string){
  let historyClipboards = await queryAll(key);
  if (!Context.mainWindow.isDestroyed()){
    Context.mainWindow.webContents.send(Context.HISTORY_CLIPBOARD_LIST,historyClipboards);
  }
}
