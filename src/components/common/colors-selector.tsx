import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import * as React from 'react';

export type Color = 'W' | 'U' | 'B' | 'R' | 'G' | 'C'

export const allColors : Color[] = ['W', 'U', 'B', 'R', 'G', 'C'];

function getOptionLabel(color: Color) : string {
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
    value: Color[],
    onChange: (value: Color[]) => void
}

const ColorsSelector = (props: Props) => {
    function onChange(e: SelectChangeEvent) {
        const value = e.target.value as any as Color[];
        props.onChange(value);
    }

    return (
        <Select
            value={props.value as any}
            multiple
            onChange={onChange}
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