import { clipboard, nativeImage } from "electron";
import { Context } from "../../ipc/context";
import * as historyClipboard from "./dao";
import Util from "../../util";
import { HistoryClipboardType } from "./dao";

let lastClipboardInfoTxt = "";
let lastClipboardInfoImg = "";
let lastClickItemMd5 = "";

let newClearHistoryClipboardIntervalId: NodeJS.Timeout;

export function init() {
  historyClipboard.queryHistoryClipboardType((err, res) => {
    if (err) console.log(err)
    // 将查回来的数据，更新到具体的值
    for (const el of res) {
      switch (String(el.type)) {
        case HistoryClipboardType.text:
          lastClipboardInfoTxt = el.content
          break
        case HistoryClipboardType.img:
          lastClipboardInfoImg = el.content
          break
        default:
          break
      }
    }

    setInterval(() => {
      listenText();
      listenImg();
    }, 1000);

    clearHistoryClipboard();

    // 监听输入数据变化
    Context.ipcMain.on(Context.CLIPBOARD_SEARCH_INPUT_CHANGE, (_, input) => {
      historyClipboard.sendData(input);
    });

    // 监听点击某个item
    Context.ipcMain.on(Context.CLIPBOARD_ITEM_CLICK, (_, input) => {
      const clipBoard: historyClipboard.HistoryClipboard = JSON.parse(input);
      // 更新时间，让其靠前
      historyClipboard.updateOne(clipBoard, (err) => {
        if (err) console.log(err);
      });
      // 设置最新一次设置的数据的md5值，防止
      lastClickItemMd5 = Util.md5Encode(clipBoard.content);
      // 将内容设置到剪切版
      switch (String(clipBoard.type)) {
        case HistoryClipboardType.text:
          clipboard.writeText(clipBoard.content);
          break;
        case HistoryClipboardType.img:
          clipboard.writeImage(nativeImage.createFromDataURL(clipBoard.content));
          break;
        default:
          break;
      }
      // 关闭弹出
      Context.historyClipBoardWindow.hide();

    });

  });
}


// 每10分钟检测一次
function clearHistoryClipboard() {
  if (newClearHistoryClipboardIntervalId) {
    clearInterval(newClearHistoryClipboardIntervalId);
  }
  newClearHistoryClipboardIntervalId = setInterval(() => {
    const currentTime = new Date();
    const date = new Date(currentTime.getTime() - Context.CLIPBOARD_KEEP_HOUR * 60 * 60 * 1000);
    historyClipboard.deleteByTime(date, (err) => {
      if (err) console.log(err);
    });
  }, 10 * 60 * 1000);
}

function listenText() {
  const text = clipboard.readText();
  if (text && lastClipboardInfoTxt !== text
    && Util.md5Encode(text) !== lastClickItemMd5) {
    // 有值，并且不相等，说明剪切板内容变化
    historyClipboard.insertOne(new historyClipboard.HistoryClipboard(
      -1, historyClipboard.HistoryClipboardType.text, text, new Date()
    ), (err) => {
      if (err) console.log(err);
      historyClipboard.sendData();
      lastClipboardInfoTxt = text;

    });
  }
}

function listenImg() {
  const img = clipboard.readImage();
  if (img) {
    const url = img.toDataURL();
    if (url !== lastClipboardInfoImg &&
      Util.md5Encode(url) !== lastClickItemMd5) {
      // 推送到数据库
      historyClipboard.insertOne(new historyClipboard.HistoryClipboard(
        -1, historyClipboard.HistoryClipboardType.img, url, new Date()
      ), (err) => {
        if (err) console.log(err);
        historyClipboard.sendData();
        lastClipboardInfoImg = url;
      });
    }
  }
}
