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

  function getFiles(directoryPath) {
    const files = {};
    const ignoredFiles = [
      "node_modules",
      "build",
      "dist",
      "out",
      ".DS_Store",
      "package.json",
      "package-lock.json",
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
          files[entryPath] = readFileSync(entryPath, { encoding: "utf8" });
        }
      });
    }

    traverseDirectory(directoryPath);

    return files;
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
    const tailwindCssClasses = [];
    const quoteType = classContent.includes('"') ? '"' : "'";
    const startIndex = classContent.indexOf(quoteType);
    const endIndex = classContent.lastIndexOf(quoteType);
    if (startIndex !== -1 && endIndex !== -1) {
      const classNames = classContent
        .slice(startIndex + 1, endIndex)
        .split(" ");
      tailwindCssClasses.push(...classNames);
    }

    return tailwindCssClasses;
  }

  function getTailwindCssClasses(files) {
    const tailwindCssInfo = [];

    for (const filePath in files) {
      if (
        files[filePath].includes("className") ||
        files[filePath].includes("class")
      ) {
        const fileContent = files[filePath]
          .replace(/\n/g, "")
          .match(/<([^>]*)>/g);
        const tailwindClasses = [];

        fileContent.forEach(content => {
          const classContent = getClassContent(content);
          const tailwindCssClasses = extractClasses(classContent);

          tailwindClasses.push(...tailwindCssClasses);
        });

        tailwindCssInfo.push({
          filePath,
          content: files[filePath],
          tailwindClasses: [...new Set(tailwindClasses)],
        });
      }
    }

    return tailwindCssInfo;
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

  function getCssProperties(tailwindCssData, tailwindCssInfo) {
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

    tailwindCssInfo.forEach(info => {
      info.cssMatching = {};

      info.tailwindClasses.forEach(tailwindClass => {
        const cssClasses = [
          ...new Set(compareCssClasses(tailwindCssData, tailwindClass)),
        ];

        cssClasses.forEach(cssClass => {
          if (Object.keys(info.cssMatching).includes(cssClass)) {
            info.cssMatching[cssClass].push(tailwindClass);
          } else {
            info.cssMatching[cssClass] = [];
            info.cssMatching[cssClass].push(tailwindClass);
          }
        });

        if (tailwindClass.includes("hover")) {
          const hoverClass = getHoverClass(tailwindClass);
          const cssClasses = [
            ...new Set(compareCssClasses(tailwindCssData, hoverClass[0])),
          ];

          cssClasses.forEach(cssClass => {
            if (Object.keys(info.cssMatching).includes(cssClass)) {
              info.cssMatching[cssClass].push(tailwindClass);
            } else {
              info.cssMatching[cssClass] = [];
              info.cssMatching[cssClass].push(tailwindClass);
            }
          });
        }
      });

      const exceptionalClasses = info.tailwindClasses.filter(className =>
        className.includes("["),
      );

      if (exceptionalClasses) {
        exceptionalClasses.forEach(className => {
          const property = className.split("-[")[0].replace(".", "");

          if (
            Object.keys(info.cssMatching).includes(
              exceptionalSupportedTailwindCssClasses[property],
            )
          ) {
            info.cssMatching[
              exceptionalSupportedTailwindCssClasses[property]
            ].push(className);
          } else {
            info.cssMatching[exceptionalSupportedTailwindCssClasses[property]] =
              [];
            info.cssMatching[
              exceptionalSupportedTailwindCssClasses[property]
            ].push(className);
          }
        });
      }
    });
  }

  ipcMain.handle(
    "get-tailwind-css-properties",
    async (event, directoryPath) => {
      const tailwindCssData = await getTailwindCssData();
      const files = getFiles(directoryPath);
      const tailwindCssInfo = getTailwindCssClasses(files);

      getCssProperties(tailwindCssData, tailwindCssInfo);

      return tailwindCssInfo;
    },
  );

  function getStyledComponentsAlias(files) {
    const styledComponentsInfo = [];

    for (const filePath in files) {
      if (files[filePath].includes("styled-components")) {
        const fileSplits = files[filePath].split("\n");
        const regex = /from ['"]styled-components['"];/g;
        const index = fileSplits.findIndex(line => line.match(regex));

        const alias = fileSplits[index]
          .replace(/["']styled-components["']|;|{|}|import|require|from/g, "")
          .trim();

        styledComponentsInfo.push({
          alias,
          filePath,
          fileContent: files[filePath],
        });
      }
    }

    return styledComponentsInfo;
  }

  function getUserCss(styledComponentsInfo) {
    const userCss = [];

    styledComponentsInfo.forEach(info => {
      const fileContent = info.fileContent.split("\n");
      let isStart = false;

      fileContent.forEach(content => {
        if (content.includes("import") || content.includes("require")) {
          return;
        } else if (content.includes(info.alias)) {
          isStart = true;
        } else if (isStart && content.includes(":") && content.includes(";")) {
          userCss.push(content.split(":")[0].trim());
        } else if (content.includes("`")) {
          isStart = false;
        }
      });

      info.cssProperties = [...new Set(userCss)];
    });
  }

  ipcMain.handle(
    "get-styled-components-css-properties",
    (event, directoryPath) => {
      const files = getFiles(directoryPath);
      const styledComponentsInfo = getStyledComponentsAlias(files);
      getUserCss(styledComponentsInfo);

      return styledComponentsInfo;
    },
  );

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
