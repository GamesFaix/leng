import { MenuItem, Select } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'leng-core/src/store/selectors';
import { SetSymbol } from 'leng-core/src/components/common';

type Props = {
    value: string[],
    onChange: (setAbbrevs: string[]) => void
}

const SetFilter = (props: Props) => {
    const sets = useSelector(selectors.sets);

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
                    key={s.code}
                    value={s.code}
                >
                    <SetSymbol setAbbrev={s.code}/>
                    {`${s.name} (${s.code.toUpperCase()})`}
                </MenuItem>
            )}
        </Select>
    );
}
export default SetFilter;