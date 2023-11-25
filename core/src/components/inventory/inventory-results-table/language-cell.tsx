import { TableCellProps } from "react-virtualized";
import { FC } from "react";

// TODO: Add flag icon

export const LanguageCell: FC<TableCellProps> = ({ cellData }) => (
  <div>{cellData ?? "(Multiple)"}</div>
);
