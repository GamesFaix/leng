import { MenuItem, Select } from "@mui/material";
import { ColorFilter, allColors } from "../../../domain/filters";
import { FC } from "react";

const getOptionLabel = (color: ColorFilter): string => {
  switch (color) {
    case "W":
      return "White";
    case "U":
      return "Blue";
    case "B":
      return "Black";
    case "R":
      return "Red";
    case "G":
      return "Green";
    case "C":
      return "Colorless";
  }
};

type Props = {
  value: ColorFilter[];
  onChange: (value: ColorFilter[]) => void;
};

export const ColorsSelector: FC<Props> = ({ value, onChange }) => (
  <Select
    value={value as any}
    multiple
    onChange={(e) => onChange(e.target.value as ColorFilter[])}
    sx={{
      width: 200,
    }}
  >
    {allColors.map((c) => (
      <MenuItem key={c} value={c}>
        {getOptionLabel(c)}
      </MenuItem>
    ))}
  </Select>
);
