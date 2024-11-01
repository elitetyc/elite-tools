import { clipboard, nativeImage, dialog } from "electron";
import { Context } from "../../ipc/context";
import * as historyClipboard from "./dao";
import Util from "../../util";
import { HistoryClipboard, HistoryClipboardType } from "./dao";
import * as fs from "node:fs";
import { RunResult } from "sqlite3";


let lastClipboardInfoTxtMd5 = "";
let lastClipboardInfoImgMd5 = "";
let lastClipboardInfoFileMd5 = "";

let isFirstStartApp = true;

let newClearHistoryClipboardIntervalId: NodeJS.Timeout;

export function init() {
  setInterval(() => {
    if (Context.dbInitSuccess) {
      listenText();
      listenImg();
      listenFile();
    }
  }, 1000);

  clearHistoryClipboard();

  // 监听输入数据变化
  Context.ipcMain.on(Context.historyClipBoarEvent.CLIPBOARD_SEARCH_INPUT_CHANGE, (_, input) => {
    if (isFirstStartApp) {
      doClearHistoryClipboard()
      isFirstStartApp = false
    }
    historyClipboard.sendData(input);
  });

  // 监听点击某个item
  Context.ipcMain.on(Context.historyClipBoarEvent.CLIPBOARD_ITEM_CLICK, (_, input) => {
    const clipBoard: historyClipboard.HistoryClipboard = JSON.parse(input);
    // 更新时间，让其靠前
    historyClipboard.updateOne(clipBoard, (err) => {
      if (err) Context.logger.error(err);
    });
    // 将内容设置到剪切版
    let hasError = false;
    switch (clipBoard.type) {
      case HistoryClipboardType.text:
        clipboard.writeText(clipBoard.content);
        break;
      case HistoryClipboardType.img:
        clipboard.writeImage(nativeImage.createFromDataURL(clipBoard.content));
        break;
      case HistoryClipboardType.file:
        hasError = writeFileBuffer(clipBoard.content);
        break;
      default:
        break;
    }
    if (!hasError) {
      // 关闭弹出
      Context.isCopy = true
      Context.historyClipBoardWindow.hide();

    }
  });
}

// 每10分钟检测一次
function clearHistoryClipboard() {
  if (newClearHistoryClipboardIntervalId) {
    clearInterval(newClearHistoryClipboardIntervalId);
  }
  newClearHistoryClipboardIntervalId = setInterval(doClearHistoryClipboard, 10 * 60 * 1000);
}

function doClearHistoryClipboard() {
  const currentTime = new Date();
  const date = new Date(currentTime.getTime() - Context.CLIPBOARD_KEEP_HOUR * 60 * 60 * 1000);
  historyClipboard.deleteByTime(date, (err) => {
    if (err) Context.logger.error(err);
  });
}

function listenText() {
  const text = clipboard.readText().trim();
  const md5 = Util.md5Encode(text);
  if (text && lastClipboardInfoTxtMd5 !== md5) {
    // 有值，并且不相等，说明剪切板内容变化
    insertOneProxy(
      new historyClipboard.HistoryClipboard(
        -1,
        historyClipboard.HistoryClipboardType.text,
        text,
        md5,
        new Date()
      ),
      (err) => {
        if (err) Context.logger.error(err);
        historyClipboard.sendData();
        lastClipboardInfoTxtMd5 = md5;
      }
    );
  }
}

function writeFileBuffer(filePath) {
  let newPath = filePath;
  let format = "FileNameW";
  if (Context.isMac) {
    format = "public.file-url";
    newPath = `file://${filePath}`;
  }
  if (!fs.existsSync(filePath)) {
    dialog
      .showMessageBox(Context.historyClipBoardWindow, {
        type: "error",
        title: "错误",
        message: "文件不存在",
        buttons: ["OK"]
      })
      .then((result) => {
        Context.logger.info("User clicked:", result.response);
      })
      .catch((err) => {
        Context.logger.error("Error displaying message box:", err);
      });
    return true;
  }
  clipboard.writeBuffer(format, Buffer.from(newPath));
  return false;
}

function listenFile() {
  let format = "public.file-url";
  if (Context.isWin) {
    format = "FileNameW";
  }
  const filePathBuf = clipboard.readBuffer(format);
  if (filePathBuf && filePathBuf.length > 0) {
    let filePath = filePathBuf.toString();
    if (Context.isMac) {
      filePath = filePath.replace("file://", "");
    }
    // 转码，防止出现文件名包含特殊字符被转码，找不到文件的问题
    filePath = decodeURIComponent(filePath)
    const md5 = Util.md5Encode(filePath);
    if (md5 !== lastClipboardInfoFileMd5) {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        // 推送到数据库
        insertOneProxy(
          new historyClipboard.HistoryClipboard(
            -1,
            historyClipboard.HistoryClipboardType.file,
            filePath,
            md5,
            new Date()
          ),
          (err) => {
            if (err) Context.logger.error(err);
            historyClipboard.sendData();
            lastClipboardInfoFileMd5 = md5;
          }
        );
      } else if (stats.isDirectory()) {
        // 不处理
      } else {
        Context.logger.error("未知路径类型，", filePath, stats);
      }
    }
  }
}

function listenImg() {
  const img = clipboard.readImage();
  if (!img.isEmpty()) {
    const url = img.toDataURL();
    const md5 = Util.md5Encode(url);
    if (md5 !== lastClipboardInfoImgMd5) {
      // 推送到数据库
      insertOneProxy(
        new historyClipboard.HistoryClipboard(
          -1,
          historyClipboard.HistoryClipboardType.img,
          url,
          md5,
          new Date()
        ),
        (err) => {
          if (err) Context.logger.error(err);
          historyClipboard.sendData();
          lastClipboardInfoImgMd5 = md5;
        }
      );
    }
  }
}

function insertOneProxy(
  history_clipboard: HistoryClipboard,
  callBack: (this: RunResult, err: Error | null) => void
) {
  historyClipboard.queryByMd5(history_clipboard.md5, (err, row) => {
    if (err) Context.logger.error(err);
    if (row && row.id) {
      // 有数据了，更新
      row.create_time = history_clipboard.create_time;
      historyClipboard.updateOne(row, callBack);
    } else {
      // 没有数据insert
      historyClipboard.insertOne(history_clipboard, callBack);
    }
  });
}
