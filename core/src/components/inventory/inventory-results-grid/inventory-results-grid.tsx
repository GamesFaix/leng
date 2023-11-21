import { Grid, GridCellProps } from "react-virtualized";
import { FC, useCallback, useMemo } from "react";
import { InventoryResult } from "../../../domain/inventory-search";
import { ResultCard } from "./result-card";
import { chunk } from "lodash";

type Props = {
  results: InventoryResult[];
};

const scale = 100;

export const InventoryResultsGrid: FC<Props> = ({ results }) => {
  const rows = useMemo(() => chunk(results, 3), [results]);

  const renderCell = useCallback(
    ({ columnIndex, rowIndex, style }: GridCellProps) => {
      const result = rows[rowIndex][columnIndex];
      return result ? (
        <ResultCard
          result={result}
          style={style}
          key={`${columnIndex},${rowIndex}`}
        />
      ) : (
        <span></span>
      );
    },
    [rows]
  );

  // TODO: Add sort controls

  const colWidth = scale * 2.5;
  const rowHeight = scale * 3.5;
  const width = colWidth * 3;
  const height = rowHeight * 3;

  return (
    <Grid
      cellRenderer={renderCell}
      columnCount={3}
      columnWidth={colWidth}
      width={width}
      height={height}
      rowCount={rows.length}
      rowHeight={rowHeight}
    />
  );
};
