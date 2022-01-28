import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, IconButton } from '@mui/material';
import * as React from 'react';
import { Column, Table, TableCellProps } from 'react-virtualized';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { BoxCard, SetInfo } from '../../logic/model';

type Props = {
    cards: BoxCard[],
    onEditClicked: (card: BoxCard) => void,
    onDeleteClicked: (card: BoxCard) => void
}

function CheckboxCell(props: TableCellProps) {
    return (
        <Checkbox
            checked={props.cellData}
            disabled
        />
    );
}

function SetCell (props: TableCellProps, sets: SetInfo[]) {
    const set = sets.find(s => s.abbrev === props.cellData);
    return (
        <div>
            {set?.name}
        </div>
    )
}

function ActionsCell (props: TableCellProps, tableProps: Props) {
    return (
        <div>
            <IconButton
                onClick={() => tableProps.onEditClicked(props.rowData)}
            >
                <FontAwesomeIcon icon={icons.edit}/>
            </IconButton>
            <IconButton
                onClick={() => tableProps.onDeleteClicked(props.rowData)}
            >
                <FontAwesomeIcon icon={icons.delete}/>
            </IconButton>
        </div>
    );
}

const CardsTable2 = (props: Props) => {
    const sets = useStore.sets();

    return (
        <Table
            width={900}
            height={600}
            headerHeight={20}
            rowHeight={30}
            rowCount={props.cards.length}
            rowGetter={({ index }) => props.cards[index]}
        >
            <Column
                label='Ct.'
                dataKey='count'
                width={50}
            />
            <Column
                label='Name'
                dataKey='name'
                width={300}
            />
            <Column
                width={200}
                label='Set'
                dataKey='setAbbrev'
                cellRenderer={cellProps => SetCell(cellProps, sets)}
            />
            <Column
                width={150}
                label='Version'
                dataKey='version'
            />
            <Column
                width={50}
                label='Foil'
                dataKey='foil'
                cellRenderer={CheckboxCell}
            />
            <Column
                width={100}
                label='Lang.'
                dataKey='lang'
            />
            <Column
                width={100}
                label='Actions'
                dataKey='name' // not used
                cellRenderer={cellProps => ActionsCell(cellProps, props)}
            />
        </Table>
    );
};
export default CardsTable2;