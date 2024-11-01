export interface MainEvent {
  HOT_KEY_CONFIG: string;
  GET_HOT_KEY_CONFIG: string;
  HOT_KEY_SETTING_CHANGE: string;
  MAXSIZE_OR_MINSIZE_WINDOW: string;
  MIN_WINDOW: string;
  HIDE_WINDOW: string;
  OPEN_LOG_FILE: string;
}

export interface HistoryClipBoarEvent {
  HISTORY_CLIPBOARD_LIST: string;
  CLIPBOARD_SEARCH_INPUT_CHANGE: string;
  CLIPBOARD_ITEM_CLICK: string;
}

export interface Api {
  mainEvent: MainEvent;
  HistoryClipboardType;
  HotKeyConfigType;
  historyClipBoarEvent: HistoryClipBoarEvent;
  onePasswordEvent:OnePasswordEvent
}

export interface OnePasswordEvent {
  ALL_PASSWORD_GROUP: string;
  GET_ALL_PASSWORD_GROUP: string;
  ALL_PASSWORD_ITEM: string;
  GET_ALL_PASSWORD_ITEM: string;
  ITEM_COPY:string
  ADD_PASSWORD_ITEM:string
  UPDATE_PASSWORD_ITEM:string
  DELETE_PASSWORD_ITEM:string

  ADD_PASSWORD_GROUP:string
  UPDATE_PASSWORD_GROUP:string
  DELETE_PASSWORD_GROUP:string

}
