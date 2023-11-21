import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ChangeEvent, FC, useCallback, useState } from "react";
import { CardGroupingOptions } from "../../../domain/inventory-search";

type Props = {
  value: CardGroupingOptions;
  onChange: (value: CardGroupingOptions) => void;
};

export const GroupingSelector: FC<Props> = ({ value, onChange }) => {
  const [all, setAll] = useState(
    value.combineArts &&
      value.combineFinishes &&
      value.combineLanguages &&
      value.combineSets
  );

  const onCombineSetsChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      onChange({
        ...value,
        combineSets: checked,
        // It doesn't make sense to combine sets but not arts
        combineArts: checked ? true : value.combineArts,
      });
      if (all && !checked) {
        setAll(false);
      }
    },
    [value, onChange]
  );

  const onCombineArtsChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      onChange({
        ...value,
        combineArts: checked,
        combineSets: checked ? value.combineSets : false,
      });
      if (all && !checked) {
        setAll(false);
      }
    },
    [value, onChange]
  );

  const onCombineFinishesChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      onChange({ ...value, combineFinishes: checked });
      if (all && !checked) {
        setAll(false);
      }
    },
    [value, onChange]
  );

  const onCombineLangsChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      onChange({ ...value, combineLanguages: checked });
      if (all && !checked) {
        setAll(false);
      }
    },
    [value, onChange]
  );

  const onCombineAllChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      onChange({
        combineSets: checked,
        combineArts: checked,
        combineFinishes: checked,
        combineLanguages: checked,
      });
      setAll(checked);
    },
    [value, onChange]
  );

  return (
    <div>
      <span>Combine</span>
      <FormControlLabel
        label="Sets"
        labelPlacement="end"
        control={
          <Checkbox
            checked={value.combineSets}
            onChange={onCombineSetsChanged}
          />
        }
      />
      <FormControlLabel
        label="Arts"
        labelPlacement="end"
        control={
          <Checkbox
            checked={value.combineArts}
            onChange={onCombineArtsChanged}
          />
        }
      />
      <FormControlLabel
        label="Finishes"
        labelPlacement="end"
        control={
          <Checkbox
            checked={value.combineFinishes}
            onChange={onCombineFinishesChanged}
          />
        }
      />
      <FormControlLabel
        label="Languages"
        labelPlacement="end"
        control={
          <Checkbox
            checked={value.combineLanguages}
            onChange={onCombineLangsChanged}
          />
        }
      />
      <FormControlLabel
        label="(All)"
        labelPlacement="end"
        control={<Checkbox checked={all} onChange={onCombineAllChanged} />}
      />
    </div>
  );
};
