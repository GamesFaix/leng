import { CardFinish } from "../encyclopedia";
import { CardFilter } from "../filters";
import { BoxCard } from "../inventory/types";

export type CardGroupingOptions = {
  combineFinishes: boolean;
  combineLanguages: boolean;
  combineArts: boolean;
  combineSets: boolean;
};

export enum CardSortFields {
  Name = "Name",
  Number = "Number",
  ColorThenName = "ColorThenName",
  Count = "Count",
}

export type SortDirection = "ASC" | "DESC";

export type CardSortOptions = {
  field: CardSortFields;
  direction: SortDirection;
};

export type InventoryQuery = {
  filter: CardFilter;
  grouping: CardGroupingOptions;
  sorting: CardSortOptions;
};

export type InventoryResultKey = {
  name: string;
  lang: string | null;
  collectorsNumber: string | null;
  setCode: string | null;
  finish: CardFinish | null;
}

/** Represents a single item in the results view,
 * which represents a grouping of cards */
export type InventoryResult = {
  key: InventoryResultKey;
  cards: BoxCard[];
};
