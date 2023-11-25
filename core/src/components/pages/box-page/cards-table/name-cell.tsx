import { TableCellProps } from "react-virtualized";
import { CardImageTooltip } from "../../../common/card-image-tooltip";
import { BoxCard } from "../../../../domain/inventory";
import { FC } from "react";

export const NameCell: FC<TableCellProps> = (props: TableCellProps) => {
  const card: BoxCard = props.rowData;
  return (
    <CardImageTooltip scryfallId={card.scryfallId}>
      <div>{card.name}</div>
    </CardImageTooltip>
  );
};
