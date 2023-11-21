import { TableCellProps } from "react-virtualized";
import { SetSymbol } from "../../../common";
import { selectors } from "../../../../store";
import { useSelector } from "react-redux";
import { Set } from "../../../../domain/encyclopedia";
import { FC } from "react";

const SetCellContents: FC<{ set: Set }> = ({ set }) => (
  <>
    <SetSymbol setAbbrev={set!.code} />
    {set!.name}
  </>
);

const SetCellEmptyContents: FC = () => <>{`(Multiple)`}</>;

export const SetCell: FC<TableCellProps> = (props: TableCellProps) => {
  const set = useSelector(selectors.setOrNull(props.cellData));
  return (
    <div className="set-container">
      {set ? <SetCellContents set={set} /> : <SetCellEmptyContents />}
    </div>
  );
};
