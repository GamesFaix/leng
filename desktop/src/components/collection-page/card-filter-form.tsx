import { Button, FormControlLabel, TextField } from "@mui/material";
import * as React from "react";
import { Format } from "../../logic/formats";
import { CardFilter } from "../../logic/model";
import CollapsableCard from "../common/collapsable-card";
import BoxSelector from "./box-selector";
import ColorRuleSelector, { ColorFilterRule } from "./color-rule-selector";
import ColorsSelector, { ColorFilter } from "./color-selector";
import FormatFilter from "./format-filter";
import SetFilter from "./set-filter";

type Props = {
  filter: CardFilter;
  onChange: (filter: CardFilter) => void;
  submitScryfallSearch: () => void;
};

const CardFilterForm = (props: Props) => {
  function updateNameQuery(e: React.ChangeEvent<HTMLInputElement>) {
    props.onChange({ ...props.filter, nameQuery: e.target.value });
  }

  function updateSetAbbrevs(setAbbrevs: string[]) {
    props.onChange({ ...props.filter, setAbbrevs });
  }

  function updateColorRule(colorRule: ColorFilterRule) {
    props.onChange({ ...props.filter, colorRule });
  }

  function updateColors(colors: ColorFilter[]) {
    props.onChange({ ...props.filter, colors });
  }

  function updateFromBoxes(fromBoxes: string[]) {
    props.onChange({ ...props.filter, fromBoxes });
  }

  function updateExceptBoxes(exceptBoxes: string[]) {
    props.onChange({ ...props.filter, exceptBoxes });
  }

  function updateFormat(format: Format | null) {
    props.onChange({ ...props.filter, format });
  }

  function updateScryfallQuery(e: React.ChangeEvent<HTMLInputElement>) {
    props.onChange({ ...props.filter, scryfallQuery: e.target.value });
  }

  return (
    <CollapsableCard title="Card filters">
      <FormControlLabel
        label="Name includes"
        labelPlacement="top"
        control={
          <TextField
            title="Name includes"
            value={props.filter.nameQuery}
            onChange={updateNameQuery}
          />
        }
      />
      <FormControlLabel
        label="Sets"
        labelPlacement="top"
        control={
          <SetFilter
            value={props.filter.setAbbrevs}
            onChange={updateSetAbbrevs}
          />
        }
      />
      <FormControlLabel
        label="Format"
        labelPlacement="top"
        control={
          <FormatFilter value={props.filter.format} onChange={updateFormat} />
        }
      />
      <div style={{ display: "flex" }}>
        <FormControlLabel
          label="Scryfall query"
          labelPlacement="top"
          control={
            <TextField
              title="Scryfall query"
              value={props.filter.scryfallQuery}
              onChange={updateScryfallQuery}
              style={{ width: "300px" }}
              onKeyDown={(e) => {
                if (e.key.toLowerCase() === "enter") {
                  props.submitScryfallSearch();
                }
              }}
            />
          }
        />
        <Button onClick={() => props.submitScryfallSearch()}>Search</Button>
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
              value={props.filter.colorRule}
              onChange={updateColorRule}
            />
            <ColorsSelector
              value={props.filter.colors}
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
                  value={props.filter.fromBoxes}
                  onChange={updateFromBoxes}
                />
              }
            />
            <FormControlLabel
              label="Except"
              control={
                <BoxSelector
                  value={props.filter.exceptBoxes}
                  onChange={updateExceptBoxes}
                />
              }
            />
          </div>
        }
      />
    </CollapsableCard>
  );
};
export default CardFilterForm;
