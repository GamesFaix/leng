import { ImageDownloader } from "leng-core/src/domain/interfaces";

// The browser will cache the images for us, just return so the saga marks the images as downloaded.
export const imageDownloader: ImageDownloader = {
  downloadCardImage: async (_, __) => { return; },
  downloadSetSymbol: async (_, __) => { return; },
};
