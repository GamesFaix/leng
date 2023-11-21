import { TableCellProps } from "react-virtualized";
import { FC } from "react";

export const LanguageCell: FC<TableCellProps> = ({ cellData }) => (
  <div>{cellData ?? "(Multiple)"}</div>
);
