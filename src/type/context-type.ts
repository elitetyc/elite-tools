export interface MainEvent {
  CLIPBOARD_CONFIG_LIST: string
  GET_CLIPBOARD_CONFIG_LIST: string
  HOT_KEY_SETTING_CHANGE: string
  MAXSIZE_OR_MINSIZE_WINDOW: string
  MIN_WINDOW: string
  HIDE_WINDOW: string
}

export interface HistoryClipBoarEvent{
  HISTORY_CLIPBOARD_LIST: string
  CLIPBOARD_SEARCH_INPUT_CHANGE: string
  CLIPBOARD_ITEM_CLICK: string
}
