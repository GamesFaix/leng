import { TableCellProps } from "react-virtualized";
import { CardFinish } from "../../../domain/encyclopedia";
import { FC } from "react";
import { capitalize } from "lodash";

const format = (finish: CardFinish): string => {
  switch (finish) {
    case CardFinish.Normal:
      return "";
    default:
      return capitalize(finish);
  }
};

export const FinishCell: FC<TableCellProps> = ({ cellData }) => (
  <div>{format(cellData)}</div>
);
