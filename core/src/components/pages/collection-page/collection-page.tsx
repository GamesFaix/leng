import { Container, Typography } from "@mui/material";
import { InventoryQueryForm } from "../../inventory";
import { defaultCardFilter } from "../../../domain/filters";
import {
  CardSortFields,
  InventoryQuery,
  getCardCount,
  search,
} from "../../../domain/inventory-search";
import { ExportButtons } from "./export-buttons";
import { FC, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectors } from "../../../store";
import { inventoryActions } from "../../../store/inventory";
import { searchActions } from "../../../store/search";
import { ResultsSection } from "./results-section";

const startingQuery: InventoryQuery = {
  filter: defaultCardFilter,
  grouping: {
    combineSets: true,
    combineArts: true,
    combineFinishes: true,
    combineLanguages: true,
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
      <ResultsSection query={query} setQuery={setQuery} results={results} />
    </Container>
  );
};
