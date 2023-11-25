import { TableCellProps } from "react-virtualized";
import { FC } from "react";

export const VersionCell: FC<TableCellProps> = ({ cellData }) => {
  const version: string = cellData;

  return <span style={{ textAlign: "right" }}>{`#${version}`}</span>;
};
