import { orderBy } from 'lodash';
import * as React from 'react';
import { Column, SortDirection, SortDirectionType, Table } from 'react-virtualized';
import { BoxCard } from "leng-core/src/logic/model";
import { SetCell, NameCell, FinishCell } from '../common/card-table-cells';

type Props = {
    cards: BoxCard[],
}

type SortArgs = {
    sortBy: string,
    sortDirection: SortDirectionType
}

function sortInner(cards: BoxCard[], by: string, dir: SortDirectionType) : BoxCard[] {
    const lodashDir = dir.toLowerCase() as any;
    switch (by) {
        case 'name':
            return orderBy(cards, c => c.normalizedName, lodashDir);
        // TODO: Add strategy to sort by set name not abbrev
        default:
            return orderBy(cards, by, lodashDir);
    }
}

const CardsTable = (props: Props) => {
    const [sortBy, setSortBy] = React.useState('name');
    const [sortDirection, setSortDirection] = React.useState<SortDirectionType>(SortDirection.ASC);
    const [unsortedList, setUnsortedList] = React.useState(props.cards);
    const [sortedList, setSortedList] = React.useState(props.cards);

    React.useEffect(() => {
        if (props.cards !== unsortedList) {
            setUnsortedList(props.cards);
            setSortedList(sortInner(props.cards, sortBy, sortDirection));
        }
    })

    function sort(args: SortArgs) {
        setSortBy(args.sortBy);
        setSortDirection(args.sortDirection);
        setSortedList(sortInner(props.cards, args.sortBy, args.sortDirection));
    }

    return (
        <Table
            width={900}
            height={600}
            headerHeight={20}
            rowHeight={30}
            rowCount={sortedList.length}
            rowGetter={({index}) => sortedList[index]}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
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
                cellRenderer={props => <NameCell {...props}/>}
            />
            <Column
                width={200}
                label='Set'
                dataKey='setAbbrev'
                cellRenderer={props => <SetCell {...props}/>}
            />
            <Column
                width={100}
                label='Version'
                dataKey='versionLabel'
            />
            <Column
                width={50}
                label='Finish'
                dataKey='finish'
                cellRenderer={FinishCell}
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