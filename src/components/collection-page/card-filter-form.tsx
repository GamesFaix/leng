import { Card, FormControlLabel, TextField } from '@mui/material';
import * as React from 'react';
import { CardFilter } from '../../logic/model';
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

    function updateSetAbbrevs(setAbbrevs: string[]) {
        props.onChange({
            ...props.filter,
            setAbbrevs
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
        </Card>
    )
}
export default CardFilterForm;