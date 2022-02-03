import { orderBy } from 'lodash';
import * as React from 'react';
import { Column, SortDirection, SortDirectionType, Table } from 'react-virtualized';
import { useStore } from '../../hooks';
import { BoxCard } from '../../logic/model';
import { CheckboxCell, SetCell, VersionCell } from '../common/card-table-cells';

type Props = {
    cards: BoxCard[],
}

type SortArgs = {
    sortBy: string,
    sortDirection: SortDirectionType
}

type RowGetterArgs = {
    index: number
}

const CardsTable = (props: Props) => {
    const sets = useStore.sets();
    const cards = useStore.cards();
    const [sortBy, setSortBy] = React.useState('name');
    const [sortDir, setSortDir] = React.useState<SortDirectionType>(SortDirection.ASC);
    const [sortedList, setSortedList] = React.useState(props.cards);

    function sort(args: SortArgs) {
        setSortBy(args.sortBy);
        setSortDir(args.sortDirection);
        setSortedList(orderBy(props.cards, sortBy, sortDir.toLowerCase() as any));
    }

    function getRow(args: RowGetterArgs) : BoxCard {
        return sortedList[args.index];
    }

    return (
        <Table
            width={900}
            height={600}
            headerHeight={20}
            rowHeight={30}
            rowCount={props.cards.length}
            rowGetter={getRow}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDir}
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