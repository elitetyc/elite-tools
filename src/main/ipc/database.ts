import { Database } from "sqlite3";
import * as historyClipboard from "../pages/history-clipboard/dao";
import { Context } from "./context";
import * as globalShortcutConfig  from "../hotkey/dao";
class DatabaseManager{
  public static db: Database

  constructor(private dbFilePath: string) {}

  connect(){
    DatabaseManager.db = new Database(this.dbFilePath)
  }
  initTables(){
    // 历史剪切板
    Promise.all<boolean>([
      ...historyClipboard.initTable(),
      ...globalShortcutConfig.initTable()
    ])
      .then(()=>{
        console.log("数据库初始化，处理成功")
        // 所有的都成功了，
        Context.dbInitSuccess = true
      }).catch((err)=>{
        console.log(err)
    })
  }
  public init(){
    this.connect()
    this.initTables()
  }


}

export default DatabaseManager;
