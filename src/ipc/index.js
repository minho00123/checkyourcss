import { dialog } from "electron";

export async function getDirectory(event, args) {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  const directoryPath = filePaths[0];
  return directoryPath;
}
