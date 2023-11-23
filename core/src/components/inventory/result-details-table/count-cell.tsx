import { TableCellProps } from "react-virtualized";
import { FC } from "react";

const format = (count: number): string => `${count}x`;

export const CountCell: FC<TableCellProps> = ({ cellData }) => (
  <div style={{textAlign: 'right'}}>{format(cellData)}</div>
);
