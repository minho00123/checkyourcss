import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("fullCssDataAPI", {
      getFullCssData: () => ipcRenderer.invoke("get-data"),
    });
    contextBridge.exposeInMainWorld("loadProjectAPI", {
      openDirectory: () => ipcRenderer.invoke("open-directory"),
      openFiles: propertyInfo => ipcRenderer.invoke("open-files", propertyInfo),
    });
    contextBridge.exposeInMainWorld("userCssDataAPI", {
      getTailwindCssData: projectPath =>
        ipcRenderer.invoke("get-tailwind-css-properties", projectPath),
      getStyledComponentsData: projectPath =>
        ipcRenderer.invoke("get-styled-components-css-properties", projectPath),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
}
