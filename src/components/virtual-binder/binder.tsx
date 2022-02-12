import { Card } from '@mui/material';
import { chunk, groupBy, orderBy } from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Grid, GridCellProps } from 'react-virtualized';
import { Set } from 'scryfall-api';
import { innerJoin } from '../../logic/array-helper';
import { BoxCard } from '../../logic/model';
import selectors from '../../store/selectors';
import BinderPage from './binder-page';

const scale = 60;

type Props = {
    cards: BoxCard[]
}

function compareCards(a: BoxCard, b: BoxCard) {
    const pattern = /(\d+)(.*)/
    const matchA = pattern.exec(a.collectorsNumber);
    const matchB = pattern.exec(b.collectorsNumber);
    const numA = Number(matchA![1]);
    const numB = Number(matchB![1]);
    if (numA < numB) {
        return -1;
    } else if (numA > numB) {
        return 1;
    }

    const mscA = matchA![2];
    const mscB = matchB![2];
    if (mscA < mscB) {
        return -1;
    } else if (mscA > mscB) {
        return 1;
    }

    return 0;
}

function organizePages(cards: BoxCard[], sets: Set[]) : BoxCard[][] {
    // TODO: Combine foils into same "page pocket"

    const groupedBySet = groupBy(cards, c => c.setAbbrev);

    const setsWithCards = innerJoin(
        sets,
        Object.entries(groupedBySet),
        set => set.code,
        grp => grp[0],
        (set, grp) => [set, grp[1]]);

    const setsWithPages = setsWithCards
        .map(tup => {
            const set = tup[0] as Set;
            const cards = tup[1] as BoxCard[];
            const sorted = cards.sort(compareCards);
            return [set, chunk(sorted, 9)];
        });

    const sortedSets =
        orderBy(setsWithPages, tup => {
            const set = tup[0] as Set;
            return set.released_at;
        });

    const pages = sortedSets
        .map(tup => tup[1] as BoxCard[][])
        .reduce((a,b) => a.concat(b), []);

    return pages;
}

const Binder = (props: Props) => {
    const sets = useSelector(selectors.sets);
    const pages = organizePages(props.cards, sets);

    const renderCell = ({ columnIndex, style }: GridCellProps) => {
        const page = pages[columnIndex];
        return (
            <BinderPage
                style={style}
                cards={page}
                key={columnIndex}
                scale={scale}
            />
        );
    };

    // TODO: Add sort controls

    return (
        <Card
            style={{
                padding: '5px',
                width: '1800px'
            }}
        >
            <Grid
                cellRenderer={renderCell}
                columnCount={pages.length}
                columnWidth={500}
                height={740}
                rowCount={1}
                rowHeight={700}
                width={1800}
            />
        </Card>
    )
};
export default Binder;