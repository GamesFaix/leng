import { TableCellProps } from "react-virtualized";
import { CardFinish } from "../../../domain/encyclopedia";
import { FC } from "react";

// TODO: Move to shared module
const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

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
