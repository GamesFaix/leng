import { TableCellProps } from "react-virtualized";
import { CardImageTooltip } from "../../common";
import { FC } from "react";
import { InventoryResultRowModel } from "./model";

type Props = TableCellProps & {
  onClick: () => void;
};

export const NameCell: FC<Props> = ({ rowData, onClick }) => {
  const result: InventoryResultRowModel = rowData;
  const { scryfallId } = result.cards[0];

  return (
    <CardImageTooltip scryfallId={scryfallId}>
      <div onClick={onClick}>{result.name}</div>
    </CardImageTooltip>
  );
};
