import { TableCellProps } from "react-virtualized";
import { SetSymbol } from "../../../common/set-symbol";
import { selectors } from "../../../../store";
import { useSelector } from "react-redux";
import { FC } from "react";

export const SetCell: FC<TableCellProps> = (props: TableCellProps) => {
  const abbrev = props.cellData;
  const set = useSelector(selectors.set(abbrev));
  return (
    <div className="set-container">
      <SetSymbol setAbbrev={set!.code} />
      {set!.name}
    </div>
  );
};
