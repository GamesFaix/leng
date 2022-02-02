import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import * as React from 'react';
import { Column, Table, TableCellProps } from 'react-virtualized';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { BoxCard } from '../../logic/model';
import { CheckboxCell, SetCell, VersionCell } from '../common/card-table-cells';

type Props = {
    cards: BoxCard[],
    onEditClicked: (card: BoxCard) => void,
    onDeleteClicked: (card: BoxCard) => void
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

const CardsTable = (props: Props) => {
    const sets = useStore.sets();
    const cards = useStore.cards();

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
                width={100}
                label='Version'
                dataKey='version'
                cellRenderer={cellProps => VersionCell(cellProps, cards)}
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
export default CardsTable;