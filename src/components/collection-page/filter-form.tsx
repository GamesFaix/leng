import { Card, FormControlLabel, TextField } from '@mui/material';
import * as React from 'react';
import { normalizeName, SetInfo } from '../../logic/model';
import ColorFilterRuleSelector, { Rule } from '../common/color-filter-rule-selector';
import ColorsSelector, { allColors, Color } from '../common/colors-selector';
import SetSelector from '../common/set-selector';
import BoxSelector from './box-selector';

export type CardFilter = {
    nameQuery: string,
    set: SetInfo | null,
    colors: Color[],
    colorRule: Rule,
    fromBoxes: string[],
    exceptBoxes: string[]
}

export const defaultCardFilter : CardFilter = {
    nameQuery: '',
    set: null,
    colors: [],
    colorRule: Rule.ContainsAny,
    fromBoxes: [],
    exceptBoxes: []
}

type Props = {
    filter: CardFilter,
    onChange: (filter: CardFilter) => void
};

const FilterForm = (props: Props) => {
    function updateNameQuery(e: React.ChangeEvent<HTMLInputElement>) {
        const newFilter = {
            ...props.filter,
            nameQuery: normalizeName(e.target.value)
        };
        props.onChange(newFilter);
    }

    function updateSet(set: SetInfo | null) {
        const newFilter = {
            ...props.filter,
            set
        };
        props.onChange(newFilter);
    }

    function updateColors(colors: Color[]) {
        const newFilter = {
            ...props.filter,
            colors
        };
        props.onChange(newFilter);
    }

    function updateColorRule(colorRule: Rule) {
        const newFilter = {
            ...props.filter,
            colorRule
        };
        props.onChange(newFilter);
    }

    function updateFromBoxes(fromBoxes: string[]) {
        const newFilter = {
            ...props.filter,
            fromBoxes
        };
        props.onChange(newFilter);
    }

    function updateExceptBoxes(exceptBoxes: string[]) {
        const newFilter = {
            ...props.filter,
            exceptBoxes
        };
        props.onChange(newFilter);
    }

    return (
        <Card sx={{ width: 700, padding: 1 }}>
            <FormControlLabel
                label="Name includes"
                labelPlacement='top'
                control={
                    <TextField
                        title="Name includes"
                        value={props.filter.nameQuery}
                        onChange={updateNameQuery}
                    />
                }
            />
            <SetSelector
                value={props.filter.set}
                onChange={updateSet}
            />
            <FormControlLabel
                sx={{
                    border: "1px solid gainsboro",
                    borderRadius: "3px"
                }}
                label="Color"
                labelPlacement='top'
                control={<div>
                    <ColorFilterRuleSelector
                        value={props.filter.colorRule}
                        onChange={updateColorRule}
                    />
                    <ColorsSelector
                        value={props.filter.colors}
                        onChange={updateColors}
                    />
                </div>}
            />
            <FormControlLabel
                sx={{
                    border: "1px solid gainsboro",
                    borderRadius: "3px"
                }}
                label="Boxes"
                labelPlacement='top'
                control={<div>
                    <FormControlLabel
                        label="In"
                        labelPlacement='top'
                        control={
                            <BoxSelector
                                value={props.filter.fromBoxes}
                                onChange={updateFromBoxes}
                            />
                        }
                    />
                    <FormControlLabel
                        label="Except"
                        labelPlacement='top'
                        control={
                            <BoxSelector
                                value={props.filter.exceptBoxes}
                                onChange={updateExceptBoxes}
                            />
                        }
                    />
                </div>}
            />
        </Card>
    );
}
export default FilterForm;