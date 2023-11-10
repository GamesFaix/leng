import { Color, Legalities, Language, CardFinish } from "../encyclopedia";

/** Represents the number of copies of a given printing of a card in a box. */
export type BoxCard = {
    scryfallId: string;
    name: string;
    setAbbrev: string;
    collectorsNumber: string;
    lang: Language;
    finish: CardFinish;
    count: number;
    setName: string;
    color: Color[];
    colorIdentity: Color[];
    versionLabel: string;
    normalizedName: string;
    legalities: Legalities;
  };
  
  /** A group of cards in a collection, saved in a single box file. (It could represent a binder, bulk box, deck, etc.) */
  export type Box = {
    name: string;
    lastModified: Date;
    description: string;
    cards: BoxCard[];
  };
  
  /** Basic info about a box file on disk. */
  export type BoxInfo = {
    name: string;
    lastModified: Date;
  };
  
  export type BoxState = {
    name: string;
    lastModified: Date;
  
    // Deferred loading because file must be opened and deserialized
    description: string | null;
    cards: BoxCard[] | null;
  };
  
  export type BoxTransferBulkRequest = {
    fromBoxName: string;
    toBoxName: string;
    cardKeys: string[];
  };
  
  export type BoxTransferSingleRequest = {
    fromBoxName: string;
    toBoxName: string;
    card: BoxCard;
  };