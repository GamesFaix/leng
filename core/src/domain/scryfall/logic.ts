import {
  Card as ScryCard,
  SearchOptions,
  Set as ScrySet,
  Cards,
  Legalities as ScryfallLegalities,
} from "scryfall-api";
import { BulkData, ScryfallResponse } from "./types";
import { Card, Legalities, Set } from "../encyclopedia";

const baseUrl = "https://api.scryfall.com";

const getBulkData = async () => {
  const httpResponse1 = await fetch(`${baseUrl}/bulk-data`);
  const scryfallResponse: ScryfallResponse<BulkData[]> =
    await httpResponse1.json();
  const defaultCardsInfo = scryfallResponse.data.find(
    (x) => x.type === "default_cards"
  );
  if (!defaultCardsInfo) {
    throw Error("Could not find bulk data file info.");
  }
  return defaultCardsInfo;
};

const removeDigitalFormatLegalities = (l: ScryfallLegalities): Legalities => ({
  brawl: l.brawl,
  commander: l.commander,
  duel: l.duel,
  future: l.future,
  legacy: l.legacy,
  modern: l.modern,
  oldschool: l.oldschool,
  pauper: l.pauper,
  penny: l.penny,
  pioneer: l.pioneer,
  standard: l.standard,
  vintage: l.vintage,
  
  // Scryfall library type defs are behind
  oathbreaker: (l as any).oathbreaker,
  paupercommander: (l as any).paupercommander,
  premodern: (l as any).premodern,
  predh: (l as any).predh,

  // Skip digital formats
  // * alchemy
  // * explorer
  // * gladiator
  // * historic
  // * historicbrawl
});

const removeExtraCardProperties = (c: ScryCard): Card => ({
  num: c.collector_number,
  color_identity: c.color_identity,
  colors: c.colors,
  foil: c.foil,
  frame_effects: c.frame_effects,
  id: c.id,
  image_uri:
    c.image_uris?.small ??
    c.image_uris?.normal ??
    c.image_uris?.large ??
    c.image_uris?.png,
  layout: c.layout,
  legalities: removeDigitalFormatLegalities(c.legalities),
  name: c.name,
  nonfoil: c.nonfoil,
  rarity: c.rarity,
  scryfall_uri: c.scryfall_uri,
  set: c.set,
  set_name: c.set_name,
});

// Filters out MTGO and Alchemy
const nonDigital = (c: ScryCard) => !c.digital;

export const getAllCards = async (): Promise<Card[]> => {
  const bulkData = await getBulkData();
  const httpResponse2 = await fetch(bulkData.download_uri);
  const cards: ScryCard[] = await httpResponse2.json();
  return cards.filter(nonDigital).map(removeExtraCardProperties);
};

const removeExtraSetProperties = (s: ScrySet): Set => ({
  code: s.code,
  icon_svg_uri: s.icon_svg_uri,
  name: s.name,
  parent_set_code: s.parent_set_code,
  released_at: s.released_at,
  set_type: s.set_type,
});

export const getAllSets = async (): Promise<Set[]> => {
  const httpResponse = await fetch(`${baseUrl}/sets`);
  const scryfallResponse: ScryfallResponse<ScrySet[]> =
    await httpResponse.json();
  return scryfallResponse.data.map(removeExtraSetProperties);
};

const options: SearchOptions = {
  include_variations: true,
  unique: "prints",
};

export async function searchScryfall(query: string): Promise<Card[]> {
  const results = await Cards.search(query, options).all();
  return results.filter(nonDigital).map(removeExtraCardProperties);
}
