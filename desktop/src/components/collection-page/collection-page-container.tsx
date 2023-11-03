import * as React from "react";
import { useMemo, useCallback } from "react";
import { BoxCard, defaultCardFilter } from "leng-core/src/logic/model";
import { getCards } from "leng-core/src/logic/card-filters";
import CollectionPage from "./collection-page";
import { useDispatch, useSelector } from "react-redux";
import selectors from "leng-core/src/store/selectors";
import { inventoryActions } from "leng-core/src/store/inventory";
import { searchActions } from "leng-core/src/store/search";

function getCount(cards: BoxCard[]): number {
  return cards.map((c) => c.count).reduce((a, b) => a + b, 0);
}

const CollectionPageContainer = () => {
  const [filter, setFilter] = React.useState(defaultCardFilter);
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
      exportCsv={() => dispatch(inventoryActions.csvExportStart())}
    />
  );
};
export default CollectionPageContainer;