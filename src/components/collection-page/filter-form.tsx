import { Card, FormControlLabel, TextField } from '@mui/material';
import * as React from 'react';
import { normalizeName, SetInfo } from '../../logic/model';
import ColorsSelector, { allColors, Color } from '../common/colors-selector';
import SetSelector from '../common/set-selector';

export type CardFilter = {
    nameQuery: string,
    set: SetInfo | null,
    colors: Color[],
}

export const defaultCardFilter : CardFilter = {
    nameQuery: '',
    set: null,
    colors: allColors
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
            <ColorsSelector
                value={props.filter.colors}
                onChange={updateColors}
            />
            {/* <FormControlLabel
                label="Set"
                labelPlacement='top'
                control={
                    <TextField
                        title="Name includes"
                        value={props.filter.nameQuery}
                        onChange={updateNameQuery}
                    />
                }
            /> */}
            {/* <TextField
                title="Types"
            />
            <Autocomplete
                title="Set"
            /> */}
        </Card>
    );
}
export default FilterForm;