import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import axios from "axios";
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

  async function getTailwindCssData() {
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/Devzstudio/tailwind_to_css/main/cheatsheet.ts",
      );
      const tailwindCssData = JSON.parse(
        response.data.slice(
          response.data.indexOf("["),
          response.data.lastIndexOf("]") + 1,
        ),
      );

      return tailwindCssData;
    } catch (err) {
      console.error(err);
    }
  }

  function getCssFiles(directoryPath) {
    const cssFiles = [];
    const ignoredFiles = [
      "node_modules",
      "build",
      "dist",
      "out",
      ".DS_Store",
      ".map",
      ".md",
      ".json",
      ".png",
      ".jpeg",
      ".jpg",
      ".gif",
    ];

    function traverseDirectory(currentPath) {
      const entries = readdirSync(currentPath);

      entries.forEach(entry => {
        if (ignoredFiles.includes(entry)) {
          return;
        }

        const entryPath = path.join(currentPath, entry);
        const stats = statSync(entryPath);

        if (stats.isDirectory()) {
          traverseDirectory(entryPath);
        } else if (stats.isFile()) {
          const fileContents = readFileSync(entryPath, { encoding: "utf8" });

          if (
            fileContents.includes("className") ||
            fileContents.includes("class")
          ) {
            cssFiles.push({ path: entryPath, content: fileContents });
          }
        }
      });
    }

    traverseDirectory(directoryPath);

    return cssFiles;
  }

  function getClassContent(content) {
    if (content.includes("className")) {
      return content.slice(content.indexOf("className"));
    } else if (content.includes("class")) {
      return content.slice(content.indexOf("class"));
    }

    return "";
  }

  function extractClasses(classContent) {
    const classes = [];
    const quoteType = classContent.includes('"') ? '"' : "'";
    const startIndex = classContent.indexOf(quoteType);
    const endIndex = classContent.lastIndexOf(quoteType);

    if (startIndex !== -1 && endIndex !== -1) {
      const classNames = classContent
        .slice(startIndex + 1, endIndex)
        .split(" ");
      classes.push(...classNames);
    }

    return classes;
  }

  function getTailwindCssClasses(cssFiles) {
    const tailwindCssClasses = [];

    cssFiles.forEach(file => {
      const fileContent = file.content.replace(/\n/g, "").match(/<([^>]*)>/g);

      fileContent.forEach(content => {
        const classContent = getClassContent(content);
        const classes = extractClasses(classContent);

        tailwindCssClasses.push(...classes);
      });
    });

    return [...new Set(tailwindCssClasses)];
  }

  function compareCssClasses(tailwindCssData, cssClass) {
    const cssProperties = [];

    tailwindCssData.forEach(element => {
      element.content.forEach(content => {
        content.table.forEach(list => {
          const regex = /--(.*?)-/g;

          if (cssClass.includes(list[0])) {
            const properties = list[1].split("\n");

            for (let i = 0; i < properties.length; i++) {
              const property = properties[i].split(":")[0];

              if (!regex.test(property)) {
                cssProperties.push(property);
              }
            }
          } else if (cssClass.includes(list[1])) {
            const properties = list[2].split("\n");

            for (let i = 0; i < properties.length; i++) {
              const property = properties[i].split(":")[0];

              if (!regex.test(property)) {
                cssProperties.push(property);
              }
            }
          }
        });
      });
    });

    return [...cssProperties];
  }

  function getHoverClass(cssClass) {
    return cssClass
      .replaceAll("\n", " ")
      .split(" ")
      .filter(i => i.startsWith("hover:"))
      .map(i => i.replace("hover:", ""));
  }

  function getCssProperties(tailwindCssData, tailwindCssClasses) {
    const cssProperties = [];
    const exceptionalSupportedTailwindCssClasses = {
      pt: "padding-top",
      pb: "padding-bottom",
      pl: "padding-left",
      pr: "padding-right",
      p: "padding",
      mb: "margin-bottom",
      m: "margin",
      mt: "margin-top",
      ml: "margin-left",
      mr: "margin-right",
      w: "width",
      h: "height",
      top: "top",
      bottom: "bottom",
      left: "left",
      right: "right",
      bg: "background",
      border: "border-color",
      text: "color",
      aspect: "aspect-ratio",
      color: "color",
      "max-w": "max-width",
      "max-h": "max-height",
    };

    tailwindCssClasses.forEach(cssClass => {
      cssProperties.push(...compareCssClasses(tailwindCssData, cssClass));
      if (cssClass.includes("hover")) {
        const hoverClass = getHoverClass(cssClass);

        cssProperties.push(
          ...compareCssClasses(tailwindCssData, hoverClass[0]),
        );
      }
    });

    const exceptionalClasses = tailwindCssClasses.filter(className =>
      className.includes("["),
    );

    if (exceptionalClasses) {
      exceptionalClasses.forEach(className => {
        const property = className.split("-[")[0].replace(".", "");

        if (exceptionalSupportedTailwindCssClasses[property]) {
          cssProperties.push(exceptionalSupportedTailwindCssClasses[property]);
        }
      });
    }

    return [...new Set(cssProperties)];
  }

  ipcMain.handle(
    "get-tailwind-css-properties",
    async (event, directoryPath) => {
      try {
        const tailwindCssData = await getTailwindCssData();
        const cssFiles = getCssFiles(directoryPath);
        const tailwindCssClasses = getTailwindCssClasses(cssFiles);
        const cssProperties = getCssProperties(
          tailwindCssData,
          tailwindCssClasses,
        );

        return cssProperties;
      } catch (err) {
        console.error(err);
      }
    },
  );

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
