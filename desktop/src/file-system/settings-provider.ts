import * as fs from "fs";
import { createFileAndDirectoryIfRequired } from "./file-helpers";
import { AppSettings } from "leng-core/src/logic/model";
import { SettingsProvider } from "leng-core/src/logic/interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dir = `${(process.env as any).USERPROFILE.replace("\\", "/")}/leng`;
const settingsPath = `${dir}/settings.json`;

const defaultSettings = {
  dataPath: dir,
};

const load = () => {
  try {
    const json = fs.readFileSync(settingsPath).toString();
    return JSON.parse(json);
  } catch {
    const json = JSON.stringify(defaultSettings);
    createFileAndDirectoryIfRequired(settingsPath, json);
    return defaultSettings;
  }
};

const save = (settings: AppSettings) => {
  const json = JSON.stringify(settings);
  createFileAndDirectoryIfRequired(settingsPath, json);
};

export const settingsProvider: SettingsProvider = {
  load,
  save,
};
