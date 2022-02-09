import { Checkbox } from '@mui/material';
import * as React from 'react';
import { TableCellProps } from 'react-virtualized';
import { Set } from 'scryfall-api';
import SetSymbol from './set-symbol';

export function CheckboxCell(props: TableCellProps) {
    return (
        <Checkbox
            checked={props.cellData}
            disabled
        />
    );
}

export function SetCell (props: TableCellProps, sets: Set[]) {
    const set = sets.find(s => s.code === props.cellData);
    return (
        <div className="set-container">
            <SetSymbol setAbbrev={set!.code}/>
            {set!.name}
        </div>
    )
}
