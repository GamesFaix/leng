import { useMemo, useCallback, useState } from "react";
import CollectionPage from "./collection-page";
import { useDispatch, useSelector } from "react-redux";
import { selectors } from "../../../store";
import { inventoryActions } from "../../../store/inventory";
import { searchActions } from "../../../store/search";
import { BoxCard } from "../../../domain/inventory";
import { defaultCardFilter, getCards } from "../../../domain/filters";

function getCount(cards: BoxCard[]): number {
  return cards.map((c) => c.count).reduce((a, b) => a + b, 0);
}

export const CollectionPageContainer = () => {
  const [filter, setFilter] = useState(defaultCardFilter);
  const dispatch = useDispatch();
  const boxes = useSelector(selectors.boxes);
  const setsWithCards = useSelector(selectors.setsWithCards);
  const searchResults = useSelector(selectors.searchResults);
  const cards = useMemo(
    () => getCards(boxes, filter, setsWithCards, searchResults),
    [boxes, setsWithCards, searchResults, filter]
  );
  const cardCount = useMemo(() => getCount(cards), [cards]);

  const search = useCallback(
    () => dispatch(searchActions.searchStart(filter.scryfallQuery)),
    [filter.scryfallQuery, dispatch]
  );

  return (
    <CollectionPage
      cards={cards}
      cardCount={cardCount}
      filter={filter}
      setFilter={setFilter}
      submitScryfallSearch={search}
      exportTappedOutCsv={() => dispatch(inventoryActions.csvExportStart())}
      exportWebJson={() => dispatch(inventoryActions.webExportStart())}
    />
  );
};
