import { Checkbox } from '@mui/material';
import * as React from 'react';
import { TableCellProps } from 'react-virtualized';
import SetSymbol from './set-symbol';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';

export const CheckboxCell = (props: TableCellProps) => {
    return (
        <Checkbox
            checked={props.cellData}
            disabled
        />
    );
}

export const SetCell : React.FC<TableCellProps> = (props: TableCellProps) => {
    const abbrev = props.cellData;
    const set = useSelector(selectors.set(abbrev));
    return (
        <div className="set-container">
            <SetSymbol setAbbrev={set!.code}/>
            {set!.name}
        </div>
    )
}
