import { Button, FormControlLabel, TextField } from "@mui/material";
import { BoxSelector } from "./box-selector";
import { ColorRuleSelector } from "./color-rule-selector";
import { ColorsSelector } from "./color-selector";
import { FormatFilter } from "./format-filter";
import { SetFilter } from "./set-filter";
import { CollapsableCard } from "../collapsable-card";
import { ColorFilterRule, ColorFilter } from "../../../domain/filters";
import { Format } from "../../../domain/formats";
import { GroupingSelector } from "./grouping-selector";
import { FC, useCallback } from "react";
import {
  CardGroupingOptions,
  InventoryQuery,
} from "../../../domain/inventory-search";

type Props = {
  value: InventoryQuery;
  onChange: (value: InventoryQuery) => void;
  submitScryfallSearch: () => void;
};

export const InventoryQueryForm: FC<Props> = ({
  value,
  onChange,
  submitScryfallSearch,
}) => {
  const updateNameQuery = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({
        ...value,
        filter: { ...value.filter, nameQuery: e.target.value },
      }),
    [value, onChange]
  );

  const updateSetAbbrevs = useCallback(
    (setAbbrevs: string[]) =>
      onChange({ ...value, filter: { ...value.filter, setAbbrevs } }),
    [value, onChange]
  );

  const updateColorRule = useCallback(
    (colorRule: ColorFilterRule) =>
      onChange({ ...value, filter: { ...value.filter, colorRule } }),
    [value, onChange]
  );

  const updateColors = useCallback(
    (colors: ColorFilter[]) =>
      onChange({ ...value, filter: { ...value.filter, colors } }),
    [value, onChange]
  );

  const updateFromBoxes = useCallback(
    (fromBoxes: string[]) =>
      onChange({ ...value, filter: { ...value.filter, fromBoxes } }),
    [value, onChange]
  );

  const updateExceptBoxes = useCallback(
    (exceptBoxes: string[]) =>
      onChange({ ...value, filter: { ...value.filter, exceptBoxes } }),
    [value, onChange]
  );

  const updateFormat = useCallback(
    (format: Format | null) =>
      onChange({ ...value, filter: { ...value.filter, format } }),
    [value, onChange]
  );

  const updateScryfallQuery = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({
        ...value,
        filter: { ...value.filter, scryfallQuery: e.target.value },
      }),
    [value, onChange]
  );

  const updateGrouping = useCallback(
    (grouping: CardGroupingOptions) => onChange({ ...value, grouping }),
    [value, onChange]
  );

  return (
    <CollapsableCard title="Search options">
      <FormControlLabel
        label="Name includes"
        labelPlacement="top"
        control={
          <TextField
            title="Name includes"
            value={value.filter.nameQuery}
            onChange={updateNameQuery}
          />
        }
      />
      <FormControlLabel
        label="Sets"
        labelPlacement="top"
        control={
          <SetFilter
            value={value.filter.setAbbrevs}
            onChange={updateSetAbbrevs}
          />
        }
      />
      <FormControlLabel
        label="Format"
        labelPlacement="top"
        control={
          <FormatFilter value={value.filter.format} onChange={updateFormat} />
        }
      />
      <div style={{ display: "flex" }}>
        <FormControlLabel
          label="Scryfall query"
          labelPlacement="top"
          control={
            <TextField
              title="Scryfall query"
              value={value.filter.scryfallQuery}
              onChange={updateScryfallQuery}
              style={{ width: "300px" }}
              onKeyDown={(e) => {
                if (e.key.toLowerCase() === "enter") {
                  submitScryfallSearch();
                }
              }}
            />
          }
        />
        <Button onClick={() => submitScryfallSearch()}>Search</Button>
      </div>
      <br />
      <br />
      <FormControlLabel
        sx={{
          border: "1px solid gainsboro",
          borderRadius: "3px",
        }}
        label="Color"
        labelPlacement="top"
        control={
          <div>
            <ColorRuleSelector
              value={value.filter.colorRule}
              onChange={updateColorRule}
            />
            <ColorsSelector
              value={value.filter.colors}
              onChange={updateColors}
            />
          </div>
        }
      />
      <br />
      <br />
      <FormControlLabel
        sx={{
          border: "1px solid gainsboro",
          borderRadius: "3px",
        }}
        label="Boxes"
        labelPlacement="top"
        control={
          <div>
            <FormControlLabel
              label="From"
              control={
                <BoxSelector
                  value={value.filter.fromBoxes}
                  onChange={updateFromBoxes}
                />
              }
            />
            <FormControlLabel
              label="Except"
              control={
                <BoxSelector
                  value={value.filter.exceptBoxes}
                  onChange={updateExceptBoxes}
                />
              }
            />
          </div>
        }
      />
      <GroupingSelector value={value.grouping} onChange={updateGrouping} />
    </CollapsableCard>
  );
};
