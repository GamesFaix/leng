import { TableCellProps } from "react-virtualized";
import { CardImageTooltip } from "../../../common";
import { FC } from "react";
import { InventoryResultRowModel } from "./model";

export const NameCell: FC<TableCellProps> = (props: TableCellProps) => {
  const result: InventoryResultRowModel = props.rowData;
  const { scryfallId } = result.cards[0];

  return (
    <CardImageTooltip scryfallId={scryfallId}>
      <div>{result.name}</div>
    </CardImageTooltip>
  );
};
