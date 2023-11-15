export enum FormatType {
  Scryfall = "SCRYFALL", // Provided by Scryfall API
  Custom = "CUSTOM",
}

export type ScryfallFormat = {
  type: FormatType.Scryfall;
  name: string;
  scryfallKey: string;
};

export type CustomFormat = {
  type: FormatType.Custom;
  name: string;
  setCodes: string[];
};

export type FormatGroup = {
  name: string;
  formats: Format[];
};

export type Format = ScryfallFormat | CustomFormat;

export const emptyFormat: Format = {
  type: FormatType.Custom,
  name: "No cards allowed",
  setCodes: [],
};

export const customFormat = (name: string, setCodes: string[]) => ({
  type: FormatType.Custom,
  name,
  setCodes,
});
