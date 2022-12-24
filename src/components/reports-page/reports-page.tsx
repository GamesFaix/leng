import {
  Autocomplete,
  TextField,
} from "@mui/material";
import * as React from "react";
import { shallowEqual, useSelector } from "react-redux";
import selectors from "../../store/selectors";
import { Set } from "scryfall-api";
import { uniq } from "lodash";
import SetSymbol from "../common/set-symbol";
import { getCardsFromBoxes } from "../../logic/card-filters";
import { organizePages } from "./binder-page-generator";
import Binder from "../virtual-binder/binder";
import { RootState } from "../../store";

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
    onChange={(e, value) => {
      console.log('set selector on change ' + value?.code);
      if (props.selectedSet?.code !== value?.code) {
        props.setSelectedSet(value);
      }
    }}
    value={props.selectedSet}
    autoSelect
    autoHighlight
    selectOnFocus
    openOnFocus
    renderOption={SetSelectorOption}
    isOptionEqualToValue={(x, y) => x.code === y.code}
  />
);

const getSetGroupsInBoxes = (rootState: RootState) => {
  console.log('get set groups in boxes')
  const boxes = selectors.boxes(rootState);
  const setGroups = selectors.setsGroupedByParent(rootState);

  const setCodesInBoxes = uniq(boxes
    .map(b => b.cards?.map(c => c.setAbbrev)?? [])
    .reduce((a,b) => a.concat(b), []));

  // Don't show sets with 0 cards
  return setGroups
    .filter(sg => [ sg.parent, ...sg.children ]
      .some(s => setCodesInBoxes.includes(s.code))
    );
};

const ReportsPage = () => {
  const setGroupsInBoxes = useSelector(selectors.setGroupsInBoxes);
  const [selectedParentSet, setSelectedParentSet] = React.useState<Set | null>(null);
  const selectedCards = useSelector(selectors.boxCardsOfParentSet(selectedParentSet?.code ?? null))

  const selectedSetGroup = setGroupsInBoxes.find(sg => selectedParentSet?.code === sg.parent.code);
  const selectedSets = selectedSetGroup ? [ selectedSetGroup.parent, ...selectedSetGroup.children ] : [];
  const pages = organizePages(selectedCards, selectedSets);

  const onSetSelected = React.useCallback((s) => {
    console.log('on set selected ' + s.code);
    setSelectedParentSet(s);
  }, []);

  return (
    <div>
      <SetSelector
        options={setGroupsInBoxes.map((s) => s.parent)}
        selectedSet={selectedParentSet}
        setSelectedSet={onSetSelected}
      />
      <Binder pages={pages}/>
    </div>
  );
};
export default ReportsPage;
