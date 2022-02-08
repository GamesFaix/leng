import { Card } from '@mui/material';
import { chunk } from 'lodash';
import * as React from 'react';
import { Grid, GridCellProps } from 'react-virtualized';
import { BoxCard } from '../../logic/model';
import BinderPage from './binder-page';

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

const Binder = (props: Props) => {
    // TODO: Combine foils into same "page pocket"

    const sorted = props.cards.sort(compareCards);
    const pages = chunk(sorted, 9);

    const renderCell = ({ columnIndex, style }: GridCellProps) => {
        const page = pages[columnIndex];
        return (
            <BinderPage
                style={style}
                cards={page}
                key={columnIndex}
                scale={30}
            />
        );
    };

    // TODO: Add sort controls

    return (
        <Card
            style={{
                padding: '5px',
                width: '1000px'
            }}
        >
            <Grid
                cellRenderer={renderCell}
                columnCount={pages.length}
                columnWidth={250}
                height={370}
                rowCount={1}
                rowHeight={350}
                width={1000}
            />
        </Card>
    )
};
export default Binder;