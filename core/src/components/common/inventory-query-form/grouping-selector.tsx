import { Checkbox, FormControlLabel } from "@mui/material";
import { ChangeEvent, FC, useCallback } from "react";
import { CardGroupingOptions } from "../../../domain/inventory-search";

type Props = {
  value: CardGroupingOptions;
  onChange: (value: CardGroupingOptions) => void;
};

export const GroupingSelector: FC<Props> = ({ value, onChange }) => {
  const onCombineSetsChanges = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...value,
        combineSets: e.target.checked,
        // It doesn't make sense to combine sets but not arts
        combineArts: e.target.checked ? true : value.combineArts,
      });
    },
    [value, onChange]
  );

  const onCombineArtsChanges = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...value,
        combineArts: e.target.checked,
        combineSets: e.target.checked ? value.combineSets : false,
      });
    },
    [value, onChange]
  );

  const onCombineFinishesChanges = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, combineFinishes: e.target.checked });
    },
    [value, onChange]
  );

  const onCombineLangsChanges = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, combineLanguages: e.target.checked });
    },
    [value, onChange]
  );

  return (
    <div>
      <FormControlLabel
        label="Combine sets"
        labelPlacement="end"
        control={
          <Checkbox
            checked={value.combineSets}
            onChange={onCombineSetsChanges}
          />
        }
      />
      <FormControlLabel
        label="Combine arts"
        labelPlacement="end"
        control={
          <Checkbox
            checked={value.combineArts}
            onChange={onCombineArtsChanges}
          />
        }
      />
      <FormControlLabel
        label="Combine finishes"
        labelPlacement="end"
        control={
          <Checkbox
            checked={value.combineFinishes}
            onChange={onCombineFinishesChanges}
          />
        }
      />
      <FormControlLabel
        label="Combine languages"
        labelPlacement="end"
        control={
          <Checkbox
            checked={value.combineLanguages}
            onChange={onCombineLangsChanges}
          />
        }
      />
    </div>
  );
};
