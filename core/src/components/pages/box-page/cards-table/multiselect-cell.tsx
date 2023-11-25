import { Checkbox } from "@mui/material";
import { TableCellProps } from "react-virtualized";
import { BoxCard, getKey } from "../../../../domain/inventory";
import { FC, useCallback } from "react";

type Props = {
  cards: BoxCard[];
  selectedKeys: string[];
  onSelectionChanged: (keys: string[]) => void;
};

export const MultiSelectCell: FC<TableCellProps & Props> = ({
  rowData,
  selectedKeys,
  onSelectionChanged,
}) => {
  const card: BoxCard = rowData;
  const key = getKey(card);
  const isSelected = selectedKeys.includes(key);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked && !isSelected) {
        onSelectionChanged([...selectedKeys, key]);
      } else if (!e.target.checked && isSelected) {
        onSelectionChanged(selectedKeys.filter((k) => k !== key));
      }
    },
    [selectedKeys, onSelectionChanged]
  );

  return (
    <div>
      <Checkbox checked={isSelected} onChange={onChange} />
    </div>
  );
};
