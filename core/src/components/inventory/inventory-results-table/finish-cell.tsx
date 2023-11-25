import { TableCellProps } from "react-virtualized";
import { CardFinish } from "../../../domain/encyclopedia";
import { FC } from "react";
import { capitalize } from "lodash";

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

export const FinishCell: FC<TableCellProps> = ({ cellData }) => (
  <div>{format(cellData)}</div>
);
