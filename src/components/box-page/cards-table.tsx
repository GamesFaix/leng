import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { orderBy } from 'lodash';
import * as React from 'react';
import { Column, SortDirection, SortDirectionType, Table, TableCellProps } from 'react-virtualized';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { BoxCard } from '../../logic/model';
import { CheckboxCell, SetCell } from '../common/card-table-cells';

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
    const sets = useStore.sets();

    const [sortBy, setSortBy] = React.useState('name');
    const [sortDirection, setSortDirection] = React.useState<SortDirectionType>(SortDirection.ASC);
    const [unsortedList, setUnsortedList] = React.useState(props.cards);
    const [sortedList, setSortedList] = React.useState(props.cards);
    const [noSort, setNoSort] = React.useState(false);

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

    function getRow(index: number) {
        return noSort
            ? props.cards[index]
            : sortedList[index];
    }

    return (
        <Card sx={{ width: 900, padding: 1 }}>
            <FormControlLabel
                label='Latest changes first'
                labelPlacement='end'
                control={
                    <Checkbox
                        checked={noSort}
                        onChange={e => setNoSort(e.target.checked)}
                    />
                }
            />
            <Table
                width={900}
                height={600}
                headerHeight={20}
                rowHeight={30}
                rowCount={sortedList.length}
                rowGetter={({index}) => getRow(index)}
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
                    dataKey='versionLabel'
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
        </Card>
    );
};
export default CardsTable;