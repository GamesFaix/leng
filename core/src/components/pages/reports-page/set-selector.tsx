import { Autocomplete, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { selectors } from "../../../store";
import { Set } from "../../../domain/encyclopedia";
import { SetSymbol } from "../../common";
import { SyntheticEvent, useCallback, useMemo } from "react";

type SetSelectorOption = {
  label: string;
  parent: Set;
};

const SetSelectorOption = (
  props: any,
  option: SetSelectorOption,
  state: any
) => {
  const classes = state.selected
    ? ["autocomplete-option", "selected", "set-container"]
    : ["autocomplete-option", "set-container"];

  return (
    <li {...props} key={option.parent.code} classes={classes}>
      <SetSymbol setAbbrev={option.parent.code} />
      <div>{`${option.parent.name} (${option.parent.code.toUpperCase()})`}</div>
    </li>
  );
};

const SetSelector = (props: {
  selectedSetCode: string | null;
  setSelectedSetCode: (code: string | null) => void;
}) => {
  const setGroupsInBoxes = useSelector(selectors.setGroupsInBoxes);
  const options = useMemo<SetSelectorOption[]>(
    () =>
      setGroupsInBoxes.map((s) => ({ label: s.parent.name, parent: s.parent })),
    [setGroupsInBoxes]
  );
  const selectedOption =
    options.find((o) => o.parent.code === props.selectedSetCode) ?? null;

  const onSelection = useCallback(
    (e: SyntheticEvent<Element, Event>, value: SetSelectorOption | null) =>
      props.setSelectedSetCode(value?.parent.code ?? null),
    [props.setSelectedSetCode]
  );

  return (
    <Autocomplete
      className="control"
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Set" onFocus={(e) => e.target.select()} />
      )}
      onChange={onSelection}
      value={selectedOption}
      autoSelect
      autoHighlight
      selectOnFocus
      openOnFocus
      renderOption={SetSelectorOption}
    />
  );
};
export default SetSelector;
