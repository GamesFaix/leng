import { Card } from "./types";

export function getVersionLabel(card: Card): string {
  const numberStr = `#${card.collector_number}`;

  let frameEffectsStr = "";
  if (card.frame_effects?.includes("showcase")) {
    frameEffectsStr += " Showcase";
  }
  if (card.frame_effects?.includes("extendedart")) {
    frameEffectsStr += " Extended Art";
  }

  return `${numberStr}${frameEffectsStr}`;
}
