import { MenuItem, Select } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';

type Props = {
    value: string | null,
    onChange: (value: string | null) => void
}

const FormatFilter = (props: Props) => {
    const formats = useSelector(selectors.formats);

    return (
        <Select
            sx={{
                width: 200
            }}
            value={props.value}
            onChange={e => props.onChange(e.target.value as any)}
        >
            {formats.map(f =>
                <MenuItem
                    key={f}
                    value={f}
                >
                    {f}
                </MenuItem>
            )}
        </Select>
    );
}
export default FormatFilter;