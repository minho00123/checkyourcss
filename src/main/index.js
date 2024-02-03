import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import axios from "axios";
import { execSync } from "child_process";
import { readdirSync, statSync, readFileSync } from "fs";

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

  ipcMain.handle("get-utility-first-css-properties", (event, args) => {
    const directoryPath = args;

    execSync("npm run build", { cwd: directoryPath });

    const buildFolderPath = findBuildFolder(directoryPath);
    const cssStrings = getBuildCssStrings(buildFolderPath);
    const projectCssProperties = extractCssProperties(cssStrings);

    return projectCssProperties;
  });

  function findBuildFolder(directoryPath) {
    const foldersAndFiles = readdirSync(directoryPath);
    const buildFolder = foldersAndFiles
      .filter(entry => ["build", "out", "dist"].includes(entry))
      .map(folder => path.join(directoryPath, folder))[0];

    return buildFolder;
  }

  function getBuildCssStrings(buildFolderPath) {
    const cssFile = [];
    function getCSSFile(buildFolderPath) {
      const files = readdirSync(buildFolderPath);

      files.forEach(file => {
        const filePath = path.join(buildFolderPath, file);
        const stats = statSync(filePath);

        if (stats.isFile() && file.endsWith(".css")) {
          cssFile.push(readFileSync(filePath, { encoding: "utf8" }));
        } else if (stats.isDirectory()) {
          getCSSFile(filePath);
        }
      });
    }

    getCSSFile(buildFolderPath);
    return cssFile[0].split(" }.");
  }

  function extractCssProperties(cssStrings) {
    const buildCssStrings = cssStrings[1].split(/[;{}]/);
    return [
      ...new Set(
        buildCssStrings
          .filter(cssString => cssString.includes(":"))
          .map(cssString => cssString.slice(0, cssString.indexOf(":")))
          .filter(
            property => !property.includes("--tw-") && !property.includes("."),
          ),
      ),
    ];
  }

  ipcMain.handle("get-styled-component-css-properties", (event, args) => {
    const directoryPath = args;
    const info = {};

    function getAllFiles(directoryPath) {
      const files = readdirSync(directoryPath);

      files.forEach(file => {
        if (
          file === "node_modules" ||
          file.includes(".map") ||
          file.endsWith(".md") ||
          file.endsWith(".json")
        ) {
          return;
        }

        const fullPath = path.join(directoryPath, file);
        const stats = statSync(fullPath);

        if (stats.isFile()) {
          info[fullPath] = readFileSync(fullPath, { encoding: "utf8" });
        } else if (stats.isDirectory()) {
          getAllFiles(fullPath);
        }
      });
    }

    function getAliasAndContentInfo() {
      const aliasAndContentInfo = [];

      for (const filePath in info) {
        if (info[filePath].includes("styled-components")) {
          const fileSplits = info[filePath].split("\n");
          let index = fileSplits.findIndex(line =>
            line.includes('from "styled-components";'),
          );

          const alias = fileSplits[index]
            .replace(
              /"styled-components"|;|import|{|}|require|import|const|let|var|=|from/g,
              "",
            )
            .trim();

          aliasAndContentInfo.push({
            alias,
            filePath,
            fileContent: info[filePath],
          });
        }
      }

      return aliasAndContentInfo;
    }

    function getUserCssStrings(file) {
      const userCss = [];
      const cssStrings = file.fileContent.split("\n");
      let isStart = false;

      cssStrings.forEach(cssString => {
        if (cssString.includes("import") || cssString.includes("require")) {
          return;
        } else if (cssString.includes(file.alias)) {
          isStart = true;
        } else if (
          isStart &&
          cssString.includes(":") &&
          cssString.includes(";")
        ) {
          userCss.push(cssString.split(":")[0].trim());
        } else if (cssString.includes("`;")) {
          isStart = false;
        }
      });

      return userCss;
    }

    getAllFiles(directoryPath);

    const aliasAndContentInfo = getAliasAndContentInfo();
    const userCss = aliasAndContentInfo.flatMap(file =>
      getUserCssStrings(file),
    );
    const finalCss = [...new Set(userCss)];

    return finalCss;
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
