import { ExternalLinkProvider } from "leng-core/src/domain/interfaces";

export const externalLinkProvider: ExternalLinkProvider = {
  openLink: (url) => window.open(url, "_blank", "noreferrer"),
};
