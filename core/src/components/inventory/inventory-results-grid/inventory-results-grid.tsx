import { Grid, GridCellProps } from "react-virtualized";
import { FC, useMemo } from "react";
import { InventoryResult } from "../../../domain/inventory-search";
import { chunk } from "lodash";
import { getResultKeyString } from "../../../domain/inventory-search";
import { Cell } from "./cell";

type Props = {
  results: InventoryResult[];
  inspected: InventoryResult | null;
  setInspected: (result: InventoryResult | null) => void;
};

const scale = 100;

export const InventoryResultsGrid: FC<Props> = ({
  results,
  inspected,
  setInspected,
}) => {
  const rows = useMemo(() => chunk(results, 3), [results]);

  // TODO: Add sort controls

  const colWidth = scale * 2.5;
  const rowHeight = scale * 3.5;
  const width = colWidth * 3;
  const height = rowHeight * 3;

  return (
    <Grid
      cellRenderer={({ columnIndex, rowIndex, style }: GridCellProps) => {
        const result = rows[rowIndex][columnIndex];
        return (
          <Cell
            key={result ? getResultKeyString(result.key) : ""}
            result={result}
            inspected={inspected}
            setInspected={setInspected}
            style={style}
          />
        );
      }}
      columnCount={3}
      columnWidth={colWidth}
      width={width}
      height={height}
      rowCount={rows.length}
      rowHeight={rowHeight}
    />
  );
};
