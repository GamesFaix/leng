import { Card } from "@mui/material";
import { Grid, GridCellProps } from "react-virtualized";
import { BoxCard } from "../../domain/inventory";
import { BinderPage } from "./binder-page";
import { FC, useCallback } from "react";

const scale = 60;

type Props = {
  pages: BoxCard[][][];
};

export const Binder: FC<Props> = ({ pages }) => {
  const renderCell = useCallback(
    ({ columnIndex, style }: GridCellProps) => {
      const page = pages[columnIndex];
      return (
        <BinderPage
          style={style}
          cardGroups={page}
          key={columnIndex}
          scale={scale}
        />
      );
    },
    [pages]
  );

  // TODO: Add sort controls

  return (
    <Card
      style={{
        padding: "5px",
      }}
    >
      <Grid
        cellRenderer={renderCell}
        columnCount={pages.length}
        columnWidth={500}
        height={680}
        rowCount={1}
        rowHeight={680}
        width={1480}
      />
    </Card>
  );
};
