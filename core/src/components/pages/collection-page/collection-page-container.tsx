import { useMemo, useCallback, useState } from "react";
import CollectionPage from "./collection-page";
import { useDispatch, useSelector } from "react-redux";
import { selectors } from "../../../store";
import { inventoryActions } from "../../../store/inventory";
import { searchActions } from "../../../store/search";
import { BoxCard } from "../../../domain/inventory";
import { defaultCardFilter } from "../../../domain/filters";
import { CardSortFields, search } from "../../../domain/inventory-search";

function getCount(cards: BoxCard[]): number {
  return cards.map((c) => c.count).reduce((a, b) => a + b, 0);
}

export const CollectionPageContainer = () => {
  const [filter, setFilter] = useState(defaultCardFilter);
  const dispatch = useDispatch();
  const boxes = useSelector(selectors.boxes);
  const setsWithCards = useSelector(selectors.setsWithCards);
  const scryfallResults = useSelector(selectors.searchResults);
  const results = useMemo(
    () =>
      search(
        boxes,
        {
          filter,
          grouping: {
            combineSets: true,
            combineArts: false,
            combineFinishes: true,
            combineLanguages: true,
          },
          sorting: { field: CardSortFields.ColorThenName, direction: "asc" },
        },
        setsWithCards,
        scryfallResults
      ),
    [boxes, setsWithCards, scryfallResults, filter]
  );
  const cards = useMemo(() => results.flatMap(r => r.cards), [results]);
  const cardCount = useMemo(() => getCount(cards), [cards]);

  const searchScryfall = useCallback(
    () => dispatch(searchActions.searchStart(filter.scryfallQuery)),
    [filter.scryfallQuery, dispatch]
  );

  return (
    <CollectionPage
      cards={cards}
      cardCount={cardCount}
      filter={filter}
      setFilter={setFilter}
      submitScryfallSearch={searchScryfall}
      exportTappedOutCsv={() => dispatch(inventoryActions.csvExportStart())}
      exportWebJson={() => dispatch(inventoryActions.webExportStart())}
    />
  );
};
