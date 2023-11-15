import { FormatProvider } from "leng-core/src/domain/interfaces";
import { AppSettings } from "leng-core/src/domain/config";
import { existsSync, promises } from "fs";
import { FormatGroup } from "leng-core/src/domain/formats";
import { resolve } from 'path';

export const formatProvider: FormatProvider = {
  getFormats: async (settings: AppSettings) => {
    const path = `${settings.dataPath}/encyclopedia/formats.json`;
    console.log(path);
    if (!existsSync(path)) {
      console.log("copying default formats");
      try {
        const defaultPath = resolve(__dirname, 'data/formats.json');
        console.log(defaultPath);
        await promises.copyFile(defaultPath, path);
      }
      catch (ex) {
        console.error(ex)
        throw ex;
      }
    }
    const buffer = await promises.readFile(path);
    const json = buffer.toString();
    const result: FormatGroup[] = JSON.parse(json);
    return result;
  },
};
