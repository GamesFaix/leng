import { Card, FormControlLabel, TextField } from '@mui/material';
import * as React from 'react';
import { CardFilter, normalizeName } from '../../logic/model';

type Props = {
    filter: CardFilter,
    onChange: (filter: CardFilter) => void
}

const CardFilterForm = (props: Props) => {
    function updateNameQuery(e: React.ChangeEvent<HTMLInputElement>) {
        props.onChange({
            ...props.filter,
            nameQuery: normalizeName(e.target.value)
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
        </Card>
    )
}
export default CardFilterForm;