import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import axios from "axios";

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "Check Your CSS",
    width: 1280,
    height: 720,
    minWidth: 900,
    minHeight: 670,
    center: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  ipcMain.handle("get-data", async () => {
    const response = await axios.get(
      "https://raw.githubusercontent.com/Fyrd/caniuse/main/fulldata-json/data-2.0.json",
    );

    return response.data;
  });

  ipcMain.handle("open-directory", async (event, args) => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    const directoryPath = filePaths[0];

    return directoryPath;
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
