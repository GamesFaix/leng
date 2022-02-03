import { Checkbox } from '@mui/material';
import * as React from 'react';
import { TableCellProps } from 'react-virtualized';
import { SetInfo } from '../../logic/model';

export function CheckboxCell(props: TableCellProps) {
    return (
        <Checkbox
            checked={props.cellData}
            disabled
        />
    );
}

export function SetCell (props: TableCellProps, sets: SetInfo[]) {
    const set = sets.find(s => s.abbrev === props.cellData);
    return (
        <div>
            {set?.name}
        </div>
    )
}
