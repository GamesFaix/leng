import {
  Autocomplete,
  Divider,
  MenuItem,
  MenuList,
  Select,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import { BoxCard } from "../../logic/model";
import selectors from "../../store/selectors";
import BinderBySetReport from "./binder-by-set-report";
import { Set, SetType } from "scryfall-api";
import SetFilter from "../collection-page/set-filter";
import { map, uniq } from "lodash";
import SetSymbol from "../common/set-symbol";

const orderByAge = (a: Set, b: Set) => {
  if (a.released_at && b.released_at) {
    if (a.released_at < b.released_at) return -1;
    if (b.released_at < a.released_at) return 1;
    return 0;
  }
  if (a.released_at) return -1;
  if (b.released_at) return 1;
  return 0;
};

const SetSelectorOption = (props: any, set: Set, state: any) => {
  const classes = state.selected
    ? ["autocomplete-option", "selected", "set-container"]
    : ["autocomplete-option", "set-container"];

  return (
    <li {...props} key={set.code} classes={classes}>
      <SetSymbol setAbbrev={set.code} />
      <div>{`${set.name} (${set.code.toUpperCase()})`}</div>
    </li>
  );
};

const SetSelector = (props: {
  options: Set[];
  selectedSet: Set | null;
  setSelectedSet: (s: Set | null) => void;
}) => (
  <Autocomplete
    className="control"
    options={props.options.map((s) => ({ ...s, label: s.name }))}
    sx={{ width: 300 }}
    renderInput={(params) => (
      <TextField {...params} label="Set" onFocus={(e) => e.target.select()} />
    )}
    onChange={(e, value) => props.setSelectedSet(value)}
    value={props.selectedSet}
    autoSelect
    autoHighlight
    selectOnFocus
    openOnFocus
    renderOption={SetSelectorOption}
  />
);

const ReportsPage = () => {
  const boxes = useSelector(selectors.boxes);
  const sets = useSelector(selectors.setsGroupedByParent);
  const [selectedSet, setSelectedSet] = React.useState<Set | null>(null);

  const setsInBoxes = uniq(boxes
    .map(b => b.cards?.map(c => c.setAbbrev)?? [])
    .reduce((a,b) => a.concat(b), []));

  const setOptions = sets.filter(s => setsInBoxes.includes(s.parent.code));

  return (
    <div>
      <SetSelector
        options={setOptions.map((s) => s.parent)}
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
      />
    </div>
  );
};
export default ReportsPage;
