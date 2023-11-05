import { Checkbox } from "@mui/material";
import * as React from "react";
import { TableCellProps } from "react-virtualized";
import { SetSymbol } from "./set-symbol";
import selectors from "../../store/selectors";
import { BoxCard, CardFinish } from "../../logic/model";
import { CardImageTooltip } from "./card-image-tooltip";
import { useSelector } from "react-redux";

export const CheckboxCell = (props: TableCellProps) => (
  <Checkbox checked={props.cellData} disabled />
);

export const SetCell: React.FC<TableCellProps> = (props: TableCellProps) => {
  const abbrev = props.cellData;
  const set = useSelector(selectors.set(abbrev));
  return (
    <div className="set-container">
      <SetSymbol setAbbrev={set!.code} />
      {set!.name}
    </div>
  );
};

export const NameCell: React.FC<TableCellProps> = (props: TableCellProps) => {
  const card: BoxCard = props.rowData;
  return (
    <CardImageTooltip scryfallId={card.scryfallId}>
      <div>{card.name}</div>
    </CardImageTooltip>
  );
};

export const FinishCell: React.FC<TableCellProps> = (props: TableCellProps) => {
  function format(finish: CardFinish) {
    if (finish === CardFinish.Normal) return "";
    const head = finish.slice(0, 1).toUpperCase();
    const tail = finish.slice(1);
    return head + tail;
  }

  const finish: CardFinish = props.cellData;

  return <div>{format(finish)}</div>;
};
