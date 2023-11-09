import { AppSettings } from "leng-core/src/domain/config";
import { SettingsProvider } from "leng-core/src/domain/interfaces";

const defaultSettings = {
  dataPath: "",
};

const load = () => {
  try {
    const json = localStorage.getItem("settings")!;
    return JSON.parse(json);
  } catch {
    const json = JSON.stringify(defaultSettings);
    localStorage.setItem("settings", json);
    return defaultSettings;
  }
};

const save = (settings: AppSettings) => {
  const json = JSON.stringify(settings);
  localStorage.setItem("settings", json);
};

export const settingsProvider: SettingsProvider = {
  load,
  save,
};
