import { Card, FormControlLabel, Select, TextField } from '@mui/material';
import * as React from 'react';
import { CardFilter, normalizeName, SetInfo } from '../../logic/model';
import SetFilter from './set-filter';

type Props = {
    filter: CardFilter,
    onChange: (filter: CardFilter) => void
}

const CardFilterForm = (props: Props) => {
    function updateNameQuery(e: React.ChangeEvent<HTMLInputElement>) {
        props.onChange({
            ...props.filter,
            nameQuery: e.target.value
        })
    }

    function updateSets(sets: SetInfo[]) {
        props.onChange({
            ...props.filter,
            sets
        })
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
            <SetFilter
                value={props.filter.sets}
                onChange={updateSets}
            />
        </Card>
    )
}
export default CardFilterForm;