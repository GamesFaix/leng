import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import * as React from 'react';
import { useStore } from '../../hooks';

type Props = {
    value: string | null,
    onChange: (value: string) => void,
}

const TransferFormBoxSelector = (props: Props) => {
    const boxNames = useStore.boxes().map(b => b.name);

    function onChange(e: SelectChangeEvent) {
        const value = e.target.value ?? null as any as string;
        props.onChange(value);
    }

    return (
        <Select
            value={props.value as any}
            onChange={onChange}
            sx={{
                width: 200
            }}
        >
            {boxNames.map(b =>
                <MenuItem
                    key={b}
                    value={b}
                >
                    {b}
                </MenuItem>
            )}
        </Select>
    );
}
export default TransferFormBoxSelector;