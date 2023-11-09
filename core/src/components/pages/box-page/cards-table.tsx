import { Card, Checkbox, FormControlLabel } from '@mui/material';
import { orderBy } from 'lodash';
import * as React from 'react';
import { Column, SortDirection, SortDirectionType, Table, TableCellProps } from 'react-virtualized';
import { BoxCard, getKey } from '../../../domain/inventory';
import { FinishCell, NameCell, SetCell } from '../../common/card-table-cells';

type Props = {
    cards: BoxCard[],
    selectedKeys: string[],
    onSelectionChanged: (keys: string[]) => void
}

type SortArgs = {
    sortBy: string,
    sortDirection: SortDirectionType
}

function MultiSelectCell (props: TableCellProps, tableProps: Props) {
    const card : BoxCard = props.rowData;
    const key = getKey(card);
    const isSelected = tableProps.selectedKeys.includes(key);

    function onChange (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked && !isSelected) {
            tableProps.onSelectionChanged([...tableProps.selectedKeys, key]);
        }
        else if (!e.target.checked && isSelected) {
            tableProps.onSelectionChanged(tableProps.selectedKeys.filter(k => k !== key));
        }
    }

    return (
        <div>
            <Checkbox
                checked={isSelected}
                onChange={onChange}
            />
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

    const areAllSelected = props.selectedKeys.length === props.cards.length;
    function selectOrDeselectAll(e: React.ChangeEvent<HTMLInputElement>) {
        const newSelection =
            e.target.checked
                ? props.cards.map(getKey)
                : [];

        props.onSelectionChanged(newSelection);
    }

    return (
        <Card sx={{ padding: 1 }}>
            <FormControlLabel
                label='Select all'
                labelPlacement='end'
                control={
                    <Checkbox
                        checked={areAllSelected}
                        onChange={selectOrDeselectAll}
                    />
                }
            />
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
                    width={50}
                    label=''
                    dataKey='name' // not used
                    cellRenderer={cellProps => MultiSelectCell(cellProps, props)}
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
                <Column
                    label='Ct.'
                    dataKey='count'
                    width={50}
                />
            </Table>
        </Card>
    );
};
export default CardsTable;