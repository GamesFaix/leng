import { Language, CardFinish } from "../encyclopedia";

export type FileBoxCard = {
  scryfallId: string;
  name: string;
  setAbbrev: string;
  collectorsNumber: string;
  lang: Language | null;
  foil: boolean;
  finish: CardFinish;
  count: number;
};

export type FileBox = {
  name: string;
  lastModified: Date;
  description: string;
  cards: FileBoxCard[];
};

export type Inventory = {
  boxes: FileBox[];
};

export const defaultInventory: Inventory = {
  boxes: [],
};
