import { Card, FormControlLabel, TextField } from '@mui/material';
import * as React from 'react';
import { CardFilter } from '../../logic/model';
import BoxSelector from './box-selector';
import ColorRuleSelector, { ColorFilterRule } from './color-rule-selector';
import ColorsSelector, { ColorFilter } from './color-selector';
import SetFilter from './set-filter';

type Props = {
    filter: CardFilter,
    onChange: (filter: CardFilter) => void
}

const CardFilterForm = (props: Props) => {
    function updateNameQuery(e: React.ChangeEvent<HTMLInputElement>) {
        props.onChange({ ...props.filter, nameQuery: e.target.value })
    }

    function updateSetAbbrevs(setAbbrevs: string[]) {
        props.onChange({ ...props.filter, setAbbrevs })
    }

    function updateColorRule(colorRule: ColorFilterRule) {
        props.onChange({ ...props.filter, colorRule })
    }

    function updateColors(colors: ColorFilter[]) {
        props.onChange({ ...props.filter, colors })
    }

    function updateFromBoxes(fromBoxes: string[]) {
        props.onChange({ ...props.filter, fromBoxes })
    }
    function updateExceptBoxes(exceptBoxes: string[]) {
        props.onChange({ ...props.filter, exceptBoxes })
    }

    return (
        <Card
            sx={{
                width: 700,
                padding: 1
            }}
        >
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
            <FormControlLabel
                label="Sets"
                labelPlacement='top'
                control={
                    <SetFilter
                        value={props.filter.setAbbrevs}
                        onChange={updateSetAbbrevs}
                    />
                }
            />
            <br/>
            <br/>
            <FormControlLabel
                sx={{
                    border: "1px solid gainsboro",
                    borderRadius: "3px"
                }}
                label="Color"
                labelPlacement='top'
                control={<div>
                    <ColorRuleSelector
                        value={props.filter.colorRule}
                        onChange={updateColorRule}
                    />
                    <ColorsSelector
                        value={props.filter.colors}
                        onChange={updateColors}
                    />
                </div>}
            />
            <br/>
            <br/>
            <FormControlLabel
                sx={{
                    border: "1px solid gainsboro",
                    borderRadius: "3px",
                    marginLeft: "6px",
                    marginRight: "6px"
                }}
                label="Boxes"
                labelPlacement='top'
                control={<div>
                    <FormControlLabel
                        label="From"
                        labelPlacement='start'
                        control={
                            <BoxSelector
                                value={props.filter.fromBoxes}
                                onChange={updateFromBoxes}
                            />
                        }
                    />
                    <FormControlLabel
                        label="Except"
                        labelPlacement='start'
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
    )
}
export default CardFilterForm;