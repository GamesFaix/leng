import {
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectors } from "../../../store";
import { Format, FormatGroup } from "../../../domain/formats";
import { useCallback } from "react";

type Props = {
  value: Format | null;
  onChange: (value: Format | null) => void;
};

const getAllMenuItems = (groups: FormatGroup[]): JSX.Element[] => {
  const results: JSX.Element[] = [];
  groups.forEach((g) => {
    results.push(<ListSubheader key={g.name}>{g.name}</ListSubheader>);
    g.formats.forEach((f) => {
      results.push(<MenuItem key={f.name} value={f.name}>{f.name}</MenuItem>);
    });
  });
  return results;
};

const FormatFilter = (props: Props) => {
  const formats = useSelector(selectors.formats);

  const onSelect = useCallback(
    (e: SelectChangeEvent<string>) => {
      const name = e.target.value === "" ? null : e.target.value;
      console.log(`FormatFilter.onSelect ${name}`)
      const format = name
        ? formats
            .flatMap((group) => group.formats)
            .find((f) => f.name === name) ?? null
        : null;
      props.onChange(format);
    },
    [formats, props.onChange]
  );

  return (
    <Select
      sx={{
        width: 200,
      }}
      value={props.value?.name ?? ""}
      onChange={onSelect}
    >
      {getAllMenuItems(formats)}
    </Select>
  );
};
export default FormatFilter;
