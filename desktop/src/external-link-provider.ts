import { ExternalLinkProvider } from "leng-core/src/logic/interfaces";
import { shell } from "electron";

export const externalLinkProvider: ExternalLinkProvider = {
  openLink: (url) => shell.openExternal(url),
};
