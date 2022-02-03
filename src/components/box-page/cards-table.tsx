import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { orderBy } from 'lodash';
import * as React from 'react';
import { Column, SortDirection, SortDirectionType, Table, TableCellProps } from 'react-virtualized';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { BoxCard, normalizeName } from '../../logic/model';
import { CheckboxCell, SetCell, VersionCell } from '../common/card-table-cells';

type Props = {
    cards: BoxCard[],
    onEditClicked: (card: BoxCard) => void,
    onDeleteClicked: (card: BoxCard) => void
}

type SortArgs = {
    sortBy: string,
    sortDirection: SortDirectionType
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

    const [sortBy, setSortBy] = React.useState('name');
    const [sortDir, setSortDir] = React.useState<SortDirectionType>(SortDirection.ASC);
    const [sortedList, setSortedList] = React.useState(props.cards);

    function sort(args: SortArgs) {
        setSortBy(args.sortBy);
        setSortDir(args.sortDirection);
        let sorted : BoxCard[] = [];
        const lodashDir = sortDir.toLowerCase() as any;
        switch (args.sortBy) {
            case 'name':
                sorted = orderBy(sortedList, c => normalizeName(c.name), lodashDir);
            // TODO: Add strategy to sort by set name not abbrev
            default:
                sorted = orderBy(sortedList, sortBy, lodashDir);
                break;
        }
        setSortedList(sorted);
    }

    return (
        <Table
            width={900}
            height={600}
            headerHeight={20}
            rowHeight={30}
            rowCount={props.cards.length}
            rowGetter={({index}) => sortedList[index]}
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