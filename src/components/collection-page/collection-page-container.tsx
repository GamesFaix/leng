import * as React from "react";
import { useMemo, useCallback } from "react";
import { BoxCard, CardFilter, defaultCardFilter } from "../../logic/model";
import { getCards } from "../../logic/card-filters";
import CollectionPage from "./collection-page";
import { useDispatch, useSelector } from "react-redux";
import selectors from "../../store/selectors";
import { inventoryActions } from "../../store/inventory";
import { searchActions } from "../../store/search";
import { debounce } from "lodash";

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

  const debouncedDispatch = useMemo(() => debounce(dispatch, 200), [dispatch]);

  const search = useCallback(
    (query: string) => debouncedDispatch(searchActions.searchStart(query)),
    [debouncedDispatch]
  );

  const onFilterChanged = useCallback(
    (newFilter: CardFilter) => {
      const q = newFilter.scryfallQuery;
      //console.log("filter changed (query = " + q + ")");
      if (q.length > 2 && q !== filter.scryfallQuery) {
        search(q);
      }
      setFilter(newFilter);
    },
    [filter, setFilter, search]
  );

  return (
    <CollectionPage
      cards={cards}
      cardCount={cardCount}
      filter={filter}
      setFilter={onFilterChanged}
      exportCsv={() => dispatch(inventoryActions.csvExportStart())}
    />
  );
};
export default CollectionPageContainer;
