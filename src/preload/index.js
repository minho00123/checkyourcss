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
    contextBridge.exposeInMainWorld("userCssDataAPI", {
      getUserTailwindCssData: projectPath =>
        ipcRenderer.invoke("get-tailwind-css-properties", projectPath),
      getUserCssDataStyled: projectPath =>
        ipcRenderer.invoke("get-styled-component-css-properties", projectPath),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
}
