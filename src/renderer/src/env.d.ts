/// <reference types="vite/client" />

import { ElectronAPI } from "@electron-toolkit/preload";
import { remote } from "electron";
import { Api } from "@/type/context-type";

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
    remote: remote
  }
}
