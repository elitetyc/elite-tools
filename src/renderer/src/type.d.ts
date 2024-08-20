import { mainEventInter } from '../../type/contextType'
interface Api {
  mainEvent: mainEventInter
}

interface Electron {
  ipcRenderer: object
}

declare global {
  interface window {
    api: Api
    electron: Electron
  }
}
