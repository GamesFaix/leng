import { TableCellProps } from "react-virtualized";
import { CardFinish } from "../../../../domain/encyclopedia";
import { FC } from "react";

export const FinishCell: FC<TableCellProps> = (props: TableCellProps) => {
  function format(finish: CardFinish) {
    if (finish === CardFinish.Normal) return "";
    const head = finish.slice(0, 1).toUpperCase();
    const tail = finish.slice(1);
    return head + tail;
  }

  const finish: CardFinish = props.cellData;

  return <div>{format(finish)}</div>;
};
