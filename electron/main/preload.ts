import { contextBridge, ipcRenderer } from "electron"
import type { Config } from "./type"

contextBridge.exposeInMainWorld("ipc", {
  getConfig: () => ipcRenderer.invoke("getConfig"),
  saveConfig: (config: Config) => ipcRenderer.invoke("saveConfig", config)
})
