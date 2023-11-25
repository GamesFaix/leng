import { SortDirectionType } from "react-virtualized";
import { CardSortFields } from "../../../domain/inventory-search";

export type ReactVirtualizedSortArgs = {
  sortBy: string;
  sortDirection: SortDirectionType;
};

export const toSortBy = (field: CardSortFields): string | undefined => {
  switch (field) {
    case CardSortFields.Name:
      return "name";
    case CardSortFields.Number:
      return "version";
    case CardSortFields.Count:
      return "count";
    default:
      return undefined;
  }
};

export const fromSortBy = (sortBy: string): CardSortFields | null => {
  switch (sortBy) {
    case "name":
      return CardSortFields.Name;
    case "version":
      return CardSortFields.Number;
    case "count":
      return CardSortFields.Count;
    default:
      return null;
  }
};
