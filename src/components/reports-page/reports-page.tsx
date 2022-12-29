import {
  Autocomplete,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import selectors from "../../store/selectors";
import { Set } from "scryfall-api";
import SetSymbol from "../common/set-symbol";
import Binder from "../virtual-binder/binder";
import { organizePages } from "./binder-page-generator";
import { getCardsFromBoxes } from "../../logic/card-filters";

type SetSelectorOption = {
    label: string,
    parent: Set
}

const SetSelectorOption = (props: any, option: SetSelectorOption, state: any) => {
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
    const options = React.useMemo<SetSelectorOption[]>(
        () => setGroupsInBoxes.map((s) => ({ label: s.parent.name, parent: s.parent })),
        [setGroupsInBoxes]);
    const selectedOption = options.find(o => o.parent.code === props.selectedSetCode) ?? null;

    const onSelection = React.useCallback((e, value) => props.setSelectedSetCode(value?.parent.code ?? null), [props.setSelectedSetCode]);

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
        />);
};

type BinderProps = {
  parentSetCode: string | null
}

const BinderOfSet = (props: BinderProps) => {
  const boxes = useSelector(selectors.boxes);
  const sets = useSelector(selectors.sets);
  const setGroupsInBoxes = useSelector(selectors.setGroupsInBoxes);

  const pages = React.useMemo(() => {
    if (!props.parentSetCode) { return []; }
    const codes = [props.parentSetCode, ...sets.filter(s => s.parent_set_code === props.parentSetCode).map(s => s.code)];
    const selectedCards = getCardsFromBoxes(boxes).filter(c => codes.includes(c.setAbbrev));
    const selectedSetGroup = setGroupsInBoxes.find(sg => props.parentSetCode === sg.parent.code);
    const selectedSets = selectedSetGroup ? [ selectedSetGroup.parent, ...selectedSetGroup.children ] : [];
    const pages = organizePages(selectedCards, selectedSets);
    return pages;
  }, [props.parentSetCode]);

  return <Binder pages={pages}/>;
}

const ReportsPage = () => {
  const [selectedParentSetCode, setSelectedParentSetCode] = React.useState<string | null>(null);

  const onSetSelected = React.useCallback((code) => {
    if (code === selectedParentSetCode) return;
    setSelectedParentSetCode(code);
  }, [setSelectedParentSetCode]);

  return (
    <div>
      <SetSelector
        selectedSetCode={selectedParentSetCode}
        setSelectedSetCode={onSetSelected}
      />
      <BinderOfSet parentSetCode={selectedParentSetCode}/>
    </div>
  );
};
export default ReportsPage;
