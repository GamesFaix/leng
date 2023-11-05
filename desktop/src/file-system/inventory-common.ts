import { AppSettings } from "leng-core/src/logic/model";

export const getInventoryDir = (settings: AppSettings): string =>
  `${settings.dataPath}/inventory`;

export const getBoxPath = (settings: AppSettings, name: string): string =>
  `${getInventoryDir(settings)}/${name}.json`;
