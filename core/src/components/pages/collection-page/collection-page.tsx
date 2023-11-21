import { Card, Container, Typography } from "@mui/material";
import { InventoryQueryForm } from "../../common";
import { defaultCardFilter } from "../../../domain/filters";
import {
  CardSortFields,
  CardSortOptions,
  InventoryQuery,
  getCardCount,
  search,
} from "../../../domain/inventory-search";
import { InventoryResultsTable } from "./inventory-results-table";
import { ExportButtons } from "./export-buttons";
import { FC, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectors } from "../../../store";
import { inventoryActions } from "../../../store/inventory";
import { searchActions } from "../../../store/search";

const startingQuery: InventoryQuery = {
  filter: defaultCardFilter,
  grouping: {
    combineSets: false,
    combineArts: false,
    combineFinishes: false,
    combineLanguages: false,
  },
  sorting: { field: CardSortFields.ColorThenName, direction: "ASC" },
};

export const CollectionPage: FC = () => {
  const [query, setQuery] = useState(startingQuery);
  const dispatch = useDispatch();
  const boxes = useSelector(selectors.boxes);
  const setsWithCards = useSelector(selectors.setsWithCards);
  const scryfallResults = useSelector(selectors.searchResults);

  const results = useMemo(
    () => search(boxes, query, setsWithCards, scryfallResults),
    [boxes, setsWithCards, scryfallResults, query]
  );

  const searchScryfall = useCallback(
    () => dispatch(searchActions.searchStart(query.filter.scryfallQuery)),
    [query.filter.scryfallQuery, dispatch]
  );

  const setSort = useCallback(
    (sorting: CardSortOptions) => setQuery({ ...query, sorting }),
    [query, setQuery]
  );

  return (
    <Container style={{ paddingTop: "12px" }}>
      <div style={{ display: "flex" }}>
        <div>
          <Typography variant="h4">Collection</Typography>
          <Typography sx={{ fontStyle: "italic" }}>
            {getCardCount(results)} cards
          </Typography>
        </div>
        <ExportButtons
          exportTappedOutCsv={() => dispatch(inventoryActions.csvExportStart())}
          exportWebJson={() => dispatch(inventoryActions.webExportStart())}
        />
      </div>
      <br />
      <InventoryQueryForm
        value={query}
        onChange={setQuery}
        submitScryfallSearch={searchScryfall}
      />
      <br />
      <Card sx={{ padding: 1 }}>
        <InventoryResultsTable
          query={query}
          results={results}
          updateSortOptions={setSort}
        />
      </Card>
    </Container>
  );
};
