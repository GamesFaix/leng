export enum FormatType {
  Standard,
  Custom,
}

export type StandardFormat = {
  type: FormatType.Standard;
  name: string;
};

export type CustomFormat = {
  type: FormatType.Custom;
  name: string;
  setCodes: string[];
};

export type Format = StandardFormat | CustomFormat;

// Equivalent to "anything goes"
export const emptyFormat: Format = { type: FormatType.Standard, name: "" };

export const customFormat = (name: string, setCodes: string[]) => ({
  type: FormatType.Custom,
  name,
  setCodes,
});
