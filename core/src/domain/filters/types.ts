import { Format } from "../formats";

export type ColorFilter = "W" | "U" | "B" | "R" | "G" | "C";

export const allColors: ColorFilter[] = ["W", "U", "B", "R", "G", "C"];

export enum ColorFilterRule {
  ContainsAny = "CONTAINS_ANY",
  ContainsAll = "CONTAINS_ALL",
  ContainsOnly = "CONTAINS_ONLY",
  IsExactly = "IS_EXACTLY",
  IdentityContainsAny = "IDENTITY_CONTAINS_ANY",
  IdentityContainsAll = "IDENTITY_CONTAINS_ALL",
  IdentityContainsOnly = "IDENTITY_CONTAINS_ONLY",
  IdentityIsExactly = "IDENTITY_IS_EXACTLY",
}

export const allColorFilterRules = [
  ColorFilterRule.ContainsAny,
  ColorFilterRule.ContainsAll,
  ColorFilterRule.ContainsOnly,
  ColorFilterRule.IsExactly,
  ColorFilterRule.IdentityContainsAny,
  ColorFilterRule.IdentityContainsAll,
  ColorFilterRule.IdentityContainsOnly,
  ColorFilterRule.IdentityIsExactly,
];

export type CardFilter = {
  nameQuery: string;
  setAbbrevs: string[];
  colors: ColorFilter[];
  colorRule: ColorFilterRule;
  fromBoxes: string[];
  exceptBoxes: string[];
  format: Format | null;
  scryfallQuery: string;
};

export const defaultCardFilter: CardFilter = {
  nameQuery: "",
  setAbbrevs: [],
  colors: [],
  colorRule: ColorFilterRule.IdentityContainsOnly,
  fromBoxes: [],
  exceptBoxes: [],
  format: null,
  scryfallQuery: "",
};
