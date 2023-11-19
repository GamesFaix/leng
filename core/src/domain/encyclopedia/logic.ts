import { Card } from "./types";

export function getVersionLabel(card: Card): string {
  const numberStr = `#${card.num}`;

  let frameEffectsStr = "";
  if (card.frame_effects?.includes("showcase")) {
    frameEffectsStr += " Showcase";
  }
  if (card.frame_effects?.includes("extendedart")) {
    frameEffectsStr += " Extended Art";
  }

  return `${numberStr}${frameEffectsStr}`;
}

export function normalizeCollectorsNumber(x: string) {
  const pattern = /([a-zA-Z]*)(\d+)(.*)/;
  const match = pattern.exec(x);
  if (!match) {
    throw new Error("Invalid collector's number");
  }
  const prefix = match[1];
  const num = match[2];
  const msc = match[3];
  return `${prefix.padEnd(1, "_")}|${num
    .toString()
    .padStart(4, "0")}|${msc.replace("★", "")}`;
}