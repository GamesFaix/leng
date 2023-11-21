import { TableCellProps } from "react-virtualized";
import { FC } from "react";

export const VersionCell: FC<TableCellProps> = ({ cellData }) => (
  <div>{cellData ?? "(Multiple)"}</div>
);
