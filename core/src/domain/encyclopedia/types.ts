import { Card, Set } from "scryfall-api";

export { Card, Set, Color, Legalities } from "scryfall-api";

export type SetIndex = {
  [abbrev: string]: Set;
};

export type CardIndex = {
  [id: string]: Card;
};

export type SetGroup = {
  parent: Set;
  children: Set[];
};

export enum Language {
  English = "English",
  ChineseSimplified = "ChineseSimplified",
  ChineseTraditional = "ChineseTraditional",
  French = "French",
  German = "German",
  Italian = "Italian",
  Japanese = "Japanese",
  Korean = "Korean",
  Portuguese = "Portuguese",
  Russian = "Russian",
  Spanish = "Spanish",
}

export const AllLanguages = [
  Language.English,
  Language.ChineseSimplified,
  Language.ChineseTraditional,
  Language.French,
  Language.German,
  Language.Italian,
  Language.Japanese,
  Language.Korean,
  Language.Portuguese,
  Language.Russian,
  Language.Spanish,
];

export enum CardFinish {
  Normal = "nonfoil",
  Foil = "foil",
  Etched = "etched",
  Glossy = "glossy",
}

export const basicLandNames = [
  "Forest",
  "Island",
  "Mountain",
  "Plains",
  "Swamp",
  "Snow-Covered Forest",
  "Snow-Covered Island",
  "Snow-Covered Mountain",
  "Snow-Covered Plains",
  "Snow-Covered Swamp",
];
