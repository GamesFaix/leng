import {
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectors } from "../../../store";
import { Format, FormatGroup } from "../../../domain/formats";
import { FC, useCallback } from "react";

type Props = {
  value: Format | null;
  onChange: (value: Format | null) => void;
};

const getAllMenuItems = (groups: FormatGroup[]): JSX.Element[] => {
  const results: JSX.Element[] = [];
  groups.forEach((g) => {
    results.push(<ListSubheader key={g.name}>{g.name}</ListSubheader>);
    g.formats.forEach((f) => {
      results.push(
        <MenuItem key={f.name} value={f.name}>
          {f.name}
        </MenuItem>
      );
    });
  });
  return results;
};

export const FormatFilter: FC<Props> = ({ value, onChange }) => {
  const formats = useSelector(selectors.formats);

  const onChangeInner = useCallback(
    (e: SelectChangeEvent<string>) => {
      const name = e.target.value === "" ? null : e.target.value;
      console.log(`FormatFilter.onSelect ${name}`);
      const format = name
        ? formats
            .flatMap((group) => group.formats)
            .find((f) => f.name === name) ?? null
        : null;
      onChange(format);
    },
    [formats, onChange]
  );

  return (
    <Select
      sx={{
        width: 200,
      }}
      value={value?.name ?? ""}
      onChange={onChangeInner}
    >
      {getAllMenuItems(formats)}
    </Select>
  );
};
