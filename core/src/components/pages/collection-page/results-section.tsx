import {
  Card,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { InventoryResultsGrid, InventoryResultsTable } from "../../inventory";
import { ChangeEvent, FC, useCallback, useState } from "react";
import {
  CardSortOptions,
  InventoryQuery,
  InventoryResult,
} from "../../../domain/inventory-search";

type Props = {
  query: InventoryQuery;
  results: InventoryResult[];
  setQuery: (query: InventoryQuery) => void;
};

type ResultView = "grid" | "table";

export const ResultsSection: FC<Props> = ({ query, results, setQuery }) => {
  const [view, setView] = useState<ResultView>("grid");

  const onViewChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const view = e.target.value as ResultView;
      setView(view);
    },
    [setView]
  );

  const setSort = useCallback(
    (sorting: CardSortOptions) => setQuery({ ...query, sorting }),
    [query, setQuery]
  );

  return (
    <Card sx={{ padding: 1 }}>
      <RadioGroup value={view} onChange={onViewChanged} row>
        <FormControlLabel value="grid" control={<Radio />} label="Grid" />
        <FormControlLabel value="table" control={<Radio />} label="Table" />
      </RadioGroup>
      {view === "grid" && <InventoryResultsGrid results={results} />}
      {view === "table" && (
        <InventoryResultsTable
          query={query}
          results={results}
          updateSortOptions={setSort}
        />
      )}
    </Card>
  );
};
