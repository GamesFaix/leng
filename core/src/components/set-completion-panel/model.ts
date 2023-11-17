import { Card, Set, basicLandNames } from "../../domain/encyclopedia";
import { BoxCard } from "../../domain/inventory";

export type CheckListItem = {
  card: Card;
  has: boolean;
};

export enum CheckListVisibility {
  owned = "owned",
  missing = "missing",
  all = "all",
}

export type Rarity = "special" | "mythic" | "rare" | "uncommon" | "common" | "basicland";

export const getRarity = (card: Card): Rarity => {
  switch (card.rarity) {
    case "special" as unknown as string:
      return "special";
    case "mythic":
      return "mythic";
    case "rare":
      return "rare";
    case "uncommon":
      return "uncommon";
    case "common":
      return basicLandNames.includes(card.name) ? "basicland" : "common";
    default:
      throw Error("Invalid rarity " + card.rarity);
  }
};

export type SetCompletionModel = {
  set: Set;
  allCards: Card[];
  ownedCards: BoxCard[];
};

export type ParentSetCompletionModel = {
  parentSet: SetCompletionModel;
  tokenSet: SetCompletionModel | null;
  artSet: SetCompletionModel | null;
  promoSet: SetCompletionModel | null;
  commanderSet: SetCompletionModel | null;
  masterpieceSet: SetCompletionModel | null; // Mystic Archive, etc
};
