import {
  FrameEffect,
  Color,
  Rarity,
  Layout,
  SetType,
  Legality as ScryfallLegality,
} from "scryfall-api";

export { Color, FrameEffect } from "scryfall-api";

export type Legality = keyof typeof ScryfallLegality
export type Legalities =  Record<string, Legality>;

// Partial scryfall card
export type Card = {
  num: string;
  color_identity: Color[];
  colors?: Color[];
  foil: boolean;
  frame_effects?: (keyof typeof FrameEffect)[];
  id: string;
  image_uri?: string;
  layout: keyof typeof Layout;
  legalities: Legalities;
  name: string;
  nonfoil: boolean;
  rarity: keyof typeof Rarity;
  scryfall_uri: string;
  set: string;
  set_name: string;
};

// Partial scryfall set
export type Set = {
  code: string;
  icon_svg_uri: string;
  name: string;
  parent_set_code?: string;
  released_at?: string;
  set_type: keyof typeof SetType;
};

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
