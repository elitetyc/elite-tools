import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import * as historyClipboard from "./db/history-clipboard";
class DatabaseManager{
  public static db: Database

  constructor(private dbFilePath: string) {}

  async connect(): Promise<Database> {
    return  open({
      filename: this.dbFilePath,
      driver: sqlite3.Database
    })
  }
  initTables(){
    // 历史剪切板
    historyClipboard.initTable()
  }
  public init(){
    this.connect().then(db => {
      DatabaseManager.db = db
      this.initTables()
    })
  }


}

export default DatabaseManager;
