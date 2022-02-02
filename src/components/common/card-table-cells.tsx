import { Checkbox } from '@mui/material';
import * as React from 'react';
import { TableCellProps } from 'react-virtualized';
import { Card } from 'scryfall-api';
import { SetInfo } from '../../logic/model';
import { getVersionLabel } from '../box-page/card-form';

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

export function VersionCell (props: TableCellProps, cards: Card[]) {
    const card = cards.find(c => c.id === props.rowData.scryfallId);
    const version = card ? getVersionLabel(card) : '';
    return (
        <div>
            {version}
        </div>
    );
}