import { TableCellProps } from "react-virtualized";
import { CardFinish } from "../../../../domain/encyclopedia";
import { FC } from "react";

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

const format = (finish: CardFinish | null): string => {
  switch (finish) {
    case null:
      return "(Multiple)";
    case CardFinish.Normal:
      return "";
    default:
      return capitalize(finish);
  }
};

export const FinishCell: FC<TableCellProps> = (props: TableCellProps) => (
  <div>{format(props.cellData)}</div>
);
