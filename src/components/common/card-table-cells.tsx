import { Checkbox, Tooltip } from '@mui/material';
import * as React from 'react';
import { TableCellProps } from 'react-virtualized';
import SetSymbol from './set-symbol';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';
import { BoxCard } from '../../logic/model';
import CardImage from './card-image';

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

export const NameCell : React.FC<TableCellProps> = (props: TableCellProps) => {
    const card : BoxCard = props.rowData;
    return (
        <Tooltip
            title={
                <div style={{ width: '125px', height: '175px' }}>
                    <CardImage scryfallId={card.scryfallId}/>
                </div>
            }
        >
            <div>
                {card.name}
            </div>
        </Tooltip>
    )
}
