import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from "../../../store";

type Props = {
    value: string | null,
    onChange: (value: string | null) => void,
}

const TransferFormBoxSelector = (props: Props) => {
    const boxNames = useSelector(selectors.boxes).map(b => b.name);

    function onChange(e: SelectChangeEvent) {
        let value : string | null = e.target.value;
        if (value === '') { value = null; }
        props.onChange(value);
    }

    return (
        <Select
            value={props.value ?? ''}
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