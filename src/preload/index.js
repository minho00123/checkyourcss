import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("fullCssDataAPI", {
      getFullCssData: () => ipcRenderer.invoke("get-data"),
    });
    contextBridge.exposeInMainWorld("loadProjectAPI", {
      openDirectory: () => ipcRenderer.invoke("open-directory"),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
}
