import { Database } from "sqlite3";
import * as historyClipboard from "../pages/history-clipboard/dao";
class DatabaseManager{
  public static db: Database

  constructor(private dbFilePath: string) {}

  connect(){
    DatabaseManager.db = new Database(this.dbFilePath)
  }
  initTables(){
    // 历史剪切板
    historyClipboard.initTable()
  }
  public init(){
    this.connect()
    this.initTables()
  }


}

export default DatabaseManager;
