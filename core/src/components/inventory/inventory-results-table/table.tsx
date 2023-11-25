import { Column, Table } from "react-virtualized";
import { FC, useCallback, useMemo } from "react";
import {
  CardSortOptions,
  InventoryQuery,
  InventoryResult,
  haveMatchingKeys,
} from "../../../domain/inventory-search";
import { toRowModel } from "./model";
import { NameCell } from "./name-cell";
import { SetCell } from "./set-cell";
import { FinishCell } from "./finish-cell";
import { ReactVirtualizedSortArgs, fromSortBy, toSortBy } from "./sorting";
import { VersionCell } from "./version-cell";
import { LanguageCell } from "./language-cell";

type Props = {
  query: InventoryQuery;
  results: InventoryResult[];
  updateSortOptions: (options: CardSortOptions) => void;
  inspected: InventoryResult | null;
  setInspected: (result: InventoryResult | null) => void;
};

export const InventoryResultsTable: FC<Props> = ({
  query,
  results,
  updateSortOptions,
  inspected,
  setInspected,
}) => {
  const sortInner = useCallback(
    (args: ReactVirtualizedSortArgs) => {
      const field = fromSortBy(args.sortBy);
      if (field) {
        updateSortOptions({ field, direction: args.sortDirection });
      }
    },
    [updateSortOptions]
  );

  const rows = useMemo(() => results.map(toRowModel), [results]);

  const toggleInspected = useCallback(
    (result: InventoryResult) => {
      console.log(result);
      if (inspected && haveMatchingKeys(result, inspected)) {
        setInspected(null);
      } else {
        setInspected(result);
      }
    },
    [inspected]
  );

  return (
    <Table
      width={900}
      height={600}
      headerHeight={20}
      rowHeight={30}
      rowCount={results.length}
      rowGetter={({ index }) => rows[index]}
      sort={sortInner}
      sortBy={toSortBy(query.sorting.field)}
      sortDirection={query.sorting.direction}
    >
      <Column label="Ct." dataKey="count" width={50} />
      <Column
        label="Name"
        dataKey="name"
        width={300}
        cellRenderer={(props) => (
          <NameCell
            onClick={() => toggleInspected(props.rowData)}
            {...props}
          />
        )}
      />

      {/* Can't inline <SetCell/>, or you'll get an invalid hooks error */}
      <Column
        width={200}
        label="Set"
        dataKey="setAbbrev"
        cellRenderer={(props) => <SetCell {...props} />}
      />
      <Column
        width={100}
        label="Version"
        dataKey="version"
        cellRenderer={(props) => <VersionCell {...props} />}
      />
      <Column
        width={50}
        label="Finish"
        dataKey="finish"
        cellRenderer={(props) => <FinishCell {...props} />}
      />
      <Column
        width={100}
        label="Lang."
        dataKey="lang"
        cellRenderer={(props) => <LanguageCell {...props} />}
      />
    </Table>
  );
};
