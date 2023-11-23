import { Card, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { InventoryResultsGrid, InventoryResultsTable } from "../../inventory";
import { ChangeEvent, FC, useCallback, useState } from "react";
import {
  CardSortOptions,
  InventoryQuery,
  InventoryResult,
} from "../../../domain/inventory-search";
import { ResultInspector } from "../../inventory/result-inspector";

type Props = {
  query: InventoryQuery;
  results: InventoryResult[];
  setQuery: (query: InventoryQuery) => void;
};

type ResultView = "grid" | "table";

export const ResultsSection: FC<Props> = ({ query, results, setQuery }) => {
  const [view, setView] = useState<ResultView>("grid");
  const [inspected, setInspected] = useState<InventoryResult | null>(null);

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
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Card sx={{ padding: 1 }}>
        <RadioGroup value={view} onChange={onViewChanged} row>
          <FormControlLabel value="grid" control={<Radio />} label="Grid" />
          <FormControlLabel value="table" control={<Radio />} label="Table" />
        </RadioGroup>
        {view === "grid" && (
          <InventoryResultsGrid
            results={results}
            inspected={inspected}
            setInspected={setInspected}
          />
        )}
        {view === "table" && (
          <InventoryResultsTable
            query={query}
            results={results}
            updateSortOptions={setSort}
            inspected={inspected}
            setInspected={setInspected}
          />
        )}
      </Card>
      {inspected !== null && (
        <ResultInspector
          result={inspected}
          close={() => setInspected(null)}
          showImage={view === "table"}
          style={{ marginLeft: "6px" }}
        />
      )}
    </div>
  );
};
