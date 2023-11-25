import { MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import { selectors } from "../../../store";
import { SetSymbol } from "../../common";
import { FC } from "react";

type Props = {
  value: string[];
  onChange: (setAbbrevs: string[]) => void;
};

export const SetFilter: FC<Props> = ({ value, onChange }) => {
  const sets = useSelector(selectors.sets);

  return (
    <Select
      sx={{
        width: 200,
      }}
      multiple
      value={value}
      onChange={(e) => onChange(e.target.value as any)}
    >
      {sets.map((s) => (
        <MenuItem key={s.code} value={s.code}>
          <SetSymbol setAbbrev={s.code} />
          {`${s.name} (${s.code.toUpperCase()})`}
        </MenuItem>
      ))}
    </Select>
  );
};
