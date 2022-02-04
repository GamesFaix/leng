import { MenuItem, Select } from '@mui/material';
import * as React from 'react';
import { useStore } from '../../hooks';
import SetSymbol from '../common/set-symbol';

type Props = {
    value: string[],
    onChange: (setAbbrevs: string[]) => void
}

const SetFilter = (props: Props) => {
    const sets = useStore.sets();

    return (
        <Select
            sx={{
                width: 200
            }}
            multiple
            value={props.value}
            onChange={e => props.onChange(e.target.value as any)}
        >
            {sets.map(s =>
                <MenuItem
                    key={s.abbrev}
                    value={s.abbrev}
                >
                    <SetSymbol setAbbrev={s.abbrev}/>
                    {`${s.name} (${s.abbrev.toUpperCase()})`}
                </MenuItem>
            )}
        </Select>
    );
}
export default SetFilter;