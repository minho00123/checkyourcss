import os from "os";
import fs from "fs";
import axios from "axios";
import postcss from "postcss";
import traverse from "@babel/traverse";
import path, { join } from "path";
import { parse } from "@babel/parser";
import { execSync } from "child_process";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";

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

  function copyFiles(sourceDir, targetDir) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      if (
        [
          "node_modules",
          ".DS_Store",
          ".git",
          ".github",
          "dist",
          "build",
          "out",
        ].includes(entry.name)
      ) {
        continue;
      }

      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        copyFiles(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }

  function findBuildDirectory(directoryPath) {
    const entries = fs.readdirSync(directoryPath);
    const buildDirectory = entries.find(entry =>
      ["build", "out", "dist"].includes(entry),
    );

    return path.join(directoryPath, buildDirectory);
  }

  function traverseDirectory(directoryPath, checkCssFile) {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        traverseDirectory(fullPath, checkCssFile);
      } else {
        checkCssFile(fullPath);
      }
    }
  }

  function getCssFilePath(directoryPath) {
    let cssFilePath = "";

    traverseDirectory(directoryPath, filePath => {
      if (filePath.endsWith(".css")) {
        cssFilePath = filePath;
      }
    });

    return cssFilePath;
  }

  async function getTailwindCssProperties() {
    const tempDir = path.join(os.tmpdir(), "build-folder");

    copyFiles(process.cwd(), tempDir);
    process.chdir(tempDir);
    execSync("npm install; npm run build");

    const buildDirectoryPath = findBuildDirectory(process.cwd());
    const cssFilePath = getCssFilePath(buildDirectoryPath);
    const css = fs.readFileSync(cssFilePath, "utf8");

    try {
      const result = await postcss().process(css, { from: cssFilePath });
      const cssProperties = [];
      const root = result.root;

      root.walkDecls(decl => {
        if (decl.parent.selector.startsWith(".")) {
          cssProperties.push({ [decl.prop]: decl.parent.selector });
        }
      });

      return cssProperties;
    } catch (err) {
      console.error(err);
    }
  }

  function parseFileToAST(filePath) {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    return parse(fileContent, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript"],
    });
  }

  function extractTailwindClasses(filePath) {
    const ast = parseFileToAST(filePath);
    const tailwindClasses = new Set();

    traverse(ast, {
      JSXAttribute({ node }) {
        if (node.name.name === "className") {
          if (node.value.type === "StringLiteral") {
            node.value.value
              .split(" ")
              .forEach(className => tailwindClasses.add(className));
          } else if (
            node.value.type === "JSXExpressionContainer" &&
            node.value.expression.type === "StringLiteral"
          ) {
            node.value.expression.value
              .split(" ")
              .forEach(className => tailwindClasses.add(className));
          }
        }
      },
    });

    return [...tailwindClasses];
  }

  function extractTailwindClassesFromDirectory(
    directoryPath,
    pathAndTailwindClasses,
  ) {
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
        if (!filePath.includes("node_modules")) {
          const tailwindClasses = extractTailwindClasses(filePath);

          if (tailwindClasses.length > 0) {
            pathAndTailwindClasses.push({
              filePath: filePath,
              tailwindClasses: [...tailwindClasses],
              content: fs.readFileSync(filePath, "utf8"),
            });
          }
        }
      } else if (stats.isDirectory()) {
        extractTailwindClassesFromDirectory(filePath, pathAndTailwindClasses);
      }
    });

    return pathAndTailwindClasses;
  }

  function createCssInfo(pathAndTailwindClasses, cssPropertiesAndTwInfo) {
    pathAndTailwindClasses.forEach(info => {
      info.cssMatching = {};

      info.tailwindClasses.forEach(tailwindClass => {
        cssPropertiesAndTwInfo.forEach(item => {
          const cssPropertyName = Object.keys(item)[0];
          const cssPropertyValue = item[cssPropertyName].slice(1);

          if (
            cssPropertyValue === tailwindClass &&
            !cssPropertyName.includes("--tw-")
          ) {
            if (info.cssMatching[cssPropertyName]) {
              info.cssMatching[cssPropertyName].push(tailwindClass);
            } else {
              info.cssMatching[cssPropertyName] = [tailwindClass];
            }
          }
        });
      });
    });
  }

  ipcMain.handle(
    "get-tailwind-css-properties",
    async (event, projectDirectory) => {
      const pathAndTailwindClasses = [];
      const cssPropertiesAndTwInfo = await getTailwindCssProperties();

      extractTailwindClassesFromDirectory(
        projectDirectory,
        pathAndTailwindClasses,
      );
      createCssInfo(pathAndTailwindClasses, cssPropertiesAndTwInfo);

      return pathAndTailwindClasses;
    },
  );

  function findStyledVariableNames(fileContents) {
    const ast = parse(fileContents, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript"],
    });
    const imports = [];

    traverse(ast, {
      ImportDeclaration(path) {
        if (path.node.source.value === "styled-components") {
          path.node.specifiers.forEach(specifier => {
            if (specifier.type === "ImportDefaultSpecifier") {
              imports.push(specifier.local.name);
            } else if (specifier.type === "ImportSpecifier") {
              imports.push(specifier.imported.name);
            }
          });
        }
      },
      VariableDeclarator(path) {
        if (
          path.node.init &&
          path.node.init.callee &&
          path.node.init.callee.name === "require" &&
          path.node.init.arguments &&
          path.node.init.arguments.length > 0 &&
          path.node.init.arguments[0].value === "styled-components"
        ) {
          imports.push(path.node.id.name);
        }
      },
    });

    return imports;
  }

  function extractStyledComponentsCSS(fileContents, styledVariableNames) {
    if (!styledVariableNames) {
      return;
    }

    const ast = parse(fileContents, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript"],
    });

    const cssProperties = new Set();

    styledVariableNames.forEach(styledVariableName => {
      traverse(ast, {
        TaggedTemplateExpression(path) {
          const tagPath = path.get("tag");

          if (tagPath.isCallExpression()) {
            const calleeName = tagPath.get("callee").node.name;

            if (styledVariableName.includes(calleeName)) {
              extractCSSProperties(path, cssProperties);
            }
          } else if (
            tagPath.isMemberExpression() &&
            tagPath.get("object").node.name &&
            styledVariableName.includes(tagPath.get("object").node.name)
          ) {
            extractCSSProperties(path, cssProperties);
          } else if (
            tagPath.isIdentifier() &&
            styledVariableName.includes(tagPath.node.name)
          ) {
            extractCSSProperties(path, cssProperties);
          }
        },
      });
    });

    return Array.from(cssProperties);
  }

  function extractCSSProperties(path, cssProperties) {
    path
      .get("quasi")
      .get("quasis")
      .forEach(quasiPath => {
        const cssText = quasiPath.node.value.raw;
        const startLine = quasiPath.node.loc.start.line;
        const regex = /(\w+-?\w+)\s*:/g;
        let match;

        while ((match = regex.exec(cssText))) {
          const property = match[1];
          const lineOffset = calculateLineOffset(
            cssText.substring(0, match.index),
          );
          const propertyLine = startLine + lineOffset;

          cssProperties.add({ property, line: propertyLine });
        }
      });
  }

  function calculateLineOffset(text) {
    return (text.match(/\n/g) || []).length;
  }

  function getStyledComponentsCss(directoryPath, styledComponentsCss) {
    const filesInDirectory = fs.readdirSync(directoryPath);
    for (const file of filesInDirectory) {
      if (
        file === "node_modules" ||
        file === "build" ||
        file === "out" ||
        file === "dist"
      ) {
        continue;
      }

      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      let cssProperties;

      if (stats.isDirectory()) {
        getStyledComponentsCss(filePath, styledComponentsCss);
      } else {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const styledComponentsRegex =
          /from ['"]styled-components(?:\/native)?['"]|require\(['"]styled-components(?:\/native)?['"]\)/;

        if (styledComponentsRegex.test(fileContents)) {
          const styledVariableNames = findStyledVariableNames(fileContents);

          cssProperties = extractStyledComponentsCSS(
            fileContents,
            styledVariableNames,
          );
          cssProperties = cssProperties.map(info => {
            return info.property;
          });
        }

        if (cssProperties && cssProperties.length > 0) {
          styledComponentsCss.push({
            filePath: filePath,
            cssProperties: cssProperties,
            fileContent: fs.readFileSync(filePath, "utf8"),
          });
        }
      }
    }

    return styledComponentsCss;
  }

  ipcMain.handle(
    "get-styled-components-css-properties",
    (event, directoryPath) => {
      const styledComponentsCss = [];

      getStyledComponentsCss(directoryPath, styledComponentsCss);

      return styledComponentsCss;
    },
  );

  ipcMain.handle("open-files", (event, propertyInfo) => {
    const filePaths = [];

    propertyInfo.forEach(info => {
      filePaths.push(info.path);
    });

    const openingPaths = [...new Set(filePaths)];

    openingPaths.forEach(path => {
      execSync(`open ${path}`);
    });
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
