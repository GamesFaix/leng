import { Card, FormControlLabel, TextField } from '@mui/material';
import * as React from 'react';
import { normalizeName, SetInfo } from '../../logic/model';
import SetSelector from '../common/set-selector';

export type CardFilter = {
    nameQuery: string,
    set: SetInfo | null
}

export const defaultCardFilter : CardFilter = {
    nameQuery: '',
    set: null,
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