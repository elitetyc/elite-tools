import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@main": resolve(__dirname,"src/main"),
        "@renderer": resolve(__dirname,"src/renderer/src"),
        "@": resolve(__dirname, 'src')
      }
    },
    plugins: [
      vue()
    ],
    build: {
      rollupOptions: {
        external: ["electron", "@electron/remote"] // 将 Electron 和 @electron/remote 排除在外
      }
    }
  }
});
