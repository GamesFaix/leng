import { Autocomplete, TextField } from '@mui/material';
import * as React from 'react';
import { useStore } from '../../hooks';
import { SetInfo } from '../../logic/model';

type Props = {
    setOptions?: SetInfo[],
    value: SetInfo | null,
    onChange: (value: SetInfo | null) => void,
}

const SetSelector = (props: Props) => {
    const allSets = useStore.sets()
        .map(s => { return { ...s, label: `${s.name} (${s.abbrev.toUpperCase()})` }});;
    const setOptions = props.setOptions ?? allSets;

    return (
        <Autocomplete
            className="control"
            options={setOptions}
            sx={{ width: 300 }}
            renderInput={(params) =>
                <TextField {...params}
                    label="Set"
                    onFocus={e => e.target.select()}
                />}
            onChange={(e, value, reason) => props.onChange(value)}
            disabled={setOptions.length < 2}
            value={props.value}
            autoSelect
            autoHighlight
            selectOnFocus
            openOnFocus
        />
    );
}
export default SetSelector;