import { Grid, GridCellProps } from "react-virtualized";
import { FC, useCallback, useMemo } from "react";
import { InventoryResult } from "../../../domain/inventory-search";
import { ResultCard } from "./result-card";
import { chunk } from "lodash";

type Props = {
  results: InventoryResult[];
};

export const InventoryResultsGrid: FC<Props> = ({ results }) => {
  const rows = useMemo(() => chunk(results, 3), [results]);

  const renderCell = useCallback(
    ({ columnIndex, rowIndex, style }: GridCellProps) => {
      return <ResultCard result={rows[rowIndex][columnIndex]} style={style} />;
    },
    [rows]
  );

  // TODO: Add sort controls

  return (
    <Grid
      cellRenderer={renderCell}
      columnCount={3}
      columnWidth={300}
      width={900}
      height={600}
      rowCount={3}
      rowHeight={200}
    />
  );
};
