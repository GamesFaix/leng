import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import * as React from 'react';

export type ColorFilter = 'W' | 'U' | 'B' | 'R' | 'G' | 'C'

export const allColors : ColorFilter[] = ['W', 'U', 'B', 'R', 'G', 'C'];

function getOptionLabel(color: ColorFilter) : string {
    switch (color) {
        case 'W': return 'White';
        case 'U': return 'Blue';
        case 'B': return 'Black';
        case 'R': return 'Red';
        case 'G': return 'Green';
        case 'C': return 'Colorless';
    }
}

type Props = {
    value: ColorFilter[],
    onChange: (value: ColorFilter[]) => void
}

const ColorsSelector = (props: Props) => {
    function onChange(e: SelectChangeEvent) {
        const value = e.target.value as any as ColorFilter[];
        props.onChange(value);
    }

    return (
        <Select
            value={props.value as any}
            multiple
            onChange={onChange}
            sx={{
                width: 200
            }}
        >
            {allColors.map(c =>
                <MenuItem
                    key={c}
                    value={c}
                >
                    {getOptionLabel(c)}
                </MenuItem>
            )}
        </Select>
    );
}
export default ColorsSelector;