import { TableCellProps } from "react-virtualized";
import { SetSymbol } from "../../common";
import { selectors } from "../../../store";
import { useSelector } from "react-redux";
import { FC } from "react";

export const SetCell: FC<TableCellProps> = ({ cellData }) => {
  const set = useSelector(selectors.setOrNull(cellData));
  return (
    <div className="set-container">
      <SetSymbol setAbbrev={set!.code} />
      {set!.name}
    </div>
  );
};
