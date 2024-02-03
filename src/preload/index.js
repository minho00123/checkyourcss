import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("loadProjectAPI", {
      openDirectory: () => ipcRenderer.invoke("open-directory"),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
}
