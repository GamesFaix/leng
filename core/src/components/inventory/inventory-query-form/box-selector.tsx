import { MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import { selectors } from "../../../store";
import { FC } from "react";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const BoxSelector: FC<Props> = ({ value, onChange }) => {
  const boxNames = useSelector(selectors.boxes).map((b) => b.name);

  return (
    <Select
      value={value as any}
      multiple
      onChange={(e) => onChange(e.target.value as string[])}
      sx={{
        width: 200,
      }}
    >
      {boxNames.map((b) => (
        <MenuItem key={b} value={b}>
          {b}
        </MenuItem>
      ))}
    </Select>
  );
};
