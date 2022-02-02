import { Card, FormControlLabel, TextField } from '@mui/material';
import * as React from 'react';
import { BoxCard, normalizeName } from '../../logic/model';

export type CardFilter = {
    nameQuery: string
}

export const defaultCardFilter : CardFilter = {
    nameQuery: ''
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