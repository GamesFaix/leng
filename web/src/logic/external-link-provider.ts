import { ExternalLinkProvider } from "leng-core/src/logic/interfaces";

export const externalLinkProvider: ExternalLinkProvider = {
  openLink: (url) => window.open(url, "_blank", "noreferrer"),
};
