import * as React from 'react';
import { Column, Table } from 'react-virtualized';
import { useStore } from '../../hooks';
import { BoxCard } from '../../logic/model';
import { CheckboxCell, SetCell, VersionCell } from '../common/card-table-cells';

type Props = {
    cards: BoxCard[],
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
        </Table>
    );
};
export default CardsTable;